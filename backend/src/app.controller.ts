import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,private dataSource: DataSource) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('ping')
  async pingDB(): Promise<string> {
    try {
      const isConnected = this.dataSource.isInitialized;
      return isConnected ? 'Database connected ✅' : 'Not connected ❌';
    } catch (err) {
      return `Error connecting to DB: ${err.message}`;
    }
  }
}
