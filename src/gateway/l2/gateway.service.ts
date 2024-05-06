import { EVMGateway } from '@ensdomains/evm-gateway';
import { Injectable } from '@nestjs/common';
import { JsonRpcProvider } from 'ethers';
import { AppProperties } from 'src/configuration/app-properties';
import { Hash, decodeAbiParameters, parseAbiParameters } from 'viem';
import { GatewayService } from '../gateway.service';
import { OPProofService, OPProvableBlock } from './op-proof.service';

@Injectable()
export class L2GatewayService implements GatewayService {
  evmGateway: EVMGateway<OPProvableBlock>;

  constructor(private readonly appProperties: AppProperties) {
    this.evmGateway = new EVMGateway(
      new OPProofService(
        new JsonRpcProvider(appProperties.l1RpcUrl),
        new JsonRpcProvider(appProperties.l2RpcUrl),
        appProperties.l2OracleOutput,
        0,
      ),
    );
  }

  async handle(senderContract: Hash, callData: Hash): Promise<{ data: Hash }> {
    const data = callData.substring(10);
    const args = decodeAbiParameters(
      parseAbiParameters(
        'address addr, bytes32[] memory commands, bytes[] memory constants',
      ),
      `0x${data}`,
    );

    const [addr, commands, constants] = args;
    const proofs = await this.evmGateway.createProofs(
      addr as string,
      commands as string[],
      constants as string[],
    );

    return { data: proofs as Hash };
  }
}
