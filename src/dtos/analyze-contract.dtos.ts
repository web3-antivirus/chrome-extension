import {
  ContractAnalysisDTO, Web3ContractAuditEntity, Web3ContractEntityDTO, Web3ProjectEntity,
} from 'interfaces/analyze.interfaces';
import { ValidatedAnalysisDescriptorDTO } from './url-analyze.dto';

export class AnalyzeContractResponse {

  project: Web3ProjectEntity;

  contract: Web3ContractEntityDTO;

  audits: Web3ContractAuditEntity[];

  siteAnalysis: ValidatedAnalysisDescriptorDTO;

  analysis: ContractAnalysisDTO;

}
