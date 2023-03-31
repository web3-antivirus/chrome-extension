import browser from 'webextension-polyfill';

type TReturnCodeExecutionEnvironment = {
  isPopUp: boolean,
  isInject: boolean,
}

export const getCodeExecutionEnvironment = (): TReturnCodeExecutionEnvironment => {
  const isPopUp = !!browser.action;
  const isInject = !isPopUp;

  return { isPopUp, isInject };
};
