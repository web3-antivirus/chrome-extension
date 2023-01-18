import { RisksData } from 'components/Risks/interfaces';
import { RISK_TYPE } from 'constants/risks.constants';
import { ContractAnalysisDTO } from 'interfaces/analyze.interfaces';
import { Trace } from 'types/fetch.type';

export interface ProtocolRisks {
  name: string;
  description?: string;
  label?: string;
  risk: RISK_TYPE;
  isVerified?: boolean;
  risksCount: number;
  data?: RisksData;
  contract?: ContractAnalysisDTO;
}

export interface HighlightAlert {
  risk: RISK_TYPE;
  text?: string;
  contract?: {
    verified: boolean;
    name: string
  }
  icon?: string;
  simulation?: Trace[];
}
