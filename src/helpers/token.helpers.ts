export const getRandomToken = () => {
  const randomPool = new Uint8Array(32);
  crypto.getRandomValues(randomPool);
  let hex = '';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < randomPool.length; ++i) {
    hex += randomPool[i].toString(16);
  }

  return hex;
};
