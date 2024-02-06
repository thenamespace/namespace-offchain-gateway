import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Address,
  Hash,
  PrivateKeyAccount,
  decodeAbiParameters,
  decodeFunctionData,
  encodeAbiParameters,
  encodeFunctionResult,
  encodePacked,
  keccak256,
  namehash,
  parseAbiParameters,
} from 'viem';
import { decodeDnsName } from './gateway.utils';
import RESOLVER_ABI from './resolver_abi.json';
import { privateKeyToAccount } from 'viem/accounts';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { GatewayResolver } from './resolver/gatway.resolver';

const addr = 'addr';
const text = 'text';
const contentHash = 'contentHash';
const supportedFunctions = [addr, text, contentHash];
const defaultCoinType = '60';

@Injectable()
export class GatewayService {
  viemSigner: PrivateKeyAccount;
  ethersSigner: ethers.SigningKey;

  constructor(
    private readonly config: ConfigService,
    private readonly resolver: GatewayResolver,
  ) {
    const privateKey = this.config.getOrThrow('SIGNER_WALLET') as string;
    const _pk = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
    this.viemSigner = privateKeyToAccount(_pk as Hash);

    // currently there is an issue when generating signature with viem signer
    this.ethersSigner = new ethers.SigningKey(_pk);
  }

  public async handle(
    resolverContract: Address,
    callData: Hash,
  ): Promise<{ data: Hash }> {
    // removing first 10 charachers of a byte string
    // 2 - 0x prefix
    // 8 - 'resolve' function signature
    const data = callData.substring(10);

    const parsedCallData = decodeAbiParameters(
      parseAbiParameters('bytes name, bytes callData'),
      `0x${data}`,
    );

    const dnsEncodedName = parsedCallData[0];
    const encodedFunctionData = parsedCallData[1];

    const decodedName = decodeDnsName(
      Buffer.from(dnsEncodedName.slice(2), 'hex'),
    );

    const decodedFunction = decodeFunctionData({
      abi: RESOLVER_ABI,
      data: encodedFunctionData,
    });

    console.log(
      `Request for resolving name ${decodedName} with function ${decodedFunction.functionName}, with params ${decodedFunction.args}`,
    );

    const { value, ttl } = await this.resolveResult(
      decodedName,
      decodedFunction.functionName,
      decodedFunction.args,
    );

    const result = encodeFunctionResult({
      abi: RESOLVER_ABI,
      functionName: decodedFunction.functionName,
      result: [value],
    });

    const digest = keccak256(
      encodePacked(
        ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
        [
          '0x1900',
          resolverContract,
          BigInt(ttl),
          keccak256(callData),
          keccak256(result),
        ],
      ),
    );

    // const signature = await this.viemSigner.signMessage({
    //   message: { raw: digest },
    // });

    // const nonRaw = await this.viemSigner.signMessage({
    //   message: digest,
    // });

    const sig = this.ethersSigner.sign(digest);
    const ethersSig = ethers.concat([
      sig.r,
      sig.s,
      new Uint8Array([sig.v]),
    ]) as any;

    const finalResult = encodeAbiParameters(
      parseAbiParameters('bytes response, uint64 ttl, bytes signature'),
      [result, BigInt(ttl), ethersSig],
    );

    return {
      data: finalResult,
    };
  }

  private resolveResult = async (
    ensName: string,
    functionName: string,
    args: readonly any[],
  ) => {
    const nameNode = namehash(ensName);
    const funcNode = args[0];

    if (nameNode !== funcNode) {
      throw new BadRequestException('Namehash missmatch');
    }

    if (supportedFunctions.includes(functionName)) {
      throw new BadRequestException('Unsupported opperation ' + functionName);
    }

    switch (functionName) {
      case addr:
        const coinType = args.length > 1 ? args.length[1] : defaultCoinType;
        return this.resolver.getAddress(ensName, coinType);
      case text:
        if (args.length < 2) {
          throw new BadRequestException('Text key not found');
        }
        return this.resolver.getText(ensName, args[1]);
      default:
        return this.resolver.getContentHash(ensName);
    }
  };
}
