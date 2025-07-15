import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageInstance: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this.storageInstance = await this.storage.create();
  }

  async set(key: string, value: any) {
    await this.storageInstance?.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this.storageInstance?.get(key);
  }

  async remove(key: string) {
    await this.storageInstance?.remove(key);
  }
}
