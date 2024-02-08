import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppProperties } from './configuration/app-properties';
import { AppPropertiesModule } from './configuration/app-properties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRootAsync({
      imports: [AppPropertiesModule],
      useFactory: async (configService: AppProperties) => ({
        uri: configService.mongoConnectionString
      }),
      inject: [AppProperties]
    }),
    GatewayModule
  ],
})
export class AppModule {}
