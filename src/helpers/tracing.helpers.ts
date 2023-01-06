import { TreeNode } from '../tree/tree-node';
import { ABIItem, TraceWithRisk } from '../types/fetch.type';

export const generateTreeFromTracingData = (trace: TraceWithRisk[]) => {
  const getParent = (childrens: TreeNode[], checkedNode: TreeNode): boolean => {
    const parentId = checkedNode.value.parent;
    const newParent = childrens.find((childrenItem) => childrenItem.id === parentId);

    if (newParent) {
      newParent.addChild(checkedNode);
      return true;
    }

    return !!childrens.find((childrenNode) => getParent(childrenNode.children, checkedNode));
  };

  const rootLevel = new TreeNode<TraceWithRisk>(trace[0], trace[0].id);

  trace.forEach((traceItem) => {
    const newNode = new TreeNode(traceItem, traceItem.id);
    const parentId = newNode.value.parent;
    if (!parentId) return;

    if (rootLevel.id === parentId) {
      rootLevel.addChild(newNode);
      return;
    }

    const childrens = rootLevel.children;
    getParent(childrens, newNode);

  });
  return rootLevel;
};

export const getCountParams = (params: ABIItem | ABIItem[]): number => {
  let count = 0;
  const paramsIsArray = Array.isArray(params);

  if (paramsIsArray) {
    params.forEach((item) => {
      count += getCountParams(item);
    });
    return count;
  }

  const paramsValue = params.value;
  const paramsValueIsArray = Array.isArray(paramsValue);

  if (typeof paramsValue === 'undefined' || paramsValue === null) return 0;

  if (typeof paramsValue === 'boolean' || typeof paramsValue === 'string') {
    return 1;
  }

  if (paramsValueIsArray) {
    if (!paramsValue.length) {
      count += 1;
    } else {
      paramsValue.forEach((item) => {
        count += getCountParams(item);
      });
    }
  } else {
    count += getCountParams(paramsValue);
  }

  return count;
};

export const transformNameMethod = (inputName: string | undefined) => {
  const splitName = inputName?.split('(') ?? [];
  return splitName[0];
};
