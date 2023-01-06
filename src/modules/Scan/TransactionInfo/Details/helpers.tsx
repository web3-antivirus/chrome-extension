import { SwapPart } from 'components/SwapInfo/interfaces';
import { getNftName } from 'helpers/common.helpers';
import { ApprovesDetails, SwapDetails } from 'modules/Scan/interfaces';
import { ReactNode } from 'react';

export const getDetailsMessage = (swap: SwapDetails | null, permissionRequest: ApprovesDetails[] | null): ReactNode => {
  const getSwapMessage = (swapData: SwapPart[]) => swapData.map(
    ({ isToken, item }) => (isToken ? `${String((item).amount)} ${item.name}` : getNftName((item).id, item.name)),
  ).join(' and ');
  const lossMessage: string = swap ? getSwapMessage(swap.loss) : '';
  const incomeMessage: string = swap ? getSwapMessage(swap.income) : '';
  let swapMessage = ` swap ${lossMessage} ${`for ${incomeMessage}`}`;

  if (swap) {
    if (swap.loss.length && !swap.income.length) {
      swapMessage = ` transfer ${lossMessage} and get nothing back`;
    }

    if (!swap.loss.length && swap.income.length) {
      swapMessage = ` get ${incomeMessage} free`;
    }
  }

  const permissionMessage = permissionRequest ? permissionRequest.map(({ approvedAsset }) => approvedAsset).join(' and ') : '';

  return (
    <>
      This transaction would
      {swap && <b>{swapMessage}</b>}
      {permissionMessage ? <> {swap ? 'and' : ''} allow the following contract <b>to access {permissionMessage}</b></> : null}
    </>
  );
};
