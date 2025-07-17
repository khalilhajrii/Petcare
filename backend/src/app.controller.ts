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
  @Get('ping-db')
  async pingDB() {
    try {
      const isConnected = this.dataSource.isInitialized;
      return { status: 'ok', message: isConnected ? 'Database connection successful' : 'Not connected' };
    } catch (err: unknown) {
      const error = err as Error;
      return { status: 'error', message: error.message };
    }
  }
}
