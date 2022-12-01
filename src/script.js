// Note: this code is embedded into the page through the script tag.
// This is necessary since only inline code through the script tag can access the window.ethereum of this page
import {
  METAMASK_PAUSE_TRANSACTION,
  METAMASK_SEND_TRANSACTION,
  METAMASK_ETH_SIGN,
  METAMASK_PAUSE_SIGN,
  CHANGE_IS_TURN_ON_WEB3_GUARD,
  DECLINE_TRANSACTION_WEB3_GUARD,
  CANCEL_CHECK_WEB3_GUARD,
} from "./constants/chrome-send-message.constants.ts";
import { METAMASK_METHODS } from "./constants/metamask.constants.ts";

const ETH_CHAIN = '0x1';
let chainId = null;

if (window.ethereum && window.ethereum.request) {
  const metamaskRequest = window.ethereum.request;
  let isTurnOnWeb3Guard = true;

  // Note: the customRequest function listens to all events called for the MetaMask. 
  // And when calling the transaction method, customRequest gives information about the contract to content.js (inject) so that content.js can analyze the contract and tell its degree of risk
  const customRequest = ({ ...ethereumRequestArguments }) => {
    return new Promise((resolve, reject) => {
      if (
        ethereumRequestArguments.method === METAMASK_METHODS.sendTransaction &&
        isTurnOnWeb3Guard === true && chainId === ETH_CHAIN
      ) {
        window.postMessage(
          {
            type: METAMASK_PAUSE_TRANSACTION,
            jsonData: JSON.stringify(ethereumRequestArguments),
          },
          "*"
        );
      } else if (
        ethereumRequestArguments.method === METAMASK_METHODS.signData &&
        isTurnOnWeb3Guard === true && chainId === ETH_CHAIN
      ) {
        window.postMessage(
          {
            type: METAMASK_PAUSE_SIGN,
            jsonData: JSON.stringify(ethereumRequestArguments),
          },
          "*"
        );
      } else if (
        ethereumRequestArguments.method === METAMASK_METHODS.ethSign &&
        isTurnOnWeb3Guard === true && chainId === ETH_CHAIN
      ) {
        window.postMessage(
          {
            type: METAMASK_ETH_SIGN,
            jsonData: JSON.stringify(ethereumRequestArguments),
          },
          "*"
        );
      } else {
        return metamaskRequest({ ...ethereumRequestArguments })
          .then((data) => {
            if (ethereumRequestArguments.method === METAMASK_METHODS.ethChainId) {
              chainId = data;
            }
            resolve(data);
          })
          .catch((error) => reject(error));
      }

      const messageListener = (event) => {
        if (event.source !== window) {
          return;
        }

        // Note: if the user decides that the contract does not seem dangerous for him, then he clicks on the 'Proceed' button, and we execute
        // the transactions paused a little higher
        if (event.data.type && event.data.type === METAMASK_SEND_TRANSACTION) {
          const transactionArguments = JSON.parse(event.data.jsonData);
          window.removeEventListener("message", messageListener, false);
          return metamaskRequest({
            method: transactionArguments.method,
            params: {
              ...(ethereumRequestArguments.params || {}),
              fromExtension: true,
            },
          })
            .then((data) => resolve(data))
            .catch((error) => reject(error));
        }

        // Note: if the user decides that the contract seems dangerous, then he clicks on the "Decline" button, or cancel check web3 guard
        // the transaction will be canceled
        if (
          event.data.type &&
          [DECLINE_TRANSACTION_WEB3_GUARD, CANCEL_CHECK_WEB3_GUARD].includes(
            event.data.type
          )
        ) {
          window.removeEventListener("message", messageListener, false);
          reject({
            code: 4001,
            message:
              "MetaMask Tx Signature: User denied transaction signature.",
          });
          return;
        }

        // Note: Here I am tracking the change of the “Web3 Guard” switch (https://monosnap.com/file/0U29z9GZHeqEES20FN8CSHP2kISLKv).
        // If it is enabled, then all transactions are stopped and scanned before being sent. If it is disabled, then transactions are not scanned
        if (
          event.data.type &&
          event.data.type === CHANGE_IS_TURN_ON_WEB3_GUARD
        ) {
          isTurnOnWeb3Guard = event.data.isTurnOnWeb3Guard;
        }
      };

      window.addEventListener("message", messageListener, false);
    });
  };

  window.ethereum.request = customRequest;
}

if (window.postMessage) {
  const postRequest = window.postMessage;
  let isTurnOnWeb3Guard = true;

  // Note: the customRequest function listens for all events called for the metamask. And when calling the transaction method, customRequest
  // gives information about the contract to content.js (inject) so that content.js can analyze the contract and tell its degree of risk
  const customRequest = (data, ...rest) => {
      if (
        data.target === "metamask-contentscript" &&
        data.data &&
        data.data.data &&
        data.data.data.params &&
        !data.data.data.params.fromExtension &&
        isTurnOnWeb3Guard === true &&
        chainId === ETH_CHAIN
      ) {
        if (
          data.data.data.method ===
          METAMASK_METHODS.sendTransaction
        ) {
          window.postMessage(
            {
              type: METAMASK_PAUSE_TRANSACTION,
              jsonData: JSON.stringify(data.data.data),
            },
            "*"
          );
        } else if (
          data.data.data.method ===
          METAMASK_METHODS.signData
        ) {
          window.postMessage(
            {
              type: METAMASK_PAUSE_SIGN,
              jsonData: JSON.stringify(data.data.data),
            },
            "*"
          );
        } else if (
          data.data.data.method === METAMASK_METHODS.ethSign
        ) {
          window.postMessage(
            {
              type: METAMASK_ETH_SIGN,
              jsonData: JSON.stringify(data.data.data),
            },
            "*"
          );
        } else {
          return postRequest(data, ...rest);
        }
      } else {
        return postRequest(data, ...rest);
      }

      const messageListener = (event) => {
        if (event.source !== window) {
          return;
        }

        if (event.data.type && event.data.type === METAMASK_SEND_TRANSACTION) {
          const transactionArguments = JSON.parse(event.data.jsonData);
          window.removeEventListener("message", messageListener, false);
          return postRequest({
            target: "metamask-contentscript",
            fromListener: true,
            data: {
              name: "metamask-provider",
              data: { ...transactionArguments },
            },
          });
        }

        if (
          event.data.type &&
          [DECLINE_TRANSACTION_WEB3_GUARD, CANCEL_CHECK_WEB3_GUARD].includes(
            event.data.type
          )
        ) {
          window.removeEventListener("message", messageListener, false);
          return;
        }

        if (
          event.data.type &&
          event.data.type === CHANGE_IS_TURN_ON_WEB3_GUARD
        ) {
          isTurnOnWeb3Guard = event.data.isTurnOnWeb3Guard;
        }
      };

      window.addEventListener("message", messageListener, false);
  };

  window.postMessage = customRequest;
}
