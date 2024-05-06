import { Injectable } from '@nestjs/common';
import { AppProperties } from 'src/configuration/app-properties';
import { Address, Hash } from 'viem';
import { L2GatewayService } from './l2/gateway.service';
import { OffchainGatewayService } from './offchain/gateway.service';

export interface GatewayService {
  handle(senderContract: Address, callData: Hash): Promise<{ data: Hash }>;
}

export const GATEWAY_SERVICE = 'GATEWAY_SERVICE_PROXY';

@Injectable()
export class GatewayServiceProxy implements GatewayService {
  constructor(
    private readonly appProperties: AppProperties,
    private readonly offchainService: OffchainGatewayService,
    private readonly l2Service: L2GatewayService,
  ) {}

  handle(senderContract: Hash, callData: Hash): Promise<{ data: Hash }> {
    switch (senderContract?.toLocaleLowerCase()) {
      case this.appProperties.offchainResolver?.toLocaleLowerCase():
        return this.offchainService.handle(senderContract, callData);

      case this.appProperties.l2Resolver?.toLocaleLowerCase():
        return this.l2Service.handle(senderContract, callData);
    }

    throw new Error('Incorrect resolver provided.');
  }
}
