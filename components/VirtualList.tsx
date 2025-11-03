import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  containerHeight?: number;
  className?: string;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  overscan = 5,
  containerHeight = 400,
  className = ''
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleStart, setVisibleStart] = useState(0);
  const [visibleEnd, setVisibleEnd] = useState(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
      setVisibleStart(Math.floor(containerRef.current.scrollTop / itemHeight));
      setVisibleEnd(
        Math.ceil(
          (containerRef.current.scrollTop + containerHeight) / itemHeight
        )
      );
    }
  }, [itemHeight, containerHeight]);

  // Set initial visible range
  useEffect(() => {
    if (containerRef.current) {
      setVisibleStart(0);
      setVisibleEnd(Math.min(items.length, Math.ceil(containerHeight / itemHeight)));
    }
  }, [items.length, containerHeight]);

  // Calculate total height for scroll container
  const totalHeight = items.length * itemHeight;

  // Calculate offset for positioning
  const offsetTop = visibleRange.start * itemHeight;

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetTop}px)` }}>
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <div
                key={actualIndex}
                style={{ height: itemHeight }}
                className="absolute left-0 right-0"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Enhanced VirtualList with additional features
interface EnhancedVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderItemKey?: (item: T, index: number) => React.Key;
  overscan?: number;
  containerHeight?: number;
  className?: string;
  onScrollEnd?: () => void;
  onItemsRendered?: (start: number, end: number) => void;
  estimatedItemSize?: number;
}

export function EnhancedVirtualList<T>({
  items,
  itemHeight,
  renderItem,
  renderItemKey = (item, index) => index,
  overscan = 5,
  containerHeight = 400,
  className = '',
  onScrollEnd,
  onItemsRendered,
  estimatedItemSize = itemHeight
}: EnhancedVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleStart, setVisibleStart] = useState(0);
  const [visibleEnd, setVisibleEnd] = useState(0);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / estimatedItemSize) - overscan);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / estimatedItemSize) + overscan
    );
    return { start, end };
  }, [scrollTop, estimatedItemSize, containerHeight, overscan, items.length]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const currentScrollTop = containerRef.current.scrollTop;
      setScrollTop(currentScrollTop);
      setVisibleStart(Math.floor(currentScrollTop / estimatedItemSize));
      setVisibleEnd(
        Math.ceil(
          (currentScrollTop + containerHeight) / estimatedItemSize
        )
      );

      // Check if we've reached the end
      if (currentScrollTop + containerHeight >= containerRef.current.scrollHeight - 100) {
        onScrollEnd?.();
      }
    }
  }, [estimatedItemSize, containerHeight, onScrollEnd]);

  // Notify when items are rendered
  useEffect(() => {
    onItemsRendered?.(visibleRange.start, visibleRange.end);
  }, [visibleRange.start, visibleRange.end, onItemsRendered]);

  // Calculate total height for scroll container
  const totalHeight = items.length * estimatedItemSize;

  // Calculate offset for positioning
  const offsetTop = visibleRange.start * estimatedItemSize;

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetTop}px)` }}>
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            return (
              <div
                key={renderItemKey(item, actualIndex)}
                style={{ height: estimatedItemSize }}
                className="absolute left-0 right-0"
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}