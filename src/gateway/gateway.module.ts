import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SUBANME_DOMAIN, SubnameSchema } from './db/resolved-ens.schema';
import { GatewayDatabaseResolver } from './resolver/database.resolver';
import { AppPropertiesModule } from 'src/configuration/app-properties.module';
import { ResolvedEnsRepository } from './db/resovled-ens.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        schema: SubnameSchema,
        name: SUBANME_DOMAIN,
      },
    ]),
    AppPropertiesModule,
  ],
  controllers: [GatewayController],
  providers: [
    GatewayService,
    GatewayDatabaseResolver,
    ResolvedEnsRepository
  ],
})
export class GatewayModule {}
