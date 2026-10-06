export interface StorageAdapter {
    getItem<T>(key: string): Promise<T | null>;
    saveItem<T>(key: string, value: T): Promise<void>;
}