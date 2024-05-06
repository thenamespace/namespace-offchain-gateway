import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { OffchainGatewayService } from './offchain/gateway.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SUBANME_DOMAIN, SubnameSchema } from './db/resolved-ens.schema';
import { GatewayDatabaseResolver } from './resolver/database.resolver';
import { AppPropertiesModule } from 'src/configuration/app-properties.module';
import { ResolvedEnsRepository } from './db/resovled-ens.repository';
import { L2GatewayService } from './l2/gateway.service';
import { GATEWAY_SERVICE, GatewayServiceProxy } from './gateway.service';

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
    {
      provide: GATEWAY_SERVICE,
      useClass: GatewayServiceProxy,
    },
    OffchainGatewayService,
    L2GatewayService,
    GatewayDatabaseResolver,
    ResolvedEnsRepository,
  ],
})
export class GatewayModule {}
