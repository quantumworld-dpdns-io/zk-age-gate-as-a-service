export interface StorageConfig {
  db: D1Database;
  cache: KVNamespace;
  artifacts: R2Bucket;
  searchIndex: VectorizeIndex;
}

export class StorageManager {
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  async cacheGet<T>(key: string): Promise<T | null> {
    const value = await this.config.cache.get(key, 'json');
    return value as T | null;
  }

  async cacheSet(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
    await this.config.cache.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
  }

  async cacheDelete(key: string): Promise<void> {
    await this.config.cache.delete(key);
  }

  async dbQuery<T>(sql: string, ...params: unknown[]): Promise<T[]> {
    const result = await this.config.db
      .prepare(sql)
      .bind(...params)
      .all();
    return result.results as T[];
  }

  async dbFirst<T>(sql: string, ...params: unknown[]): Promise<T | null> {
    const result = await this.config.db
      .prepare(sql)
      .bind(...params)
      .first();
    return result as T | null;
  }

  async dbRun(sql: string, ...params: unknown[]): Promise<D1Result> {
    return await this.config.db
      .prepare(sql)
      .bind(...params)
      .run();
  }

  async r2Put(
    key: string,
    data: ReadableStream | ArrayBuffer | Uint8Array | string,
  ): Promise<void> {
    await this.config.artifacts.put(key, data);
  }

  async r2Get(key: string): Promise<R2ObjectBody | null> {
    return await this.config.artifacts.get(key);
  }

  async r2Delete(key: string): Promise<void> {
    await this.config.artifacts.delete(key);
  }

  async vectorInsert(id: string, values: number[], namespace?: string): Promise<void> {
    await this.config.searchIndex.insert([{ id, values, namespace }]);
  }

  async vectorQuery(
    values: number[],
    topK: number = 10,
    namespace?: string,
  ): Promise<Record<string, unknown>[]> {
    const result = await this.config.searchIndex.query(values, { topK, namespace });
    return result.matches || [];
  }
}

export function createStorageManager(config: StorageConfig): StorageManager {
  return new StorageManager(config);
}
