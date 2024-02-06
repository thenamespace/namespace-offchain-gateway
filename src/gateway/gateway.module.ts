import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { SUBANME_DOMAIN, SubnameSchema } from './db/resolved-ens.schema';
import { GatewayDatabaseResolver } from './resolver/database.resolver';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGO_CONNECTION_STRING'),
      }),
    }),
    MongooseModule.forFeature([
      {
        schema: SubnameSchema,
        name: SUBANME_DOMAIN,
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, GatewayDatabaseResolver],
})
export class GatewayModule {}
