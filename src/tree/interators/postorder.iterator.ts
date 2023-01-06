import _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class PostorderIterator<TND> extends BaseIterator<TND> {
  private output: TreeNode<TND>[];

  /**
   * Starts iteration cycle.
   *
   * @return {void}
   */
  start(): void {
    this.output = [];
    super.start();
  }

  /**
   * Switches to next item.
   *
   * @return {IteratorResult<TreeNode<TND>, TreeNode<TND>>}
   */
  next(): IteratorResult<TreeNode<TND>, TreeNode<TND>> {
    if (_.isEmpty(this.nodeStack) && _.isEmpty(this.output)) {
      this.isStopedFlag = true;
      return {
        done: this.isStopedFlag,
        value: this._value,
      };
    }

    while (!_.isEmpty(this.nodeStack)) {
      const node = this.nodeStack.pop();

      if (_.isEmpty(node)) {
        return {
          done: this.isStopedFlag,
          value: this._value,
        };
      }

      if (_.isEmpty(node.children)) {
        this._value = node;
        return {
          done: this.isStopedFlag,
          value: this._value,
        };
      }

      this.output.push(node);

      for (let i = node.children.length - 1; i >= 0; i--) {
        this.nodeStack.push(node.children[i]);
      }
    }

    // @ts-ignore
    this._value = this.output.pop();
    return {
      done: this.isStopedFlag,
      value: this._value,
    };
  }
}
