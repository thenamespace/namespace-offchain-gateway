import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppProperties {

    mongoConnectionString: string
    signerWallet: string

    constructor(private readonly configService: ConfigService) {
        this.mongoConnectionString = this.configService.getOrThrow("MONGO_CONNECTION_STRING");
        this.signerWallet = this.configService.getOrThrow("SIGNER_WALLET")
    }
}