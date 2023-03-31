import { EXTENSION_ACTION_API } from 'constants/check-nft.constants';
import { ExtensionUserActionType } from 'interfaces/common.interfaces';

export const sendAction = async (
  userId: string,
  actionEntity: string | null,
  actionType: ExtensionUserActionType, actionValue: Record<string, string | boolean> | string, websiteURL: string,
): Promise<Response> => fetch(EXTENSION_ACTION_API, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  body: JSON.stringify({
    userId,
    actionEntity,
    actionType,
    actionValue,
    websiteURL,
  }),
});
