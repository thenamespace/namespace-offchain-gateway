import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address } from 'viem';

@Injectable()
export class AppProperties {
  mongoConnectionString: string;
  signerWallet: string;
  offchainResolver: Address;
  arbResolver: Address;
  l2RollupAddress: Address;
  l2Resolver: Address;
  l2OracleOutput: Address;
  l1RpcUrl: string;
  l2RpcUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.mongoConnectionString = this.configService.getOrThrow(
      'MONGO_CONNECTION_STRING',
    );
    this.signerWallet = this.configService.getOrThrow('SIGNER_WALLET');
    this.offchainResolver = this.configService.getOrThrow('OFFCHAIN_RESOLVER');
    this.arbResolver = this.configService.getOrThrow('ARB_RESOLVER');
    this.l2RollupAddress = this.configService.getOrThrow('L2_ROLLUP_ADDRESS');
    this.l2Resolver = this.configService.getOrThrow('L2_RESOLVER');
    this.l2OracleOutput = this.configService.getOrThrow('L2_ORACLE_OUTPUT');
    this.l1RpcUrl = this.configService.getOrThrow('L1_RPC_URL');
    this.l2RpcUrl = this.configService.getOrThrow('L2_RPC_URL');
  }
}
