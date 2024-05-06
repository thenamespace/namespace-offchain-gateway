import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address } from 'viem';

@Injectable()
export class AppProperties {
  mongoConnectionString: string;
  signerWallet: string;
  offchainResolver: Address;
  l2Resolver: Address;

  constructor(private readonly configService: ConfigService) {
    this.mongoConnectionString = this.configService.getOrThrow(
      'MONGO_CONNECTION_STRING',
    );
    this.signerWallet = this.configService.getOrThrow('SIGNER_WALLET');
    this.offchainResolver = this.configService.getOrThrow('OFFCHAIN_RESOLVER');
    this.l2Resolver = this.configService.getOrThrow('L2_RESOLVER');
  }
}
