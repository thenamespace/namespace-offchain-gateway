
export interface ResolverResult {
  value: string
  ttl: number
}

export interface GatewayResolver {
  getText: (fullEnsName: string, key: string) => Promise<ResolverResult>;
  getAddress: (fullEnsName: string, coinType: string) => Promise<ResolverResult>;
  getContentHash: (fullEnsName: string) => Promise<ResolverResult>
}
