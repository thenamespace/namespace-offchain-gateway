import { EVMGateway } from '@ensdomains/evm-gateway';
import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';
import { AppProperties } from 'src/configuration/app-properties';
import { L2GatewayService } from '../gateway.service';
import { ArbProofService, ArbProvableBlock } from './arb-proof.service';
import { InMemoryBlockCache } from './blockcache/inmemory-blockcache';

@Injectable()
export class ArbGatewayService extends L2GatewayService {
  evmGateway: EVMGateway<ArbProvableBlock>;

  constructor(private readonly appProperties: AppProperties) {
    super(
      new EVMGateway(
        new ArbProofService(
          new JsonRpcProvider(appProperties.l1RpcUrl),
          new JsonRpcProvider(appProperties.l2RpcUrl),
          appProperties.l2RollupAddress,
          new InMemoryBlockCache(),
        ),
      ),
    );
  }
}
