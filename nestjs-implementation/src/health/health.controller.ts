import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('db')
  @ApiOperation({ summary: 'Vérifier la connexion à la base de données' })
  @ApiResponse({ status: 200, description: 'Connexion à la base de données opérationnelle.' })
  async getDbHealth() {
    return this.healthService.checkDb();
  }
}