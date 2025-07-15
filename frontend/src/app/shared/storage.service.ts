import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageInstance: Storage | null = null;
  private initialized = false;
  private initPromise: Promise<Storage> | null = null;

  constructor(private storage: Storage) {
    this.initPromise = this.init();
  }

  async init(): Promise<Storage> {
    if (this.initialized && this.storageInstance) {
      return this.storageInstance;
    }

    try {
      console.log('Initializing Ionic Storage...');
      this.storageInstance = await this.storage.create();
      this.initialized = true;
      console.log('Ionic Storage initialized successfully');
      return this.storageInstance;
    } catch (error) {
      console.error('Failed to initialize Ionic Storage:', error);
      throw error;
    }
  }

  async ensureInitialized(): Promise<Storage> {
    if (!this.initialized || !this.storageInstance) {
      return this.initPromise || this.init();
    }
    return this.storageInstance;
  }

  async set(key: string, value: any): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      console.log(`Setting storage key: ${key}`, value);
      await storage.set(key, value);
      console.log(`Successfully stored value for key: ${key}`);
    } catch (error) {
      console.error(`Error storing value for key: ${key}`, error);
      throw error;
    }
  }

  async get(key: string): Promise<any> {
    try {
      const storage = await this.ensureInitialized();
      const value = await storage.get(key);
      console.log(`Retrieved value for key: ${key}`, value);
      return value;
    } catch (error) {
      console.error(`Error retrieving value for key: ${key}`, error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const storage = await this.ensureInitialized();
      await storage.remove(key);
      console.log(`Successfully removed key: ${key}`);
    } catch (error) {
      console.error(`Error removing key: ${key}`, error);
      throw error;
    }
  }
}
