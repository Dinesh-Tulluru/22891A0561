export interface URLData {
  id: string;
  originalUrl: string;
  shortCode: string;
  customCode?: string;
  validUntil?: Date;
  createdAt: Date;
  clicks: ClickData[];
}

export interface ClickData {
  timestamp: Date;
  userAgent: string;
  referrer: string;
}

interface StoredURLData {
  id: string;
  originalUrl: string;
  shortCode: string;
  customCode?: string;
  validUntil?: string;
  createdAt: string;
  clicks: StoredClickData[];
}

interface StoredClickData {
  timestamp: string;
  userAgent: string;
  referrer: string;
}

class URLService {
  private storageKey = 'url-shortener-data';

  generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getAllUrls(): URLData[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    
    const urls: StoredURLData[] = JSON.parse(data);
    return urls.map((url: StoredURLData) => ({
      ...url,
      createdAt: new Date(url.createdAt),
      validUntil: url.validUntil ? new Date(url.validUntil) : undefined,
      clicks: url.clicks.map((click: StoredClickData) => ({
        ...click,
        timestamp: new Date(click.timestamp)
      }))
    }));
  }

  saveUrl(urlData: URLData): void {
    const urls = this.getAllUrls();
    urls.push(urlData);
    localStorage.setItem(this.storageKey, JSON.stringify(urls));
  }

  getUrlByShortCode(shortCode: string): URLData | null {
    const urls = this.getAllUrls();
    return urls.find(url => url.shortCode === shortCode) || null;
  }

  isShortCodeTaken(shortCode: string): boolean {
    return this.getUrlByShortCode(shortCode) !== null;
  }

  isUrlExpired(urlData: URLData): boolean {
    if (!urlData.validUntil) return false;
    return new Date() > urlData.validUntil;
  }

  recordClick(shortCode: string): boolean {
    const urls = this.getAllUrls();
    const urlIndex = urls.findIndex(url => url.shortCode === shortCode);
    
    if (urlIndex === -1) return false;
    
    const urlData = urls[urlIndex];
    if (this.isUrlExpired(urlData)) return false;

    const clickData: ClickData = {
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Direct'
    };

    urls[urlIndex].clicks.push(clickData);
    localStorage.setItem(this.storageKey, JSON.stringify(urls));
    return true;
  }

  shortenUrl(originalUrl: string, customCode?: string, validityDays?: number): URLData | { error: string } {
    if (!this.isValidUrl(originalUrl)) {
      return { error: 'Invalid URL format' };
    }

    let shortCode = customCode;
    if (customCode) {
      if (this.isShortCodeTaken(customCode)) {
        return { error: 'Custom shortcode already taken' };
      }
      if (customCode.length < 3 || customCode.length > 10) {
        return { error: 'Custom shortcode must be 3-10 characters' };
      }
    } else {
      do {
        shortCode = this.generateShortCode();
      } while (this.isShortCodeTaken(shortCode));
    }

    const urlData: URLData = {
      id: Date.now().toString(),
      originalUrl,
      shortCode: shortCode!,
      customCode,
      validUntil: validityDays ? new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000) : undefined,
      createdAt: new Date(),
      clicks: []
    };

    this.saveUrl(urlData);
    return urlData;
  }
}

export const urlService = new URLService();