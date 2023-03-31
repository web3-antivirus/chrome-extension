import { INTERCEPT_METHODS } from "../constants/metamask.constants.ts";
import {
  MESSAGE_BY_METAMASK_METHOD,
  W3A_DECISION_EVENT,
  METAMASK_SEND_TRANSACTION,
} from "../constants/chrome-send-message.constants.ts";
import { ETH_CHAIN } from "./constants.ts";
import { getWalletProvider } from "./helpers.ts";

let resolver;
let timer;

const dispatchTransactionEvent = async (transactionEvent) =>
  new Promise((resolve) => {
    resolver = resolve;
    window.postMessage(transactionEvent, "*");
  });

document.addEventListener(W3A_DECISION_EVENT, (event) => {
  resolver(event.detail);
});

const addW3AProxy = (provider) => {
  const sendHandler = {
    apply: async (target, thisArg, args) => {
      const [request, callback] = args;
      if (!request) {
        return Reflect.apply(target, thisArg, args);
      }

      if (INTERCEPT_METHODS.has(request.method)) {
        const { method, params } = request;
        const providerInfo = {
          chainId: await provider.request({ method: "eth_chainId" }),
        };

        if (providerInfo.chainId === ETH_CHAIN) {
          const w3aEvent = MESSAGE_BY_METAMASK_METHOD[method];

           const walletProvider = getWalletProvider(provider);

          const decision = await dispatchTransactionEvent({
            type: w3aEvent,
            jsonData: JSON.stringify({ method, params }),
            walletProvider,
          });

          if (decision !== METAMASK_SEND_TRANSACTION) {
            return Promise.reject({
              message: "User rejected transaction from Web3Antivirus.",
              code: 4001,
            });
          }
        }
      }

      return Reflect.apply(target, thisArg, args);
    },
  };

  if (provider && !provider?.isWeb3Antivirus) {
    try {
      Object.defineProperty(provider, "request", {
        value: new Proxy(provider.request, sendHandler),
      });
      if (provider.send) {
        Object.defineProperty(provider, "send", {
          value: new Proxy(provider.send, sendHandler),
        });
      }
      if (provider.sendAsync) {
        Object.defineProperty(provider, "sendAsync", {
          value: new Proxy(provider.sendAsync, sendHandler),
        });
      }
      provider.isWeb3Antivirus = true;
    } catch (error) {
      console.warn("Failed to attach web3 antivirus to provider", error);
    }
  }
};

const addProxy = () => {
  if (window.ethereum && !window.ethereum?.isWeb3Antivirus) {
    addW3AProxy(window.ethereum);

    if (window.ethereum.providers?.length) {
      window.ethereum.providers.forEach(addW3AProxy);
    }
  }
};

if (window.ethereum) {
  addProxy();
} else {
  window.addEventListener("ethereum#initialized", addProxy);
}

timer = setInterval(addProxy, 100);

setTimeout(() => {
  window.removeEventListener("ethereum#initialized", addProxy);
  clearTimeout(timer);
}, 5000);
