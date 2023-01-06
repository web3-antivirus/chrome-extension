/**
 * Implements `defer` pattern based on native `Promise`.
 */
export class Defer<TResultData = any> {
  private nativePromise: Promise<TResultData>;
  /**
   * Resolves defer with some result.
   *
   * @param  {TResultData} [value]
   * @return {void}
   */
  public resolve: (value?: TResultData) => void;
  /**
   * Rejects defer with some error.
   *
   * @param  {unknown} [error]
   * @return {void}
   */
  public reject: (error?: unknown) => void;

  /**
   * Creates a new instance of defer.
   *
   * @static
   * @return {Defer}
   */
  static create(): Defer {
    const inst = new Defer();
    return inst;
  }

  constructor() {
    this.nativePromise = new Promise((resolve, reject) => {
      // @ts-ignore
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  /**
   * Waits for deffer.
   *
   * @return {Promise<TResultData>}
   */
  async wait(): Promise<TResultData> {
    const result = await this.nativePromise;
    return result;
  }
}
