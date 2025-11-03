/**
 * Bundle Analysis and Code Splitting Utilities
 * This file provides utilities for analyzing bundle size and optimizing imports
 */

const BUNDLE_SIZE_THRESHOLDS = {
  MAX_INITIAL_SIZE: 500 * 1024, // 500 KB
  MAX_ASSET_SIZE: 200 * 1024,   // 200 KB
  WARNING_THRESHOLD: 250 * 1024, // 250 KB
};

/**
 * A utility function to dynamically import modules with performance tracking
 */
export async function trackedImport<T>(importFn: () => Promise<T>, moduleName: string): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await importFn();
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    // Log performance metrics
    if (process.env.NODE_ENV === 'development') {
      console.log(`Module ${moduleName} loaded in ${loadTime.toFixed(2)}ms`);
    }
    
    return result;
  } catch (error) {
    console.error(`Failed to load module ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Code splitting helper for components with fallback
 */
export function lazyWithPreload<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): {
  component: React.LazyExoticComponent<T>;
  preload: () => void;
} {
  const LazyComponent = React.lazy(importFn);
  let preloaded: Promise<{ default: T }> | null = null;

  return {
    component: LazyComponent,
    preload: () => {
      if (!preloaded) {
        preloaded = importFn();
      }
      return preloaded;
    }
  };
}

/**
 * Analyze bundle composition and provide optimization suggestions
 */
export function analyzeBundleSize(bundleStats: any): string[] {
  const suggestions: string[] = [];
  
  if (bundleStats.totalSize > BUNDLE_SIZE_THRESHOLDS.MAX_INITIAL_SIZE) {
    suggestions.push(`Bundle size (${(bundleStats.totalSize / 1024).toFixed(2)} KB) exceeds recommended limit of ${(BUNDLE_SIZE_THRESHOLDS.MAX_INITIAL_SIZE / 1024).toFixed(0)} KB`);
  }
  
  // Check for large dependencies
  if (bundleStats.dependencies && Array.isArray(bundleStats.dependencies)) {
    bundleStats.dependencies.forEach((dep: any) => {
      if (dep.size > BUNDLE_SIZE_THRESHOLDS.MAX_ASSET_SIZE) {
        suggestions.push(`Large dependency: ${dep.name} (${(dep.size / 1024).toFixed(2)} KB) - consider alternatives or tree-shaking`);
      }
    });
  }
  
  return suggestions;
}

/**
 * Optimize image loading with proper sizing and formats
 */
export function optimizeImageSrc(src: string, width?: number, height?: number, format?: 'webp' | 'avif' | 'jpeg'): string {
  // In a real implementation, this would integrate with an image optimization service
  // For now, we'll return the original src with query parameters for optimization
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (format) params.set('f', format);
  
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}${params.toString()}`;
}

/**
 * Preload critical resources
 */
export function preloadResource(url: string, as: 'script' | 'style' | 'image' | 'font' | 'fetch'): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = as;
  
  if (as === 'fetch') {
    link.crossOrigin = 'anonymous';
  }
  
  document.head.appendChild(link);
}

/**
 * Check if a module is tree-shakable
 */
export function isTreeShakable(moduleName: string, imports: string[]): boolean {
  // Common modules that support tree-shaking
  const treeShakableModules = [
    'lodash',
    'ramda',
    '@heroicons/react',
    '@mui/icons-material',
    'date-fns',
    // Add more as needed
  ];
  
  return treeShakableModules.includes(moduleName) && 
         imports.some(imp => !imp.includes('*')); // Avoid wildcard imports
}