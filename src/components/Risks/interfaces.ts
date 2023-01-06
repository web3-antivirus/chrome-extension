import { HardcodedLogicData } from './HardcodedLogic/interfaces';
import { SuspiciousActivityData } from './SuspiciousActivity/interfaces';
import { TechnicalRisksData } from './TechnicalRisks/interfaces';
import { VulnerableCodeDetectorsData } from './VulnerableCodeDetectors/interfaces';

export interface RiskData<T> {
  count: number;
  data: T
}

export interface RisksData {
  technicalRisks: RiskData<TechnicalRisksData>;
  suspiciousActivity: RiskData<SuspiciousActivityData>;
  vulnerableCodeDetectors: RiskData<VulnerableCodeDetectorsData>;
  hardcodedLogic: RiskData<HardcodedLogicData>;
}
