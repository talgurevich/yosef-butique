'use client';

import { useState, useRef, MouseEvent } from 'react';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
}

export default function ImageMagnifier({
  src,
  alt,
  magnifierHeight = 200,
  magnifierWidth = 200,
  zoomLevel = 2.5,
}: ImageMagnifierProps) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const mouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const mouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    // Calculate cursor position on the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  const mouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={mouseEnter}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />

      {/* Magnifier glass */}
      <div
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',
          // Prevent magnifier from going outside of the image
          left: `${x - magnifierWidth / 2}px`,
          top: `${y - magnifierHeight / 2}px`,
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          opacity: '1',
          border: '3px solid #d4af37',
          backgroundColor: 'white',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          cursor: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',

          // Calculate zoomed image position
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      />
    </div>
  );
}
