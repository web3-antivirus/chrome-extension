type TCallbackDataMessageListener = {
  type: string
  jsonData: string
}

type TCallbackMessageListener = (data: TCallbackDataMessageListener) => void

export const messageListener = (eventDataType: string, onCallback: TCallbackMessageListener): void => {
  window.addEventListener('message', (event) => {
    if (event.source !== window) {
      return;
    }

    if (event.data.type && (event.data.type === eventDataType)) {
      onCallback(event.data);
    }
  }, false);
};
