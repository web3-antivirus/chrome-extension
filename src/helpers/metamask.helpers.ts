import {
  GOLOM_URL, LOOKSRARE_URL, ONEINCH_URL, OPEN_SEA_URL, RARIBLE_URL,
} from 'constants/marketplaces-urls.constants';
import { flatten } from 'lodash';
import { TYPE_TOKEN_ACTION } from 'modules/analyze/TokenActions/MakeOffer/constants';
import { PAYMENT_TOKENS, TOKEN_ADDRESSES } from 'constants/token.constants';
import { padHexNumber, removeLeadingZerosFromString } from './web3.helpers';
import { fromHexToString, sumNumbers } from './big-number.helpers';

interface IMessage {
  params: [string, string]
  method: string
}

export type OrderNftsTokensType = {
  address: string
  id: string
}[]
export interface OrderNftsType {
  isListing: boolean;
  sell: OrderNftsTokensType;
  buy: {
    tokenAddress: string;
    weiAmount: string;
    tokensCount: number | null;
    receiveWei?: string;
    openseaFeeWei?: string;
  }
}

export interface ITokenActionData {
  type: TYPE_TOKEN_ACTION;
  collectionAddress: string | null;
  tokenId: string | null;
  amountWei: string;
  currencyAddress: string;
  auctionId?: string | null;
}

enum ItemType {
  NATIVE,
  ERC20,
  ERC721,
  ERC1155,
  ERC721_WITH_CRITERIA,
  ERC1155_WITH_CRITERIA
}

export const hexToString = (hex: string): string => {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); }
  return str;
};

const ASCII_REGEX = /^[\x20-\x7E]*$/;
export const isStringFromASCII = (str: string): boolean => ASCII_REGEX.test(str);

export const getPersonalSignMessage = (signMessage: IMessage): string => {
  const signParams = signMessage.params[0];
  const parsedString = hexToString(signParams.slice(2));
  const isReadable = isStringFromASCII(parsedString);
  return isReadable ? parsedString : signParams;
};

export const checkSignDataForOrder = (signMessage: IMessage): {
  saleOrdersData?: OrderNftsType | null,
  message: Record<string, string>,
  tokenActionData?: ITokenActionData | null,
  limitOrderAddress?: string | null,
} => {
  const signParams = JSON.parse(signMessage.params[1]);
  const { message, domain } = signParams;

  const LISTING_ORDER_TYPES = ['2', '3', '4', '5'];

  if (domain.name === 'Seaport') {
    const messagesArr = message?.offer ? [message] : flatten(message?.tree ?? [])
      .filter((messageData: any) => Boolean(messageData?.offer?.length
      && messageData?.offer.find(
        (offer: Record<string, string>) => LISTING_ORDER_TYPES.includes(offer?.itemType),
      )));

    const isListing = messagesArr.length > 0;

    if (!isListing) return { message };

    const saleOrdersData = messagesArr.reduce((acc: any, messageData: any) => {

      const sell = messageData?.offer?.map(
        ({ token, identifierOrCriteria, itemType }: { token: string, identifierOrCriteria: string, itemType: ItemType }) => (
          { address: token, id: identifierOrCriteria, itemType }),
      );

      const tokenAddress = messageData?.consideration?.[0].token;
      const isPaymentTokens = Number(messageData?.consideration?.[0].itemType) === ItemType.ERC20
    || Number(messageData?.consideration?.[0].itemType) === ItemType.NATIVE;
      const weiAmount = (messageData?.consideration?.length > 1 && isPaymentTokens
      ) ? messageData?.consideration.reduce(
          (sum: string, { endAmount }: { endAmount: string }) => (
            sumNumbers(sum, endAmount)
          ), 0,
        ) : '';

      const receiveWei = messageData?.consideration?.[0]?.endAmount || '0';
      const openseaFeeWei = messageData?.consideration?.[1]?.endAmount || null;
      const tokensCount = !isPaymentTokens ? messageData?.consideration?.length : null;

      return ({
        ...acc,
        sell: [...acc.sell, ...sell],
        buy: {
          tokenAddress,
          weiAmount: sumNumbers(acc.buy.weiAmount || 0, +weiAmount || 0),
          openseaFeeWei: sumNumbers(acc.buy.openseaFeeWei || 0, +openseaFeeWei || 0),
          receiveWei: sumNumbers(acc.buy.receiveWei || 0, +receiveWei || 0),
          tokensCount: sumNumbers(acc.buy.tokensCount || 0, +tokensCount || 0),
        },
      }) as OrderNftsType;
    }, {
      isListing: window.location.origin === OPEN_SEA_URL,
      sell: [],
      buy: {
        tokenAddress: '',
        weiAmount: '',
        openseaFeeWei: '',
        receiveWei: '',
        tokensCount: '',
      },
    });

    console.log('!!!!', saleOrdersData);

    return { saleOrdersData: saleOrdersData as OrderNftsType, message };
  }

  if (window.location.origin === LOOKSRARE_URL && !message?.isOrderAsk) {
    const {
      collection: collectionAddress, tokenId, currency: currencyAddress, price: amountWei,
    } = message;

    const tokenActionData = {
      type: TYPE_TOKEN_ACTION.MAKE_OFFER,
      collectionAddress,
      tokenId,
      currencyAddress,
      amountWei,
    };

    return { tokenActionData, message };
  }

  if (window.location.origin === GOLOM_URL && message?.orderType === '1') {
    const {
      collection: collectionAddress, tokenId, totalAmt: amountWei,
    } = message;

    // golom uses only weth for make offer
    const currencyAddress = TOKEN_ADDRESSES[PAYMENT_TOKENS.WETH];

    const tokenActionData = {
      type: TYPE_TOKEN_ACTION.MAKE_OFFER,
      collectionAddress,
      tokenId,
      currencyAddress,
      amountWei,
    };

    return { tokenActionData, message };
  }

  // assetClass equal to "0x8ae85d84" means that user offer erc20 instead of erc721 or erc1155
  if (window.location.origin === RARIBLE_URL && message?.makeAsset?.assetType?.assetClass === '0x8ae85d84') {
    const assetData = message?.takeAsset?.assetType?.data;

    if (!assetData) return { message };
    const cleanData = assetData.replace('0x', '');
    const addressString = cleanData.slice(0, 64);
    const idString = cleanData.slice(64);

    const collectionAddress = padHexNumber(removeLeadingZerosFromString(addressString));
    const cleanIdString = `0x${removeLeadingZerosFromString(idString)}`;
    const tokenId = fromHexToString(cleanIdString);
    // NaN says that we place a bid for the collection
    if (tokenId === 'NaN') return { message };

    const {
      makeAsset: { value: amountWei, assetType: { data: currencyAddress } },
    } = message;

    const tokenActionData = {
      type: TYPE_TOKEN_ACTION.PLACE_A_BID,
      collectionAddress,
      tokenId,
      currencyAddress: `0x${removeLeadingZerosFromString(currencyAddress.slice(2))}`,
      amountWei,
    };

    return { tokenActionData, message };
  }

  if (window.location.origin === ONEINCH_URL && window.location.href.includes('/limit-order') && message?.takerAsset) {
    return { message, limitOrderAddress: message.takerAsset };
  }

  return {
    message,
  };
};
