type TReturnCodeExecutionEnvironment = {
  isPopUp: boolean,
  isInject: boolean,
}

export const getCodeExecutionEnvironment = (): TReturnCodeExecutionEnvironment => {
  const isPopUp = !!chrome.action;
  const isInject = !isPopUp;

  return { isPopUp, isInject };
};
