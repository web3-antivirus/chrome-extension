/* eslint-disable camelcase */
export type SlitherDetector = {
  check: string;
  impact: string;
}

export type AnalysisSlitherDescriptor = AnalysisProviderDescriptor & {
  detectors: SlitherDetector[];
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

export type BitQuerySubject = {
  address: string;
  annotation: string;
  contractType?: string;
  protocol: string;
}

export type HoptrailItem = {
  address: string;
  tag: string;
  type: string;
  subtype: string;
  txhash: string;
  direction: string;
  timestamp: string;
}

export type ScamAnalysisDescriptor = {
  service1: BitQuerySubject;
  service2: HoptrailItem[];
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

export interface SmartcheckDetector {
  ruleId: string;
  patternId: string;
  severity: string;
  line: string;
  column: string;
  content: string;
}

export interface SmartcheckDescriptorPayload {
  hardcodedAddresses: SmartcheckDetector[];
}

export type SmartcheckCodeAnalysisDescriptor = AnalyzeResult<SmartcheckDescriptorPayload>;

export interface SlitherCodeAnalysisDescriptor extends AnalysisProviderDescriptor {
  detectors: SlitherDetector[];
}

export interface MetamorphicCodeAnalysisDescriptor extends AnalysisProviderDescriptor {
  risk: number;
  detectors: MetamorphicDetectors;
}

export type CodeAnalysisDescriptor = {
  verified: boolean;
  service1: SlitherCodeAnalysisDescriptor;
  service2: MetamorphicCodeAnalysisDescriptor;
  service3: SmartcheckCodeAnalysisDescriptor
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

export type RisksProps = {
  contract: Contract,
  collection: Collection,
  statistic: Statistic,
}
