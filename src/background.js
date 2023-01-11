import { CHANGE_URL, URL_STATUSES } from "./constants/background.constants.ts";
import {
  URL_ANALYZE_API,
  EXTENSION_INITIALIZE_PATH,
  API_PROD_PATH,
  URL_WHITE_LIST,
} from "./constants/check-nft.constants.ts";
import {
  STORAGE_IS_PAUSED,
  STORAGE_INSTALL_CHECKED,
  STORAGE_WHITELIST_FOR_WEB3_GUARD,
  STORAGE_USER_ID,
  STORAGE_TOKEN,
  CHECKED_URLS,
  SESSION_WHITELIST,
} from "./constants/chrome-storage.constants.ts";
import { LANDING_URL } from "./constants/url.constants.ts";
import {
  ERROR_NOTIFICATION,
  ERROR_POPUP,
} from "./constants/background.constants.ts";
import { NOTIFICATION_ERROR_TYPES } from "./constants/error.constants.ts";
import {
  OPEN_TRACING_DIAGRAM_PAGE,
  REQUEST_OPEN_TRACING_DIAGRAM_PAGE,
  CHANGE_ICON_OFF,
  CHANGE_ICON_ON,
} from "./constants/chrome-send-message.constants.ts";
import { getRandomToken } from "./helpers/token.helpers.ts";

import * as Sentry from "@sentry/browser";

const isDevelopment = process.env.NODE_ENV === "development";
Sentry.init({
  dsn: isDevelopment ? "https://1480486cfec4426f9cc5a2100c3f148f@sentry.apikey.io/100" : "",
});

const TURN_ON_ICONS = {
  path: {
    16: "/icon16.png",
    32: "/icon32.png",
    48: "/icon48.png",
    128: "/icon128.png",
  },
};

const TURN_OFF_ICONS = {
  path: {
    16: "/icon16red.png",
    32: "/icon32red.png",
    48: "/icon48red.png",
    128: "/icon128red.png",
  },
};

const DEFAULT_PAUSE_VALUE = {
  isPaused: false,
  pauseUntilTime: null,
};

const getStorageValue = (key, onChange, defaultValue) => {
  if (chrome.storage) {
    chrome.storage.local.get(key, (result) => {
      const value = result[key] || defaultValue;
      onChange(value);
    });
  } else {
    onChange(null);
  }
};

const setStorageValue = (key, value) => {
  if (chrome.storage) {
    chrome.storage.local
      .set({ [key]: value })
      .then()
      .catch((e) => console.log(e));
  }
};

const getSyncStorageValue = (key, onChange, defaultValue) => {
  if (chrome.storage) {
    chrome.storage.sync.get(key, (result) => {
      const value = result[key] || defaultValue;
      onChange(value);
    });
  } else {
    onChange(null);
  }
};

const setSyncStorageValue = (key, value) => {
  if (chrome.storage) {
    chrome.storage.sync
      .set({ [key]: value })
      .then()
      .catch((e) => console.log(e));
  }
};

const getCookieValue = (url, name) => chrome.cookies.get({ url, name });

const getSiteName = (url) => {
  const domain = url && new URL(url);
  return domain ? domain.origin : "";
};

const registerScripts = async () => {
  await chrome.scripting.unregisterContentScripts();
  await chrome.scripting.registerContentScripts([
    {
      id: "w3a script",
      matches: ["http://*/*", "https://*/*"],
      js: ["/script/main.js"],
      allFrames: true,
      runAt: "document_start",
      world: "MAIN",
    },
  ]);
};

// check initial icon on browser load
const updateIcon = () => {
  getStorageValue(STORAGE_IS_PAUSED, async (value) => {
    if (value && value.isPaused) {
      if (value.pauseUntilTime && new Date(value.pauseUntilTime) > new Date()) {
        chrome.action.setIcon(TURN_OFF_ICONS);
        chrome.alarms.create('pause', { when: new Date(value.pauseUntilTime).getTime() });
      } else {
        setStorageValue(STORAGE_IS_PAUSED, DEFAULT_PAUSE_VALUE);
      }
    }
  });
};

updateIcon();

// check metamask extension for malicious
const METAMASK_ORIGINAL_DATA = {
  id: "nkbihfbeogaeaoehlefnkodbefgpgknn",
  shortName: "MetaMask",
};

