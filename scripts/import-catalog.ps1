param(
  [string]$OnlyBrand = ''
)

$ErrorActionPreference = 'Stop'

$sourceRoot = 'C:\Users\Eslam\Desktop\YAM\DATA'
$publicRoot = Join-Path $PSScriptRoot '..\public\catalog'
$outputFile = Join-Path $PSScriptRoot '..\lib\imported-catalog.ts'

New-Item -ItemType Directory -Force -Path $publicRoot | Out-Null

function Convert-ToId([string]$value) {
  $id = $value.ToLowerInvariant() -replace '[^a-z0-9]+', '-'
  return $id.Trim('-')
}

function Get-ImageNumber([System.IO.FileInfo]$image) {
  $numberMatch = [regex]::Match($image.BaseName, '^\d+')
  if ($numberMatch.Success) { return [int]$numberMatch.Value }
  return [int]::MaxValue
}

function Get-BrandLogo([string]$brandName) {
  $domains = @{
    Dahua = 'dahuasecurity.com'
    Ezviz = 'ezviz.com'
    Hikvision = 'hikvision.com'
    HILOOK = 'hikvision.com'
    PIVOTIC = 'pivotic.com'
    UNV = 'uniview.com'
    ELVA = 'elva.com'
  }
  $domain = $domains[$brandName]
  if (-not $domain) { return '' }
  return "https://www.google.com/s2/favicons?domain=$domain&sz=128"
}

function Get-Category([string]$relativePath) {
  $path = $relativePath.ToLowerInvariant()
  if ($path -match 'pivotic') { return @{ id = 'smart-switches'; name = 'Smart Switches'; icon = 'toggle_on'; sub = 'smart-switches' } }
  if ($path -match 'nvr|dvr') { return @{ id = 'recorders'; name = 'NVRs & DVRs'; icon = 'dns'; sub = 'recorders' } }
  if ($path -match 'switch') { return @{ id = 'networking'; name = 'Networking'; icon = 'settings_ethernet'; sub = 'switches' } }
  if ($path -match 'access control|intercome|intercom') { return @{ id = 'access'; name = 'Access Control'; icon = 'lock'; sub = 'intercom' } }
  if ($path -match 'smart|panel') { return @{ id = 'smart-home'; name = 'Smart Home'; icon = 'lightbulb'; sub = 'switches' } }
  return @{ id = 'cctv'; name = 'CCTV'; icon = 'videocam'; sub = 'cameras' }
}

function Get-PivoticProducts([string]$text, [string]$brandId, [string]$brandName, [string[]]$imageUrls) {
  $blocks = [regex]::Split($text, '(?m)(?=^###\s+\d+\.)') | Where-Object { $_ -match '\*\*Product Name:\*\*' }
  $products = @()
  $productIndex = 0
  foreach ($block in $blocks) {
    $nameMatch = [regex]::Match($block, '(?im)^\*\*Product Name:\*\*\s*(.+)$')
    $modelMatch = [regex]::Match($block, '(?im)^\*\*Model / Code:\*\*\s*(.+)$')
    $name = $nameMatch.Groups[1].Value.Trim()
    $model = $modelMatch.Groups[1].Value.Trim()
    $priceMatches = [regex]::Matches($block, '(?im)\*\*\s*([0-9][0-9,]*)\s*EGP')
    $variants = @()
    $priceIndex = 0
    foreach ($priceMatch in $priceMatches) {
      $price = [int]($priceMatch.Groups[1].Value -replace ',', '')
      $priceIndex++
      $variants += @{ id = "pivotic-$productIndex-$priceIndex"; label = "Option $priceIndex"; price = $price }
    }
    if ($variants.Count -eq 0) { continue }
    $productId = Convert-ToId "$brandName $model $productIndex"
    $products += @{ id = $productId; name = $name; description = "PIVOTIC Smart Switch product ($model)."; imageUrl = $imageUrls[$productIndex % $imageUrls.Count]; brandId = $brandId; categoryId = 'smart-switches'; subCategoryId = 'smart-switches'; variants = $variants }
    $productIndex++
  }
  return $products
}

