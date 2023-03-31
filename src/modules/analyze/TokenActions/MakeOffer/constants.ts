export enum FAIR_LEVEL {
  HIGH = 'Fair level high',
  MEDIUM = 'Fair level medium',
  LOW = 'Fair level low',
}

export enum TYPE_TOKEN_ACTION {
  MAKE_OFFER = 'Make offer',
  PLACE_A_BID = 'Place a bid',
}

export const FAIR_LEVEL_TOOLTIPS = {
  [FAIR_LEVEL.HIGH]: 'fair level up to 15%',
  [FAIR_LEVEL.MEDIUM]: 'fair level from 15 to 30%',
  [FAIR_LEVEL.LOW]: 'fair level over 30%',
};
