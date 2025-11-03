/**
 * FontLoader - Utility for optimizing font loading performance
 * Uses the Font Loading API to load fonts efficiently and avoid FOUT/FOIT
 */

interface FontConfig {
  family: string;
  url: string;
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  weight?: string;
  style?: string;
}

class FontLoader {
  private loadedFonts: Set<string> = new Set();
  
  /**
   * Load a single font dynamically
   */
  async loadFont(config: FontConfig): Promise<boolean> {
    const { family, url, display = 'swap', weight = '400', style = 'normal' } = config;
    const fontKey = `${family}-${weight}-${style}`;
    
    // Check if font is already loaded
    if (this.loadedFonts.has(fontKey)) {
      return true;
    }
    
    try {
      // Create font face
      const fontFace = new FontFace(family, `url(${url})`, {
        weight,
        style,
        display
      });
      
      // Load the font
      await fontFace.load();
      
      // Add to document
      (document.fonts as any).add(fontFace);
      
      // Mark as loaded
      this.loadedFonts.add(fontKey);
      
      return true;
    } catch (error) {
      console.warn(`Failed to load font: ${family}`, error);
      return false;
    }
  }
  
  /**
   * Load multiple fonts in parallel
   */
  async loadFonts(fonts: FontConfig[]): Promise<boolean[]> {
    const promises = fonts.map(font => this.loadFont(font));
    return Promise.all(promises);
  }
  
  /**
   * Check if a font is loaded
   */
  isFontLoaded(family: string, weight: string = '400', style: string = 'normal'): boolean {
    return this.loadedFonts.has(`${family}-${weight}-${style}`);
  }
  
  /**
   * Set up font loading for critical fonts with fallback
   */
  setupCriticalFontLoading(): void {
    // Preload critical fonts like Arabic Quran font and Inter font
    const criticalFonts: FontConfig[] = [
      {
        family: 'Amiri Quran',
        url: 'https://fonts.gstatic.com/s/amiri/v22/J7aRnpd3pK7/AmiriQuran-Regular.woff2',
        display: 'swap',
        weight: '400'
      },
      {
        family: 'Inter',
        url: 'https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2',
        display: 'swap',
        weight: '400'
      }
    ];
    
    // Load fonts in background
    this.loadFonts(criticalFonts).catch(error => {
      console.warn('Failed to preload critical fonts:', error);
    });
  }
  
  /**
   * Apply font swap strategy for better performance
   */
  applyFontSwapStrategy(): void {
    // Add font-display: swap to all @font-face declarations
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}

// Create a singleton instance
const fontLoader = new FontLoader();

// Initialize font loading when document is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fontLoader.setupCriticalFontLoading();
      fontLoader.applyFontSwapStrategy();
    });
  } else {
    fontLoader.setupCriticalFontLoading();
    fontLoader.applyFontSwapStrategy();
  }
}

export default fontLoader;