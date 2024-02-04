import { Injectable } from '@nestjs/common';
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
  parseAbiParameters,
} from 'viem';
import { decodeDnsName } from './gateway.utils';
import RESOLVER_ABI from './resolver.json';
import { privateKeyToAccount } from 'viem/accounts';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class GatewayService {
  viemSigner: PrivateKeyAccount;
  ethersSigner: ethers.SigningKey;

  constructor(private readonly config: ConfigService) {
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

    console.log(`Signer address ${this.viemSigner.address}`);
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

    const { resultAddress, ttl } = this.resolveResult(
      decodedName,
      decodedFunction.functionName,
    );

    const result = encodeFunctionResult({
      abi: RESOLVER_ABI,
      functionName: decodedFunction.functionName,
      result: [resultAddress],
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

    const sig = this.ethersSigner.sign(digest)
    const ethersSig = ethers.concat([sig.r, sig.s, new Uint8Array([sig.v])]) as any;

    const finalResult = encodeAbiParameters(
      parseAbiParameters('bytes response, uint64 ttl, bytes signature'),
      [result, BigInt(ttl), ethersSig],
    );

    return {
      data: finalResult,
    };
  }

  private resolveResult = (ensName: string, functionName: string) => {
    return {
      resultAddress: '0x3E1e131E7e613D260F809E6BBE6Cbf7765EDC77f',
      ttl: Date.now(),
    };
  };
}
