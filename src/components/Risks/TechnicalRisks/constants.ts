/* eslint-disable max-len */
export enum TECHNICAL_RISKS {
  CONTRACT_CODE = 'CONTRACT_CODE',
  METAMORPHIC_CODE = 'METAMORPHIC_CODE',
  SELF_DESTRUCT = 'SELF_DESTRUCT',
  DELEGATE_CALL = 'DELEGATE_CALL',
  DEPLOYED_BY_CONTRACT = 'DEPLOYED_BY_CONTRACT',
  PRE_DETERMINED_ADDRESS = 'PRE_DETERMINED_ADDRESS',
  PAUSABLE_CONTRACT = 'PAUSABLE_CONTRACT',
  BURNABLE_TOKEN = 'BURNABLE_TOKEN',
}

export const TECHNICAL_RISKS_LABELS = {
  [TECHNICAL_RISKS.CONTRACT_CODE]: (hasRisk: boolean): string => (hasRisk ? 'Changed contract code detected' : 'No changed contract code'),
  [TECHNICAL_RISKS.METAMORPHIC_CODE]: (hasRisk: boolean): string => (hasRisk ? 'Metamorphic code detected' : 'No metamorphic code'),
  [TECHNICAL_RISKS.SELF_DESTRUCT]: (hasRisk: boolean): string => (hasRisk ? 'Self-destruction ability detected' : 'No self-destruction ability'),
  [TECHNICAL_RISKS.DELEGATE_CALL]: (hasRisk: boolean): string => (hasRisk ? 'Delegated call detected' : 'No delegated call'),
  [TECHNICAL_RISKS.DEPLOYED_BY_CONTRACT]: (hasRisk: boolean): string => (hasRisk ? 'Was deployed by contract ' : 'Was not deployed by contract'),
  [TECHNICAL_RISKS.PRE_DETERMINED_ADDRESS]: (hasRisk: boolean): string => (hasRisk ? 'Predetermined address detected' : 'No predetermined address'),
  [TECHNICAL_RISKS.PAUSABLE_CONTRACT]: (hasRisk: boolean): string => (hasRisk ? 'Contract can be paused' : 'Contract can\'t be paused'),
  [TECHNICAL_RISKS.BURNABLE_TOKEN]: (hasRisk: boolean): string => (hasRisk ? 'Token has the ability to burn' : 'Token has no ability to burn'),
};

export const TECHNICAL_RISKS_INFO = {
  [TECHNICAL_RISKS.CONTRACT_CODE]: 'If contract code has been changed, this is a sign of a suspicious contract.',
  [TECHNICAL_RISKS.METAMORPHIC_CODE]: 'If there are bytecode templates, this is a sign of a suspicious contract.',
  [TECHNICAL_RISKS.SELF_DESTRUCT]: 'If a contract can self-destruct, this is a sign of a suspicious contract. The method is not accurate and its absence doesn\'t mean that the contract is secure since it can be disguised.',
  [TECHNICAL_RISKS.DELEGATE_CALL]: 'If a contract can delegate calls to other contracts, it can be a sign of its ability to self-destruct. Can be used in the simplest functioning of the contract. Yet, it doesn\'t serve any purpose without other indicators.',
  [TECHNICAL_RISKS.DEPLOYED_BY_CONTRACT]: 'If a contract was initiated and deployed by another contract, this is a sign of a suspicious contract.',
  [TECHNICAL_RISKS.PRE_DETERMINED_ADDRESS]: 'Implies that the contract was deployed with a pre-determined addressIf a contract can be deployed with a predetermined address, this is a sign of a suspicious contract.',
  [TECHNICAL_RISKS.PAUSABLE_CONTRACT]: 'If a contract can be halted, you can lose the ability to make further transactions.',
  [TECHNICAL_RISKS.BURNABLE_TOKEN]: 'If a contract has the ability to burn tokens, it can affect their price.',
};
