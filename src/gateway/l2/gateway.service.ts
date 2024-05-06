import { EVMGateway, ProvableBlock } from '@ensdomains/evm-gateway';
import { Injectable } from '@nestjs/common';
import { Hash, decodeAbiParameters, parseAbiParameters } from 'viem';
import { GatewayService } from '../gateway.service';

@Injectable()
export class L2GatewayService implements GatewayService {
  evmGateway: EVMGateway<ProvableBlock>;

  constructor(evmGateway: EVMGateway<ProvableBlock>) {
    this.evmGateway = evmGateway;
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
