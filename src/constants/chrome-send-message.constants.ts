export const METAMASK_PAUSE_TRANSACTION = 'metamaskPauseTransaction';
export const METAMASK_PAUSE_SIGN = 'metamaskPauseSign';
export const METAMASK_SEND_TRANSACTION = 'metamaskSendTransaction';
export const PERSONAL_SIGN = 'personal_sign';

export const CHANGE_IS_TURN_ON_WEB3_GUARD = 'changeIsTurnOnWeb3Guard';
export const CANCEL_CHECK_WEB3_GUARD = 'cancelCheckWeb3Guard';
export const DECLINE_TRANSACTION_WEB3_GUARD = 'declineTransactionWeb3Guard';
export const METAMASK_ETH_SIGN = 'metamaskEthSign';
export const REQUEST_OPEN_TRACING_DIAGRAM_PAGE = 'requestOpenTracingDiagramPage';
export const OPEN_TRACING_DIAGRAM_PAGE = 'openTracingDiagram';
export const CHANGE_ICON_OFF = 'changeIconOff';
export const CHANGE_ICON_ON = 'changeIconOn';

export const W3A_DECISION_EVENT = 'w3aDecisionEvent';

// TODO: replace with imports
export const MESSAGE_BY_METAMASK_METHOD = {
  eth_sendTransaction: METAMASK_PAUSE_TRANSACTION,
  eth_sign: METAMASK_ETH_SIGN,
  eth_signTypedData_v4: METAMASK_PAUSE_SIGN,
  personal_sign: PERSONAL_SIGN,
};
