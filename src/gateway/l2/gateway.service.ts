import { GatewayService } from '../gateway.service';

export class L2GatewayService implements GatewayService {
  handle(
    resolverContract: `0x${string}`,
    callData: `0x${string}`,
  ): Promise<{ data: `0x${string}` }> {
    throw new Error('Method not implemented.');
  }
}
