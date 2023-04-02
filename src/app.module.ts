import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';
import entities, { User } from './entity';
import { UtilityService } from './services/utility.service';
import { UserDao } from './dao/user.dao';
import { FileProcessingService } from './services/file-processing.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.CONFIG_DIR.trim()}/${process.env.ENVIRONMENT.trim()}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController],
  providers: [AppService, FileProcessingService, UtilityService, UserDao],
})
export class AppModule {}
