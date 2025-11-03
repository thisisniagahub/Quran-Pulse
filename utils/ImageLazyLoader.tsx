import React, { useState, useEffect, useRef } from 'react';

interface ImageLazyLoaderProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageLazyLoader: React.FC<ImageLazyLoaderProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoaded(true); // Still mark as loaded to show placeholder
    onError?.();
  };

  if (!isInView) {
    // Don't render the image until it's in view
    return (
      <div 
        style={{ width, height }} 
        className={`bg-gray-200 animate-pulse ${className}`}
      >
        {placeholder && (
          <img 
            src={placeholder} 
            alt={alt} 
            className={`${className} opacity-50`}
          />
        )}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  );
};