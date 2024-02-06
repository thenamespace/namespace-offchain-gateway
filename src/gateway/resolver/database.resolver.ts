import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GatewayResolver, ResolverResult } from './gatway.resolver';
import { ResolvedEnsRepository } from '../db/resovled-ens.repository';

// 60 for ethereum address
const DEFAULT_ADDRESS_COIN_TYPE = '60';

@Injectable()
export class GatewayDatabaseResolver implements GatewayResolver {
  constructor(private readonly repository: ResolvedEnsRepository) {}

  public async getText(fullName: string, key: string): Promise<ResolverResult> {;
    const subname = await this.getSubname(fullName);

    if (subname.textRecords && subname.textRecords[key]) {
      return {
        value: subname.textRecords[key],
        ttl: subname.ttl || 0
      }
    }
    return {
      ttl: 0,
      value: ""
    };
  }

  public async getAddress(fullName: string, coinType?: string): Promise<ResolverResult> {
    const subname = await this.getSubname(fullName);
    const _coin = coinType || DEFAULT_ADDRESS_COIN_TYPE;
    if (subname.addresses && subname.addresses[_coin]) {
      return {
        value: subname.addresses[_coin],
        ttl: subname.ttl || 0
      }
    }
    return {
      ttl: 0,
      value: ""
    };
  }

  public async getContentHash(fullName: string): Promise<ResolverResult> {
    const subname = await this.getSubname(fullName);
    return {
      value: subname.contentHash || "",
      ttl: subname.ttl || 0
    }
  }

  private getSubname = async (ensName: string) => {
    const subname = await this.repository.findOne({
      fullName: ensName
    });
    if (!subname && !subname.id) {
      throw new NotFoundException(`Subname not found`);
    }
    return subname;
  };
}