function Get-PivoticSwitchProducts([string]$brandId, [string]$brandName, [string[]]$imageUrls) {
  $switches = @(
    @{ gang = '1 Gang'; color = 'Black'; price = 1400 },
    @{ gang = '2 Gang'; color = 'Black'; price = 1460 },
    @{ gang = '3 Gang'; color = 'Black'; price = 1520 },
    @{ gang = '4 Gang'; color = 'Black'; price = 1780 },
    @{ gang = '1 Gang'; color = 'White'; price = 1600 },
    @{ gang = '2 Gang'; color = 'White'; price = 1660 },
    @{ gang = '3 Gang'; color = 'White'; price = 1720 },
    @{ gang = '4 Gang'; color = 'White'; price = 1780 }
  )
  $products = @()
  for ($index = 0; $index -lt $switches.Count; $index++) {
    $switch = $switches[$index]
    $productId = Convert-ToId "$brandName $($switch.color) $($switch.gang)"
    $products += @{ id = $productId; name = "PIVOTIC AIVA Smart Switch $($switch.gang) - $($switch.color)"; description = "Smart touch wall switch with $($switch.gang) control, $($switch.color) finish, and Wi-Fi connectivity."; imageUrl = $imageUrls[$index % $imageUrls.Count]; brandId = $brandId; categoryId = 'smart-switches'; subCategoryId = 'smart-switches'; variants = @(
      @{ id = "$productId-wifi"; label = 'Wi-Fi only'; price = $switch.price },
      @{ id = "$productId-alexa"; label = 'Works with Alexa'; price = $switch.price }
    ) }
  }
  return $products
}

function Get-Price([string]$block) {
  $matches = [regex]::Matches($block, '(?im)^[^\r\n]*(?:price|\u0633\u0639\u0631|~)[^0-9\r\n]*([0-9][0-9,]*)|([0-9][0-9,]*)\s*\u062C\u0646\u064A\u0647')
  if ($matches.Count -eq 0) { return 0 }
  $value = if ($matches[0].Groups[1].Success) { $matches[0].Groups[1].Value } else { $matches[0].Groups[2].Value }
  return [int]($value -replace ',', '')
}

function Get-ProductsFromText([string]$text, [string]$relativePath) {
  if ($relativePath -match '(?i)IP CAMS') {
    $section = [regex]::Match($text, '(?is)IP CAMS(.*?)(?=\r?\n\s*NVR\b)').Groups[1].Value
    if ($section) { $text = $section }
  } elseif ($relativePath -match '(?i)(?:^|\\)NVR(?:\\|$)') {
    $section = [regex]::Match($text, '(?is)\bNVR\b(.*?)(?=\r?\n\s*SWITCH)').Groups[1].Value
    if ($section) { $text = $section }
  } elseif ($relativePath -match '(?i)(?:^|\\)SWITCH(?:\\|$)') {
    $section = [regex]::Match($text, '(?is)SWITCHS(.*?)(?=\r?\n\s*SMART)').Groups[1].Value
    if ($section) { $text = $section }
  }
  $productNameLabel = '\u0627\u0633\u0645\s+\u0627\u0644\u0645\u0646\u062a\u062c'
  $blocks = if ($text -match "(?im)^\s*$productNameLabel\s*:") {
    [regex]::Split($text, "(?m)(?=^\s*$productNameLabel\s*:)") | Where-Object { $_ -match "(?im)^\s*$productNameLabel\s*:" }
  } else {
    [regex]::Split($text, '(?m)(?=^\s*\d+\s*(?:[-/]\s*))') | Where-Object { $_ -match '(?im)^\s*\d+\s*(?:[-/]\s*)' }
  }
  $products = @()
  foreach ($block in $blocks) {
    $headingMatch = [regex]::Match($block, '(?im)^\s*\d+\s*(?:[-/]\s*)(.+)$')
    $nameMatch = [regex]::Match($block, "(?im)^\s*(?:$productNameLabel|Product Name)\s*:\s*(.+)$")
    $modelMatch = [regex]::Match($block, '(?im)^\s*(?:\u0627\u0644\u0645\u0648\u062f\u064a\u0644\s*/\s*\u0627\u0644\u0643\u0648\u062f|Model\s*/\s*Code|\u0627\u0644\u0643\u0648\u062f|Code)\s*:\s*(.+)$')
    $model = if ($modelMatch.Success) { $modelMatch.Groups[1].Value.Trim() } else { $headingMatch.Groups[1].Value.Trim() }
    $name = if ($nameMatch.Success) { $nameMatch.Groups[1].Value.Trim() } elseif ($modelMatch.Success) { $model } else { $headingMatch.Groups[1].Value.Trim() }
    if ([string]::IsNullOrWhiteSpace($name)) { continue }
    $descriptionMatch = [regex]::Match($block, '(?im)^\s*(?:\u0627\u0644\u0648\u0635\u0641\s+\u0628\u0627\u0644\u0639\u0631\u0628\u064a|Description)\s*:\s*(.+)$')
    $description = if ($descriptionMatch.Success) { $descriptionMatch.Groups[1].Value.Trim() } else { '' }
    $products += @{ model = $model; name = $name; description = $description; price = Get-Price $block }
  }
  return $products
}

$categories = @{}
$subCategories = @{}
$brands = @{}
$products = @()

