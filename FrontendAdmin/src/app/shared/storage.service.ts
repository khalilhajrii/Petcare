import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage = window.localStorage;

  constructor() {}

  async set(key: string, value: any): Promise<void> {
    try {
      console.log(`Setting storage key: ${key}`, value);
      this.storage.setItem(key, JSON.stringify(value));
      console.log(`Successfully stored value for key: ${key}`);
    } catch (error) {
      console.error(`Error storing value for key: ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const value = this.storage.getItem(key);
      const parsedValue = value ? JSON.parse(value) : null;
      console.log(`Retrieved value for key: ${key}`, parsedValue);
      return parsedValue;
    } catch (error) {
      console.error(`Error retrieving value for key: ${key}`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      this.storage.removeItem(key);
      console.log(`Successfully removed key: ${key}`);
    } catch (error) {
      console.error(`Error removing key: ${key}`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage.clear();
      console.log('Successfully cleared storage');
    } catch (error) {
      console.error('Error clearing storage', error);
      throw error;
    }
  }
}