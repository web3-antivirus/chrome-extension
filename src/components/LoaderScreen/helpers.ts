export const getStatuses = (
  callback: (status: string) => void,
  statuses: Array<string>,
  statusDurationSeconds: Record<string, { from: number, to: number}>,
): void => {

  const statusPromise = async (value: string) => new Promise((resolve) => {
    const { from, to }: { from: number; to: number } = statusDurationSeconds[value];
    const timeout = (Math.random() * (to - from) + from) * 1000;

    setTimeout(() => {
      callback(value);
      resolve(null);
    }, timeout);
  });

  // eslint-disable-next-line no-void
  void statuses.reduce(
    // eslint-disable-next-line no-void
    (acc: Promise<unknown>, value: string) => acc.then(() => void statusPromise(value)),
    Promise.resolve().catch(() => null),
  );
};