const handleSuspiciousMetamask = (extensionInfo, errorType) => {
  chrome.management.setEnabled(extensionInfo.id, false);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    const tabId = tab[0].id;
    chrome.tabs.sendMessage(
      tabId,
      {
        type: errorType,
        message: NOTIFICATION_ERROR_TYPES.MALICIOUS_METAMASK,
        tab: tab[0],
      },
      function () {
        // https://stackoverflow.com/a/69587523
        if (!chrome.runtime.lastError) {
          console.log("");
        } else {
          console.log("error in sendMessage");
        }
      }
    );
  });
};

const initWhitelist = async () => {
  const result = await fetch(`${API_PROD_PATH}${URL_WHITE_LIST}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  const list = await result.json();
  // check for empty, add protocol for urls
  setStorageValue(
    STORAGE_WHITELIST_FOR_WEB3_GUARD,
    (list || []).filter((url) => url).map((url) => `https://${url}`)
  );
};

const updateToken = async (userId, utm, ga4) => {
  const result = await fetch(`${API_PROD_PATH}${EXTENSION_INITIALIZE_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      utm: utm ? utm.value : undefined,
      cid: ga4 ? ga4.value.slice(6) : undefined,
      id: userId,
      dev: isDevelopment,
    }),
  });

  const { token } = await result.json();
  setStorageValue(STORAGE_TOKEN, token);
};

const updateUserToken = () => {
  getSyncStorageValue(STORAGE_USER_ID, async (userId) => {
    if (!userId) {
      userId = getRandomToken();
      setSyncStorageValue(STORAGE_USER_ID, userId);
    }

    try {
      await updateToken(userId);
    } catch (error) {
      Sentry.captureException(error);
    }
  });
};

const initExtension = () => {
  getSyncStorageValue(STORAGE_USER_ID, async (userId) => {
    if (!userId) {
      userId = getRandomToken();
      setSyncStorageValue(STORAGE_USER_ID, userId);
    }

    try {
      const [utm, ga4] = await Promise.all([
        getCookieValue(LANDING_URL, "utm"),
        getCookieValue(LANDING_URL, "_ga"),
        initWhitelist(),
      ]);

      await checkExtensionsMalicious();

      await updateToken(userId, utm, ga4);
    } catch (error) {
      console.log(error);
    }
  });
};

const handleUpdate = async () => {
  updateIcon();
  await registerScripts();
  getStorageValue(STORAGE_INSTALL_CHECKED, (isChecked) => {
    if (!isChecked) {
      initExtension();
      setStorageValue(STORAGE_INSTALL_CHECKED, true);
    } else {
      updateUserToken();
    }
  });
};

// Note: checking after w3a install
const checkExtensionsMalicious = async () => {
  const extensions = await chrome.management.getAll();
  const metamaskExt = extensions.find(
    (ext) => ext.shortName === METAMASK_ORIGINAL_DATA.shortName
  );

  if (metamaskExt && metamaskExt.id !== METAMASK_ORIGINAL_DATA.id) {
    handleSuspiciousMetamask(metamaskExt, ERROR_POPUP);
  }
};

chrome.management.onInstalled.addListener((extensionInfo) => {
  if (
    extensionInfo.reason === "install" &&
    extensionInfo.shortName === METAMASK_ORIGINAL_DATA.shortName &&
    extensionInfo.id !== METAMASK_ORIGINAL_DATA.id
  ) {
    handleSuspiciousMetamask(extensionInfo, ERROR_NOTIFICATION);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  getStorageValue(STORAGE_TOKEN, (token) => {
    if (token) {
      if (changeInfo.status === URL_STATUSES.complete) {
        chrome.tabs.sendMessage(
          tabId,
          { message: CHANGE_URL, tab },
          function () {
            // https://stackoverflow.com/a/69587523
            if (!chrome.runtime.lastError) {
              console.log("");
            } else {
              console.log("error in sendMessage");
            }
          }
        );
      }
    }
  });
});

const redirectToPhishing = (nearestURL, siteName) => {
  chrome.tabs.update({
    url:
      chrome.runtime.getURL("phishing.html") +
      "?" +
      (nearestURL ? "safeUrl=" + nearestURL : "") +
      "&originalUrl=" +
      encodeURIComponent(siteName),
  });
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  getStorageValue(STORAGE_TOKEN, (token) => {
    if (token) {
      if (tab && tab.url) {
        if (changeInfo.status === URL_STATUSES.loading && tab.active) {
          getStorageValue(STORAGE_IS_PAUSED, async (value) => {
            if (
              !value ||
              !value.isPaused ||
              !value.pauseUntilTime ||
              new Date(value.pauseUntilTime) < new Date()
            ) {
              getStorageValue(
                STORAGE_WHITELIST_FOR_WEB3_GUARD,
                async (value) => {
                  const siteName = getSiteName(tab.url);
                  const [checkedUrls, whiteListUrlsData] = await Promise.all([
                    chrome.storage.session.get(CHECKED_URLS)[CHECKED_URLS] ||
                      {},
                    chrome.storage.session.get(SESSION_WHITELIST),
                  ]);

                  if (checkedUrls[siteName] === "neutral") {
                    return;
                  }

                  const whiteListUrls =
                    whiteListUrlsData[SESSION_WHITELIST] || {};

                  if (siteName in whiteListUrls) {
                    if (!whiteListUrls[siteName]) {
                      delete whiteListUrls[siteName];
                      chrome.storage.session.set({
                        [SESSION_WHITELIST]: whiteListUrls,
                      });
                    }

                    return;
                  }

                  if (
                    (checkedUrls[siteName] === "suspicious" ||
                      checkedUrls[siteName] === "dangerous") &&
                    !value.includes(siteName)
                  ) {
                    redirectToPhishing("", siteName);
                  } else if (!value.includes(siteName)) {
                    const result = await fetch(
                      `${API_PROD_PATH}${URL_ANALYZE_API}?` +
                        new URLSearchParams({
                          url: siteName,
                        }),
                      {
                        headers: {
                          "Content-Type": "application/json;charset=utf-8",
                        },
                      }
                    );
                    const { status, payload } = await result.json();
                    chrome.storage.session.set({
                      [CHECKED_URLS]: { ...checkedUrls, [siteName]: status },
                    });
                    if (status === "suspicious" || status === "dangerous") {
                      redirectToPhishing((payload || {}).nearestURL, siteName);
                    }
                  }
                },
                []
              );
            }
          });
        }
      }
    }
  });
});

chrome.runtime.onInstalled.addListener(async () => {
  handleUpdate();
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: cs.js,
        },
        () => {
          chrome.runtime.lastError;
          chrome.scripting.insertCSS(
            {
              target: { tabId: tab.id },
              files: cs.css,
            },
            () => chrome.runtime.lastError
          );
        }
      );
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === CHANGE_ICON_ON) {
    chrome.action.setIcon(TURN_ON_ICONS);
  }

  if (request.message === CHANGE_ICON_OFF) {
    chrome.action.setIcon({
      path: {
        16: "/icon16red.png",
        32: "/icon32red.png",
        48: "/icon48red.png",
        128: "/icon128red.png",
      },
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === REQUEST_OPEN_TRACING_DIAGRAM_PAGE) {
    const sendMessage = {
      message: OPEN_TRACING_DIAGRAM_PAGE,
      trace: request.trace,
    };
    chrome.tabs.create(
      { url: chrome.runtime.getURL("tracing.html") },
      (tab) => {
        const handler = (tabId, changeInfo) => {
          if (tabId === tab.id && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(handler);
            chrome.tabs.sendMessage(
              tabId,
              sendMessage,
              () => chrome.runtime.lastError
            );
          }
        };
        // in case we're faster than page load (usually):
        chrome.tabs.onUpdated.addListener(handler);
        // just in case we're too late with the listener:
        chrome.tabs.sendMessage(
          tab.id,
          sendMessage,
          () => chrome.runtime.lastError
        );
      }
    );
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setIcon(TURN_ON_ICONS);
  setStorageValue(STORAGE_IS_PAUSED, DEFAULT_PAUSE_VALUE);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === CHANGE_ICON_ON) {
    chrome.action.setIcon(TURN_ON_ICONS);
    setStorageValue(STORAGE_IS_PAUSED, DEFAULT_PAUSE_VALUE);
    chrome.alarms.clear('pause');
  }

  if (request.message === CHANGE_ICON_OFF) {
    chrome.action.setIcon(TURN_OFF_ICONS);
    chrome.alarms.create('pause', { delayInMinutes: 30 });
  }
});
