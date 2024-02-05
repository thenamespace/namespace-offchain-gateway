import { Injectable } from "@nestjs/common";

interface GatewayHandler {
    handle(ensName: string, args: any[])
}

type ResolverSignature = "addr" | "text" | "contentHash"

export class AddrHandler implements GatewayHandler {
    
    public async handle(ensName: string, args: string[]): Promise<string> {
        return "";
    }
}

export class TextHandler implements GatewayHandler {
    public async handle(ensName: string, args: string[]): Promise<string> {
        return "";
    }
}

export class ContentHashHandler implements GatewayHandler {
    public async handle(ensName: string, args: string[]): Promise<string> {
        return "";
    }
}

const handlers: Record<ResolverSignature, GatewayHandler> = {
    addr: new AddrHandler(),
    contentHash: new ContentHashHandler(),
    text: new TextHandler()
}

@Injectable()
export class DatabaseGatewayHandlers {
    public handleFunction(resolverSignature: ResolverSignature, args: any[]) {
        
    }
}

