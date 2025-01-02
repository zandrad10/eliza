import path from "path";
import fs from "fs/promises";
import type {
    CacheOptions,
    ICacheManager,
    IDatabaseCacheAdapter,
    UUID,
} from "./types";

/**
 * * Interface representing a cache adapter with methods to get, set, and delete cache entries.
 * @interface
 * /
 */
export interface ICacheAdapter {
    get(key: string): Promise<string | undefined>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}

/**
 * * Class representing a memory cache adapter.
 * @implements {ICacheAdapter}
 * /
 * /
 */
export class MemoryCacheAdapter implements ICacheAdapter {
    data: Map<string, string>;

/**
 * * Constructor for initializing a new instance of the class.
 * @param {Map<string, string>} [initalData] - Optional initial data for the class instance, defaults to an empty Map if not provided.
 * /
 */
    constructor(initalData?: Map<string, string>) {
        this.data = initalData ?? new Map<string, string>();
    }

/**
 * * Asynchronously retrieves the value associated with the specified key.
 * 
 * @param {string} key - The key to look up in the data.
 * @returns {Promise<string | undefined>} The value associated with the key, or undefined if the key is not found.
 * /
 */
    async get(key: string): Promise<string | undefined> {
        return this.data.get(key);
    }

/**
 * * Asynchronously sets a key-value pair in the data store.
 * 
 * @param {string} key - The key to set the value for.
 * @param {string} value - The value to set for the given key.
 * @returns {Promise<void>} A promise that resolves once the key-value pair is set.
 * /
 */
    async set(key: string, value: string): Promise<void> {
        this.data.set(key, value);
    }

/**
 * * Asynchronously deletes a value from the data using the provided key.
 * 
 * @param {string} key - The key of the value to be deleted.
 * @returns {Promise<void>} A Promise that resolves once the value is deleted.
 * /
 */
    async delete(key: string): Promise<void> {
        this.data.delete(key);
    }
}

/**
 * A cache adapter implementation that stores data on the filesystem.
 * @implements {ICacheAdapter}
 * /
```
 */
export class FsCacheAdapter implements ICacheAdapter {
/**
 * * Constructor for initializing the data directory.
 * 
 * @param {string} dataDir - The directory where data will be stored.
 * /
 */
    constructor(private dataDir: string) {}

/**
 * * Asynchronously retrieves the data stored in a file with the specified key.
 * 
 * @param {string} key - The key used to identify the file containing the data.
 * @returns {Promise<string | undefined>} A Promise that resolves with the data as a string if successful, otherwise resolves with undefined.
 * /
 */
    async get(key: string): Promise<string | undefined> {
        try {
            return await fs.readFile(path.join(this.dataDir, key), "utf8");
        } catch {
            // console.error(error);
            return undefined;
        }
    }

/**
 * * Asynchronously sets a key-value pair in a specified file in the data directory.
 * 
 * @param {string} key - The key to be used as the filename.
 * @param {string} value - The value to be written to the file.
 * @returns {Promise<void>} - A promise that resolves once the file is written successfully, or rejects if an error occurs.
 * /
 */
    async set(key: string, value: string): Promise<void> {
        try {
            const filePath = path.join(this.dataDir, key);
            // Ensure the directory exists
            await fs.mkdir(path.dirname(filePath), { recursive: true });
            await fs.writeFile(filePath, value, "utf8");
        } catch (error) {
            console.error(error);
        }
    }

/**
 * * Asynchronously deletes a file corresponding to the given key from the data directory.
 * 
 * @param {string} key - The key representing the file to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the file is successfully deleted.
 * /
 */
    async delete(key: string): Promise<void> {
        try {
            const filePath = path.join(this.dataDir, key);
            await fs.unlink(filePath);
        } catch {
            // console.error(error);
        }
    }
}

/**
 * * A class representing a database cache adapter that implements the ICacheAdapter interface.
 * /
 */
export class DbCacheAdapter implements ICacheAdapter {
/**
 * * Constructor for creating a new instance.
 * @param {IDatabaseCacheAdapter} db - The database cache adapter to use.
 * @param {UUID} agentId - The unique identifier for the agent.
 * /
 */
    constructor(
        private db: IDatabaseCacheAdapter,
        private agentId: UUID
    ) {}

/**
 * * Asynchronously retrieves a value from the cache using the specified key.
 * 
 * @param {string} key - The key used to retrieve the value from the cache.
 * @returns {Promise<string | undefined>} A promise that resolves with the value associated with the key, or undefined if no value is found.
 * /
 */
    async get(key: string): Promise<string | undefined> {
        return this.db.getCache({ agentId: this.agentId, key });
    }

/**
 * * Asynchronously sets a key-value pair in the cache.
 * 
 * @param {string} key - The key to set in the cache.
 * @param {string} value - The value to set for the corresponding key in the cache.
 * @returns {Promise<void>} - A promise that resolves when the key-value pair is successfully set in the cache.
 * /
 */
    async set(key: string, value: string): Promise<void> {
        await this.db.setCache({ agentId: this.agentId, key, value });
    }

/**
 * * Deletes a specific key from the cache.
 * 
 * @param {string} key - The key to be deleted from the cache.
 * @returns {Promise<void>} A Promise that resolves when the key is successfully deleted from the cache.
 * /
 */
    async delete(key: string): Promise<void> {
        await this.db.deleteCache({ agentId: this.agentId, key });
    }
}

/**
 * * CacheManager class for managing cache operations.
 * @template CacheAdapter - The CacheAdapter type that implements ICacheAdapter interface.
 * /
 * /
 */
export class CacheManager<CacheAdapter extends ICacheAdapter = ICacheAdapter>
    implements ICacheManager
{
    adapter: CacheAdapter;

/**
 * * Constructor for creating a new instance of the class.
 * 
 * @param {CacheAdapter} adapter - The adapter used for caching.
 * /
 */
    constructor(adapter: CacheAdapter) {
        this.adapter = adapter;
    }

/**
 * * Asynchronously retrieves a value from the specified key.
 * 
 * @template T - The type of value to be retrieved. Defaults to unknown.
 * @param {string} key - The key to look up in the database.
 * @returns {Promise<T | undefined>} - A Promise that resolves with the value corresponding to the key, or undefined if no value is found or the value has expired.
 * /
 */
    async get<T = unknown>(key: string): Promise<T | undefined> {
        const data = await this.adapter.get(key);

        if (data) {
            const { value, expires } = JSON.parse(data) as {
                value: T;
                expires: number;
            };

            if (!expires || expires > Date.now()) {
                return value;
            }

            this.adapter.delete(key).catch(() => {});
        }

        return undefined;
    }

/**
 * * Sets a value in the cache with the specified key.
 * @template T
 * @param {string} key - The key under which the value will be stored.
 * @param {T} value - The value to be stored in the cache.
 * @param {CacheOptions} [opts] - Additional options for caching such as expiration time.
 * @returns {Promise<void>} A Promise that resolves when the value is successfully stored in the cache.
 * /
 */
    async set<T>(key: string, value: T, opts?: CacheOptions): Promise<void> {
        return this.adapter.set(
            key,
            JSON.stringify({ value, expires: opts?.expires ?? 0 })
        );
    }

/**
 * * Delete a record from the database based on the provided key.
 * 
 * @param {string} key - The key of the record to delete.
 * @returns {Promise<void>} A Promise that resolves when the record is successfully deleted.
 * /
 */
    async delete(key: string): Promise<void> {
        return this.adapter.delete(key);
    }
}
