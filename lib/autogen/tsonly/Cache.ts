import { promises as fs } from 'fs';

export class Cache {
  cachePath: string;

  constructor(cachePath: string) {
    this.cachePath = cachePath;
    this.initializeCache();
  }

  async initializeCache(): Promise<void> {
    try {
      await fs.access(this.cachePath);
    } catch (error) {
      await fs.writeFile(this.cachePath, JSON.stringify({}));
    }
  }

  async set(key: string, value: any): Promise<void> {
    const cache = await this.getCache();
    cache[key] = value;
    await fs.writeFile(this.cachePath, JSON.stringify(cache));
  }

  async get(key: string): Promise<any> {
    const cache = await this.getCache();
    return cache[key];
  }

  async getCache(): Promise<{ [key: string]: any }> {
    const data = await fs.readFile(this.cachePath, 'utf-8');
    return JSON.parse(data);
  }

  async clear(): Promise<void> {
    await fs.writeFile(this.cachePath, JSON.stringify({}));
  }
}

// Usage:
// const cache = new SimpleCache('./path/to/cache.json');
// await cache.set('someKey', 'someValue');
// const value = await cache.get('someKey');
