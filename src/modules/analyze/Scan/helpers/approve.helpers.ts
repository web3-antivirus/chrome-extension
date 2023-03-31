import { separateAddress } from 'helpers/address.helpers';
import { AnalyzeTransactionResponse } from 'interfaces/analyze.interfaces';
import { IRecipient } from 'modules/analyze/TokenActions/Approve/Recipient/interfaces';

export const getApprovePriceUsd = (data: AnalyzeTransactionResponse): number => data.approvedTokensVolume?.volumeUSD;

export const getApproveRecipient = (data: AnalyzeTransactionResponse): IRecipient => {
  const recipientAddress = data.traceOperations.approves[0]?.to || '';
  const recipientData = data.approveRecipients.find((recipient) => recipient.address === recipientAddress);
  const contractData = data.contractsAnalysis.find((contract) => contract.address === recipientAddress);
  const recipient: IRecipient = {
    name: recipientData?.name || contractData?.contract?.name || separateAddress(recipientAddress),
    address: recipientAddress,
    // if approve to recipient then can't be verified
    isAddressVerified: recipientData ? undefined : contractData?.verified,
    transactionsCount: contractData?.numOfTransactions,
    contractCreationDate: contractData?.createdAt,
    nftsCount: recipientData?.numOfTokens,
  };

  return recipient;
};
