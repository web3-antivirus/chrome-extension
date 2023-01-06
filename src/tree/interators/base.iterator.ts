import { TreeNode } from '../tree-node';

export class BaseIterator<TND> {
  protected nodeStack: TreeNode<TND>[];

  protected isStopedFlag: boolean;

  protected _value: TreeNode<TND>;
  public get value(): TreeNode<TND> {
    return this._value;
  }

  constructor(protected root: TreeNode<TND>) {
    this.start();
  }

  [Symbol.iterator](): Iterator<TreeNode<TND>> {
    return this;
  }

  /**
   * Starts iteration cycle.
   *
   * @return {void}
   */
  start(): void {
    this.nodeStack = [this.root];
    this.isStopedFlag = false;
  }

  /**
   * Switches to next item.
   *
   * @return {IteratorResult<TreeNode<TND>, TreeNode<TND>>}
   */
  next(): IteratorResult<TreeNode<TND>, TreeNode<TND>> {
    // @ts-ignore
    return null;
  }
}
