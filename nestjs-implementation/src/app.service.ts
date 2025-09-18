import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly usersService: UsersService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    // Seed a first admin user automatically in development only
    if (process.env.NODE_ENV !== 'development') return;

    try {
      const hasAdmin = (await this.usersService.findAll()).some((u) => u.roles.includes('admin'));
      if (hasAdmin) {
        this.logger.log('Admin user already present, skipping seed');
        return;
      }

      const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
      const password = process.env.SEED_ADMIN_PASSWORD || 'Password123!';

      // Create if not exists
      const existing = await this.usersService.findByEmail(email);
      let id: string;
      if (!existing) {
        const created = await this.usersService.create({ email, password });
        id = created.id as string;
        this.logger.log(`Seeded base user ${email}`);
      } else {
        id = existing.id;
        this.logger.log(`Using existing user ${email} for admin seeding`);
      }

      // Elevate to admin role
      await this.usersService.update(id, { roles: ['admin'] });
      this.logger.log(`Seeded admin user: ${email}`);
    } catch (err) {
      this.logger.error('Admin seeding failed', err as Error);
    }
  }
}
