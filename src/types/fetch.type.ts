/* eslint-disable camelcase */
export type Service1Detector = {
  check: string;
  impact: string;
}

export type Service1DetectorDescriptor = AnalysisProviderDescriptor & {
  detectors: Service1Detector[];
}

export type MetamorphicDetectors = {
  code_hash_changed: boolean;
  contains_metamorphic_init_code: boolean;
  contains_selfdestruct: boolean;
  contains_delegatecall: boolean;
  deployed_by_contract: boolean;
  deployer_contains_create2: boolean;
}

export type AnalysisMetamorphicDescriptor = AnalysisProviderDescriptor & {
  risk: number;
  detectors: MetamorphicDetectors;
}

export type AnalysisProviderDescriptor = {
  success: boolean;
}

export type Collection = {
  id: number,
  name: string,
  logo: string,
  isVerified: boolean,
}

export type Statistic = {
  numOfOwners: number,
  numOfTokens: number,
  marketCapUSD: number,
  floorPriceUSD: number,
}

export type ScamAnalysisDescriptor = {
  service1: any;
  service2: any;
}

export interface SuccessfulAnalyzeResult<TPayload> {
  success: true;
  payload: TPayload;
}
export interface ErrorAnalyzeResult {
  success: false;
  error: string;
}

export type AnalyzeResult<TPayload> = SuccessfulAnalyzeResult<TPayload> | ErrorAnalyzeResult;

export interface Service3Detector {
  ruleId: string;
  patternId: string;
  severity: string;
  line: string;
  column: string;
  content: string;
}

export interface Service3Payload {
  hardcodedAddresses: Service3Detector[];
}

export type Service3Descriptor = AnalyzeResult<Service3Payload>;

export interface Service1Descriptor extends AnalysisProviderDescriptor {
  detectors: Service1Detector[];
}

export type CodeAnalysisDescriptor = {
  verified: boolean;
  service1: Service1Descriptor;
  service2: any;
  service3: Service3Descriptor
}

export type AnalysisDescriptor = {
  risk: number
  verified: boolean
  scam: ScamAnalysisDescriptor;
  code: CodeAnalysisDescriptor;
}

export type Contract = {
  address: string,
  createdAt: string,
  analysis: AnalysisDescriptor,
}

export interface ABIItem {
  internalType?: string;
  type?: string;
  name: string;
  value?: ABIItem | ABIItem[] | string | boolean | null;
}

export type CallMethodDescriptor = {
  name?: string;
  nameHex?: string;
  gas: string; // HEX
  address: string;
  value: string; // HEX
  /**
   * If `true`, this CALL method can change depth.
   */
  moveToNewLevel?: boolean;
  params?: ABIItem;
}

export interface EventDescriptor {
  name: string;
  nameHex: string;
  params?: ABIItem | ABIItem[];
}

export interface Trace {
  id: string;
  parent: string;
  method: CallMethodDescriptor;
  calls: CallMethodDescriptor[];
  events: EventDescriptor[];
}

export interface TraceWithRisk extends Trace {
  risk: number;
}

export type RisksProps = {
  contract: Contract,
  collection: Collection,
  statistic: Statistic,
  trace: Trace[],
}