$directories = Get-ChildItem -LiteralPath $sourceRoot -Recurse -Directory | Sort-Object FullName
foreach ($directory in $directories) {
  $relative = $directory.FullName.Substring($sourceRoot.Length + 1)
  if (($relative -split '\\').Count -lt 2) { continue }
  $images = @(Get-ChildItem -LiteralPath $directory.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' } | Sort-Object @{ Expression = { Get-ImageNumber $_ } }, Name)
  if ($images.Count -eq 0) { continue }

  $brandName = ($relative -split '\\')[0]
  if ($OnlyBrand -and $brandName -ne $OnlyBrand) { continue }
  $brandId = Convert-ToId $brandName
  $category = Get-Category $relative
  $categories[$category.id] = @{ id = $category.id; name = $category.name; icon = $category.icon }
  $subCategories[$category.sub] = @{ id = $category.sub; categoryId = $category.id; name = $category.sub }
  $brandRoot = Join-Path $sourceRoot $brandName
  $localLogo = Get-ChildItem -LiteralPath $brandRoot -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' } | Sort-Object Name | Select-Object -First 1
  $logoUrl = if ($localLogo) {
    $logoRelative = $localLogo.FullName.Substring($sourceRoot.Length + 1)
    '/catalog/' + (($logoRelative -split '\\' | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/')
  } else {
    Get-BrandLogo $brandName
  }
  $brands[$brandId] = @{ id = $brandId; name = $brandName; logoUrl = $logoUrl }

  $textFile = Get-ChildItem -LiteralPath $directory.FullName -File -Filter '*.txt' | Select-Object -First 1
  if (-not $textFile) { $textFile = Get-ChildItem -LiteralPath (Split-Path $directory.FullName -Parent) -File -Filter '*.txt' | Select-Object -First 1 }
  $metadata = if ($textFile) { Get-ProductsFromText (Get-Content -LiteralPath $textFile.FullName -Encoding UTF8 -Raw) $relative } else { @() }
  if ($brandName -eq 'PIVOTIC' -and $textFile) {
    $imageUrls = @($images | ForEach-Object {
      $imageRelative = $_.FullName.Substring($sourceRoot.Length + 1)
      '/catalog/' + (($imageRelative -split '\\' | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/')
    })
    $products += Get-PivoticSwitchProducts $brandId $brandName $imageUrls
    $otherProducts = Get-PivoticProducts (Get-Content -LiteralPath $textFile.FullName -Raw) $brandId $brandName $imageUrls
    $products += @($otherProducts | Select-Object -Skip 4)
    continue
  }
  for ($index = 0; $index -lt $images.Count; $index++) {
    $imageNumber = Get-ImageNumber $images[$index]
    $metadataIndex = if ($imageNumber -ne [int]::MaxValue) { $imageNumber - 1 } else { $index }
    $metadataItem = if ($metadataIndex -ge 0 -and $metadataIndex -lt $metadata.Count) { $metadata[$metadataIndex] } else { continue }
    if ([int]$metadataItem.price -le 0) { continue }
    $imageRelative = $images[$index].FullName.Substring($sourceRoot.Length + 1)
    $imageUrl = '/catalog/' + (($imageRelative -split '\\' | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/')
    $productId = Convert-ToId "$brandName $relative $($metadataItem.model) $index"
    $products += @{ id = $productId; name = "$brandName $($metadataItem.name)"; description = if ($metadataItem.description) { $metadataItem.description } else { "$brandName product from the imported catalog." }; imageUrl = $imageUrl; brandId = $brandId; categoryId = $category.id; subCategoryId = $category.sub; variants = @(@{ id = "$productId-default"; label = $metadataItem.model; price = $metadataItem.price }) }
  }
}

$seenModels = @{}
$uniqueProducts = @()
foreach ($product in $products) {
  $modelKey = "$($product.brandId):$(($product.variants[0].label -as [string]).Trim().ToLowerInvariant())"
  if ($modelKey -and $modelKey -notmatch ':$' -and $modelKey -notmatch ':item\s+\d+$' -and $modelKey -notmatch ':option\s+\d+$' -and $seenModels.ContainsKey($modelKey)) { continue }
  if ($modelKey -and $modelKey -notmatch ':$' -and $modelKey -notmatch ':item\s+\d+$' -and $modelKey -notmatch ':option\s+\d+$') { $seenModels[$modelKey] = $true }
  $uniqueProducts += $product
}

$payload = @{ categories = @($categories.Values); subCategories = @($subCategories.Values); brands = @($brands.Values); products = $uniqueProducts }
$json = $payload | ConvertTo-Json -Depth 8
$typescript = "import type { CatalogPayload } from './catalog';`r`n`r`nexport const importedCatalog: CatalogPayload = $json;`r`n"
Set-Content -LiteralPath $outputFile -Value $typescript -Encoding UTF8

foreach ($directory in $directories) {
  $relative = $directory.FullName.Substring($sourceRoot.Length + 1)
  $target = Join-Path $publicRoot $relative
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  Get-ChildItem -LiteralPath $directory.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' } | Copy-Item -Destination $target -Force
}

Write-Output "Imported $($products.Count) products and $($brands.Count) brands."