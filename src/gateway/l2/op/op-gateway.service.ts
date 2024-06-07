import { EVMGateway } from '@ensdomains/evm-gateway';
import { JsonRpcProvider } from 'ethers';
import { AppProperties } from 'src/configuration/app-properties';
import { L2GatewayService } from '../gateway.service';
import { OPProofService } from '../op-proof.service';

export class OpProofService extends L2GatewayService {
  constructor(appProperties: AppProperties) {
    super(
      new EVMGateway(
        new OPProofService(
          new JsonRpcProvider(appProperties.l1RpcUrl),
          new JsonRpcProvider(appProperties.l2RpcUrl),
          appProperties.l2OracleOutput,
          0,
        ),
      ),
    );
  }
}
