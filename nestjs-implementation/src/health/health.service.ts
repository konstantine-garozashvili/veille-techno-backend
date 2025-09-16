import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  constructor(private readonly dataSource: DataSource) {}

  async checkDb(): Promise<{ status: string; details: { database: string } }> {
    await this.dataSource.query('SELECT 1');
    return { status: 'ok', details: { database: 'up' } };
  }
}