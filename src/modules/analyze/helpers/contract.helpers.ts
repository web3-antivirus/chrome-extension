import { HardcodedLogicData } from 'components/Risks/HardcodedLogic/interfaces';
import { RisksData } from 'components/Risks/interfaces';
import { SuspiciousActivityData } from 'components/Risks/SuspiciousActivity/interfaces';
import { TECHNICAL_RISKS } from 'components/Risks/TechnicalRisks/constants';
import { TechnicalRisksData } from 'components/Risks/TechnicalRisks/interfaces';
import { VulnerableCodeDetectorsData } from 'components/Risks/VulnerableCodeDetectors/interfaces';
import { ContractAnalysisDTO } from 'interfaces/analyze.interfaces';
import { sortBy, groupBy } from 'lodash';
import { CODE_DETECTORS_INFO } from '../Scan/constants';

const getContractTechnicalRisks = (data: ContractAnalysisDTO): TechnicalRisksData => {
  const detectors = {
    ...data?.code?.service2?.detectors || {},
    ...data?.code?.service4?.success ? (data?.code?.service4?.payload || {}) : {},
  };

  return ({
    [TECHNICAL_RISKS.CONTRACT_CODE]: detectors.code_hash_changed,
    [TECHNICAL_RISKS.DELEGATE_CALL]: detectors.contains_delegatecall,
    [TECHNICAL_RISKS.DEPLOYED_BY_CONTRACT]: detectors.deployed_by_contract,
    [TECHNICAL_RISKS.METAMORPHIC_CODE]: detectors.contains_metamorphic_init_code,
    [TECHNICAL_RISKS.PRE_DETERMINED_ADDRESS]: detectors.deployer_contains_create2,
    [TECHNICAL_RISKS.SELF_DESTRUCT]: detectors.contains_selfdestruct,
    [TECHNICAL_RISKS.PAUSABLE_CONTRACT]: detectors.hasPause,
    [TECHNICAL_RISKS.BURNABLE_TOKEN]: detectors.hasBurn,
  });
};

const getContractSuspiciousActivities = (data: ContractAnalysisDTO): SuspiciousActivityData => {
  const activities = data?.scam?.service2?.payload || [];

  const groupedActivities = groupBy(activities, 'tag');

  const result = Object.keys(groupedActivities).map((activity) => {
    const datesArr = sortBy(groupedActivities[activity], (item) => new Date(Number(item.timestamp) * 1000));
    const date = new Date(Number(datesArr[0].timestamp) * 1000).toISOString();
    return ({
      date,
      text: activity,
      count: groupedActivities[activity].length,
    });
  });

  return result;
};

const getContractHardcodedAddresses = (data: ContractAnalysisDTO): HardcodedLogicData => {
  const hardcodedAddresses = data?.code?.service3?.success
    ? data?.code?.service3?.payload?.hardcodedAddresses.map(({ content }) => content) : [];
  return hardcodedAddresses as HardcodedLogicData;
};

const getContractVulnerableCodeDetectors = (data: ContractAnalysisDTO): VulnerableCodeDetectorsData => {
  const detectors = data?.code?.service1?.detectors || [];
  return detectors.map(({ check }) => ({ name: check, info: CODE_DETECTORS_INFO[check] }));
};

export const getContractRisks = (data: ContractAnalysisDTO): { count: number; risks: RisksData } => {
  const technicalRisksData = getContractTechnicalRisks(data);
  const technicalRisksCount = Object.values(technicalRisksData).filter((risk) => risk).length;

  const suspiciousActivityData = getContractSuspiciousActivities(data);
  const suspiciousActivityCount = suspiciousActivityData.length;

  const vulnerableCodeDetectorsData = getContractVulnerableCodeDetectors(data);
  const vulnerableCodeDetectorsCount = vulnerableCodeDetectorsData.length;

  const hardcodedAddressesData = getContractHardcodedAddresses(data);
  const hardcodedAddressesCount = hardcodedAddressesData.length;

  const count = technicalRisksCount
    // + suspiciousActivityCount
    + vulnerableCodeDetectorsCount
    + hardcodedAddressesCount;

  return ({
    count,
    risks: {
      technicalRisks: { count: technicalRisksCount, data: technicalRisksData },
      suspiciousActivity: { count: suspiciousActivityCount, data: suspiciousActivityData },
      vulnerableCodeDetectors: { count: vulnerableCodeDetectorsCount, data: vulnerableCodeDetectorsData },
      hardcodedLogic: { count: hardcodedAddressesCount, data: hardcodedAddressesData },
    },
  });
};
