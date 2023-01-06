import _ from 'lodash';

import { SharedHelper } from './libs/utils/shared.helper';

import { PostorderIterator, PreorderIterator } from './interators/';

export class TreeNode<TNData = any> {

  id: string | undefined;

  #level = 0;

  get level(): number {
    return this.#level;
  }

  set level(value: number) {
    this.#level = value;
  }

  private _parent: TreeNode<TNData>;

  get parent(): TreeNode<TNData> {
    return this._parent;
  }

  set parent(parentNode: TreeNode<TNData>) {
    this._parent = parentNode;
  }

  private _children: TreeNode<TNData>[];

  get children(): TreeNode<TNData>[] {
    return [...this._children];
  }

  private _value: TNData;

  get value(): TNData {
    return this._value;
  }

  set value(newValue: TNData) {
    this._value = newValue;
  }

  constructor(value: TNData, id?: string) {
    this.id = _.isNil(id) === true ? SharedHelper.generateUUID(true) : id;

    this._value = value;
    this._children = [];
  }

  /**
   * Returns the Preorder iterator for the current node.
   *
   * @return {PreorderIterator<TNData>}
   */
  get preorderIterator(): PreorderIterator<TNData> {
    const iterator = new PreorderIterator<TNData>(this);
    return iterator;
  }

  /**
   * Returns the Postorder iterator for the current node.
   *
   * @return {PostorderIterator<TNData>}
   */
  get postorderIterator(): PostorderIterator<TNData> {
    const iterator = new PostorderIterator<TNData>(this);
    return iterator;
  }

  /**
   * Returns true if list of node's children isn't empty and false otherwise.
   *
   * @return {boolean}
   */
  hasChildren(): boolean {
    return !_.isEmpty(this._children);
  }

  /**
   * Returns true if list of node's children has child and false otherwise.
   *
   * @return {boolean}
   */
  hasChild(childForSearch: TreeNode<TNData>, idFieldName?: string | symbol): boolean {
    this.checkSearchParams(childForSearch, idFieldName);

    const childForFindingValue: any = childForSearch.value;
    const oldChild = _.isNil(idFieldName) === true
      ? _.find(this._children, (child) => child === childForSearch)
      : _.find(this._children, (child) => {
        const childData: any = child.value;
        // @ts-ignore
          return childData[idFieldName] === childForFindingValue[idFieldName];
      });

    return !_.isNil(oldChild);
  }

  /**
   * Add node to the list of node's children.
   *
   * @param  {TreeNode<TNData>} newChild
   * @param  {string|Symbol} [idFieldName] - name of field with id
   * @returns void
   */
  addChild(newChild: TreeNode<TNData>, idFieldName?: string | symbol): void {
    if (this.hasChild(newChild, idFieldName)) {
      return;
    }

    this._children.push(newChild);
    newChild.parent = this;
    newChild.level = this.level + 1;
  }

  /**
   * Remove node from the list of node's children.
   *
   * @param  {TreeNode<TNData>} childForRemoving
   * @param  {string|Symbol} [idFieldName] - name of field with id
   * @returns void
   */
  removeChild(childForRemoving: TreeNode<TNData>, idFieldName?: string | symbol): void {
    this.checkSearchParams(childForRemoving, idFieldName);

    if (_.isNil(idFieldName)) {
      _.remove(this._children, (child) => child === childForRemoving);
      return;
    }

    const childForRemovingValue: any = childForRemoving.value;
    _.remove(this._children, (child) => {
      const childData: any = child.value;
      return childData[idFieldName] === childForRemovingValue[idFieldName];
    });
  }

  /**
   * Sets the list of node of children.
   *
   * @param  {TreeNode[]} children
   * @returns void
   */
  setChildren(children: TreeNode<TNData>[]): void {
    this._children = [...children];
  }

  /**
   * Throws an error if search params are invalid.
   *
   * @param  {TreeNode<TNData>} child
   * @param  {string|Symbol} [idFieldName] - name of field with id
   * @return {void}
   */
  private checkSearchParams(child: TreeNode<TNData>, idFieldName?: string | symbol): void {
    if (!_.isNil(idFieldName)) {
      if (!_.isString(idFieldName) && !_.isSymbol(idFieldName)) {
        throw new Error('Id feild name must be a string or a symbol');
      }

      if (_.isString(idFieldName) && idFieldName === '') {
        throw new Error('String id feild name must be a non-empty string');
      }
    }

    const childValue: any = child.value;
    if (!_.isNil(idFieldName) && !_.isObject(childValue)) {
      throw new Error('Tree Node Data must be an object type');
    }
  }

}
