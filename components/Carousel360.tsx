"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const images = [
  "/pics/1.jpg",
  "/pics/2.jpg",
  "/pics/3.jpg",
  "/pics/4.jpg",
  "/pics/5.jpg",
  "/pics/6.jpg",
  "/pics/7.jpg",
  "/pics/8.jpg",
  "/pics/9.jpg",
  "/pics/10.jpg",
];

const AUTOPLAY_INTERVAL_MS = 2400;
const RADIUS_MIN = 120;
const RADIUS_MAX = 320;
const springTransition = { type: "spring", stiffness: 60, damping: 16, mass: 0.7 } as const;

const ImageLoader = () => (
  <div className="carousel-loader" aria-hidden="true">
    <span />
  </div>
);

export default function Carousel360({ isArabic }: { isArabic: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(220);
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>(() => images.map(() => false));
  const [centerLoaded, setCenterLoaded] = useState(false);
  const numImages = images.length;
  const angleStep = 360 / numImages;
  const steps = Math.round(rotation / angleStep);
  const centerIndex = ((-steps % numImages) + numImages) % numImages;

  useEffect(() => {
    const updateRadius = () => {
      const width = containerRef.current?.offsetWidth ?? 440;
      setRadius(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * 0.55)));
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setRotation((previous) => previous + angleStep), AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [angleStep]);

  useEffect(() => {
    setCenterLoaded(false);
  }, [centerIndex]);

  const rotateCarousel = useCallback((direction: "left" | "right") => {
    setRotation((previous) => previous + (direction === "left" ? -angleStep : angleStep));
  }, [angleStep]);

  const markThumbLoaded = useCallback((index: number) => {
    setLoadedThumbs((previous) => {
      if (previous[index]) return previous;
      const next = [...previous];
      next[index] = true;
      return next;
    });
  }, []);

  return (
    <div className="carousel-360">
      <div ref={containerRef} className="carousel-360-stage">
        <div className="carousel-360-ring" style={{ perspective: radius * 2.4 }}>
          {images.map((source, index) => {
            const targetAngle = rotation + angleStep * index;
            return (
              <motion.div key={source} className="carousel-360-item" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: targetAngle }} transition={springTransition}>
                <motion.div className="carousel-360-thumb" style={{ transformStyle: "preserve-3d" }} animate={{ rotateY: -targetAngle, rotateX: 38, z: radius }} transition={springTransition}>
                  {!loadedThumbs[index] && <ImageLoader />}
                  <Image src={source} alt="YAM smart system" width={96} height={96} onLoad={() => markThumbLoaded(index)} className={loadedThumbs[index] ? "is-loaded" : ""} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        <div className="carousel-360-center">
          <AnimatePresence mode="wait">
            <motion.div key={centerIndex} className="carousel-360-feature" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45 }}>
              {!centerLoaded && <ImageLoader />}
              <Image src={images[centerIndex]} alt="Featured YAM smart system" width={320} height={320} priority onLoad={() => setCenterLoaded(true)} className={centerLoaded ? "is-loaded" : ""} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="carousel-360-controls">
        <button type="button" aria-label={isArabic ? "الصورة السابقة" : "Previous image"} onClick={() => rotateCarousel("left")}>
          {isArabic ? <FaArrowRight /> : <FaArrowLeft />}
        </button>
        <span>{String(centerIndex + 1).padStart(2, "0")} / {String(numImages).padStart(2, "0")}</span>
        <button type="button" aria-label={isArabic ? "الصورة التالية" : "Next image"} onClick={() => rotateCarousel("right")}>
          {isArabic ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
      </div>
    </div>
  );
}
