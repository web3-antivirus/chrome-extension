import _ from 'lodash';

import { TreeNode } from '../tree-node';
import { BaseIterator } from './base.iterator';

export class PreorderIterator<TND> extends BaseIterator<TND> {
  /**
   * Switches to next item.
   *
   * @return {IteratorResult<TreeNode<TND>, TreeNode<TND>>}
   */
  next(): IteratorResult<TreeNode<TND>, TreeNode<TND>> {
    if (_.isEmpty(this.nodeStack)) {
      this.isStopedFlag = true;
      return {
        done: this.isStopedFlag,
        value: this._value,
      };
    }

    const node = this.nodeStack.pop();
    if (_.isEmpty(node)) {
      return {
        done: this.isStopedFlag,
        value: this._value,
      }
    }

    this._value = node;

    for (let i = node.children.length - 1; i >= 0; i--) {
      this.nodeStack.push(node.children[i]);
    }

    return {
      done: this.isStopedFlag,
      value: this._value,
    };
  }
}
