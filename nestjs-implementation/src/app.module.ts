import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health/health.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ListsModule } from './lists/lists.module'
import { CardsModule } from './cards/cards.module'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DB_USER || process.env.DATABASE_USER || 'kanban_user',
      password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || 'kanban_password',
      database: process.env.DB_NAME || process.env.DATABASE_NAME || 'kanban_api',
      autoLoadEntities: true,
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      // Keep Playground off (deprecated) and use Apollo Sandbox landing page in dev
      playground: false,
      introspection: process.env.NODE_ENV !== 'production',
      csrfPrevention: process.env.NODE_ENV === 'production',
      plugins: process.env.NODE_ENV !== 'production' ? [ApolloServerPluginLandingPageLocalDefault()] : [],
      installSubscriptionHandlers: false,
      context: ({ req }) => ({ req }),
      path: '/graphql',
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    ListsModule,
    CardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
