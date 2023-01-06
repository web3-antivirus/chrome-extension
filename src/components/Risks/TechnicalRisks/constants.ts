/* eslint-disable max-len */
export enum TECHNICAL_RISKS {
  CONTRACT_CODE = 'CONTRACT_CODE',
  METAMORPHIC_CODE = 'METAMORPHIC_CODE',
  SELF_DESTRUCT = 'SELF_DESTRUCT',
  DELEGATE_CALL = 'DELEGATE_CALL',
  DEPLOYED_BY_CONTRACT = 'DEPLOYED_BY_CONTRACT',
  PRE_DETERMINED_ADDRESS = 'PRE_DETERMINED_ADDRESS',
}

export const TECHNICAL_RISKS_LABELS = {
  CONTRACT_CODE: 'Contract code',
  METAMORPHIC_CODE: 'Metamorphic code',
  SELF_DESTRUCT: 'Self-destruction',
  DELEGATE_CALL: 'Delegated call',
  DEPLOYED_BY_CONTRACT: 'Deployed by contract',
  PRE_DETERMINED_ADDRESS: 'Predetermined address',
};

export const TECHNICAL_RISKS_INFO = {
  CONTRACT_CODE: 'If contract code has been changed, this is a sign of a suspicious contract.',
  METAMORPHIC_CODE: 'If there are bytecode templates, this is a sign of a suspicious contract.',
  SELF_DESTRUCT: 'If a contract can self-destruct, this is a sign of a suspicious contract. The method is not accurate and its absence doesn\'t mean that the contract is secure since it can be disguised.',
  DELEGATE_CALL: 'If a contract can delegate calls to other contracts, it can be a sign of its ability to self-destruct. Can be used in the simplest functioning of the contract. Yet, it doesn\'t serve any purpose without other indicators.',
  DEPLOYED_BY_CONTRACT: 'If a contract was initiated and deployed by another contract, this is a sign of a suspicious contract.',
  PRE_DETERMINED_ADDRESS: 'Implies that the contract was deployed with a pre-determined addressIf a contract can be deployed with a predetermined address, this is a sign of a suspicious contract.',
};
