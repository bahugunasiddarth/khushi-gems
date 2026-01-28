"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from "framer-motion";
import { Maximize2, X } from "lucide-react";

type ImageZoomProps = {
  src: string;
  alt: string;
  imageHint: string;
  // NEW PROPS
  images: { url: string; hint: string }[];
  onImageSelect: (image: { url: string; hint: string }) => void;
};

// Configuration
const ZOOM_LEVEL = 2.5; 
const LENS_SIZE = 150; 
const SPRING_CONFIG = { stiffness: 400, damping: 30, mass: 0.5 };

export function ImageZoom({ src, alt, imageHint, images, onImageSelect }: ImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  
  const imageAreaRef = useRef<HTMLDivElement>(null);

  // Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs
  const x = useSpring(mouseX, SPRING_CONFIG);
  const y = useSpring(mouseY, SPRING_CONFIG);

  // Transforms
  const lensX = useTransform(x, (val) => val - LENS_SIZE / 2);
  const lensY = useTransform(y, (val) => val - LENS_SIZE / 2);

  const bgX = useTransform(x, [0, imgSize.width || 1], [0, 100]);
  const bgY = useTransform(y, [0, imgSize.height || 1], [0, 100]);
  
  const backgroundPosition = useTransform(
    [bgX, bgY],
    ([latestX, latestY]) => `${latestX}% ${latestY}%`
  );

  // Update image size on mount/resize
  useEffect(() => {
    if (imageAreaRef.current) {
      const { width, height } = imageAreaRef.current.getBoundingClientRect();
      setImgSize({ width, height });
    }
  }, [src]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageAreaRef.current) return;
    const { left, top } = imageAreaRef.current.getBoundingClientRect();
    
    const posX = e.clientX - left;
    const posY = e.clientY - top;

    // Snap instantly to cursor on enter
    mouseX.set(posX);
    mouseY.set(posY);
    x.set(posX);
    y.set(posY);

    setIsHovering(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageAreaRef.current) return;
    const { left, top, width, height } = imageAreaRef.current.getBoundingClientRect();
    
    const posX = e.clientX - left;
    const posY = e.clientY - top;
    
    // Clamp values
    mouseX.set(Math.max(0, Math.min(width, posX)));
    mouseY.set(Math.max(0, Math.min(height, posY)));
  };

  return (
    <>
      {/* WRAPPER */}
      <div className="relative z-20 group">
        
        {/* IMAGE AREA */}
        <div 
          className="relative aspect-square w-full overflow-hidden rounded-xl border border-black/5 bg-secondary/20 cursor-crosshair"
          ref={imageAreaRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            data-ai-hint={imageHint}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm pointer-events-none">
            <Maximize2 className="w-4 h-4" />
          </div>

          <AnimatePresence>
            {isHovering && !isFullscreen && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="pointer-events-none absolute top-0 left-0 border border-white/50 bg-white/20 backdrop-blur-[2px] shadow-sm rounded-lg z-30 hidden lg:block"
                  style={{
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    x: lensX, 
                    y: lensY, 
                  }}
                />
            )}
          </AnimatePresence>
        </div>

        {/* ZOOM PANE */}
        <AnimatePresence>
          {isHovering && !isFullscreen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-[103%] top-0 z-50 hidden lg:block h-full w-[120%] overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl pointer-events-none"
            >
              <motion.div
                className="h-full w-full"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: `${ZOOM_LEVEL * 100}%`,
                  backgroundPosition: backgroundPosition,
                  backgroundRepeat: "no-repeat",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FULLSCREEN LIGHTBOX WITH GALLERY */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition-colors z-[110]"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-8 h-8" />
            </button>

            {/* Main Fullscreen Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full flex-grow max-w-5xl flex items-center justify-center p-4 pb-24"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                quality={100}
                priority
              />
            </motion.div>

            {/* Thumbnail Strip */}
            <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 50, opacity: 0 }}
               className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 overflow-x-auto pb-2 z-[110]"
               onClick={(e) => e.stopPropagation()}
            >
                <div className="flex gap-3 bg-black/40 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => onImageSelect(img)}
                            className={cn(
                                "relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 flex-shrink-0",
                                src === img.url ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image 
                                src={img.url} 
                                alt={`Thumbnail ${idx}`} 
                                fill 
                                className="object-cover" 
                            />
                        </button>
                    ))}
                </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}