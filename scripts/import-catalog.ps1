$ErrorActionPreference = 'Stop'

$sourceRoot = 'C:\Users\Eslam\Desktop\DATA'
$publicRoot = Join-Path $PSScriptRoot '..\public\catalog'
$outputFile = Join-Path $PSScriptRoot '..\lib\imported-catalog.ts'

New-Item -ItemType Directory -Force -Path $publicRoot | Out-Null

function Convert-ToId([string]$value) {
  $id = $value.ToLowerInvariant() -replace '[^a-z0-9]+', '-'
  return $id.Trim('-')
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
  $matches = [regex]::Matches($block, '(?im)(?:price[^0-9]{0,40}|~\s*|^\s*[^\r\n]*\*\*\s*)([0-9][0-9,]*)')
  if ($matches.Count -eq 0) { return 0 }
  return [int]($matches[0].Groups[1].Value -replace ',', '')
}

function Get-ProductsFromText([string]$text) {
  $modelPattern = '(?im)(?:^\s*Model\s*/\s*Code\s*:\s*(.+)$|^\s*[^:\r\n]*[^\x00-\x7F][^:\r\n]*:\s*([A-Za-z0-9][A-Za-z0-9 _./-]*\d[A-Za-z0-9 _./-]*)\s*$)'
  $modelMatches = [regex]::Matches($text, $modelPattern)
  $products = @()
  foreach ($match in $modelMatches) {
    $start = $match.Index
    $block = $text.Substring($start, [Math]::Min(1800, $text.Length - $start))
    $model = ($match.Groups[1].Value + $match.Groups[2].Value).Trim() -replace '[^A-Za-z0-9 _./-]', ''
    if ([string]::IsNullOrWhiteSpace($model)) { continue }
    $products += @{ model = $model; price = Get-Price $block }
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
  $images = @(Get-ChildItem -LiteralPath $directory.FullName -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' } | Sort-Object Name)
  if ($images.Count -eq 0) { continue }

  $brandName = ($relative -split '\\')[0]
  $brandId = Convert-ToId $brandName
  $category = Get-Category $relative
  $categories[$category.id] = @{ id = $category.id; name = $category.name; icon = $category.icon }
  $subCategories[$category.sub] = @{ id = $category.sub; categoryId = $category.id; name = $category.sub }
  $brands[$brandId] = @{ id = $brandId; name = $brandName; logoUrl = Get-BrandLogo $brandName }

  $textFile = Get-ChildItem -LiteralPath $directory.FullName -File -Filter '*.txt' | Select-Object -First 1
  $metadata = if ($textFile) { Get-ProductsFromText (Get-Content -LiteralPath $textFile.FullName -Raw) } else { @() }
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
    $metadataItem = if ($index -lt $metadata.Count) { $metadata[$index] } else { @{ model = "Item $($index + 1)"; price = 0 } }
    $imageRelative = $images[$index].FullName.Substring($sourceRoot.Length + 1)
    $imageUrl = '/catalog/' + (($imageRelative -split '\\' | ForEach-Object { [uri]::EscapeDataString($_) }) -join '/')
    $productId = Convert-ToId "$brandName $relative $($metadataItem.model) $index"
    $products += @{ id = $productId; name = "$brandName $($metadataItem.model)"; description = "$brandName product from the imported catalog."; imageUrl = $imageUrl; brandId = $brandId; categoryId = $category.id; subCategoryId = $category.sub; variants = @(@{ id = "$productId-default"; label = $metadataItem.model; price = $metadataItem.price }) }
  }
}

$payload = @{ categories = @($categories.Values); subCategories = @($subCategories.Values); brands = @($brands.Values); products = $products }
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