import {
  FC, memo, useMemo,
} from 'react';
import { ReactFlowProvider } from '@reactflow/core';
import Flow from './Flow';
import { generateTreeFromTracingData } from '../../../helpers/tracing.helpers';
import { TransformedTreeType } from '../../../types/tracing.type';
import styles from './styles.module.scss';
import { TraceWithRisk } from '../../../types/fetch.type';
import { TreeNode } from '../../../tree/tree-node';

type Props = {
  trace: TraceWithRisk[]
};

const Tracing: FC<Props> = ({ trace }) => {
  const tree = useMemo(() => generateTreeFromTracingData(trace), [trace]);

  const transformedTree = useMemo(() => {
    let endNode: TransformedTreeType[] = [];

    const generateNode = (sourceNode: TreeNode<TraceWithRisk>[]) => {

      sourceNode.forEach((nodeItem) => {
        const {
          children, parent, value,
        } = nodeItem;
        const isChildren = nodeItem.hasChildren();

        if (isChildren) {
          const childrenNode = generateNode(children);
          endNode = [...new Set([...endNode, ...childrenNode])];
        }

        endNode.push({
          data: { ...value.method, events: value.events, risk: value.risk },
          name: nodeItem.id ?? '',
          fatherName: parent.id,
          isRoot: false,
          withoutChildren: !isChildren,
        });
      });

      return endNode;
    };
    endNode.push({
      data: { ...tree.value.method, events: tree.value.events, risk: tree.value.risk },
      name: tree.id ?? '',
      fatherName: undefined,
      isRoot: true,
      withoutChildren: !tree.hasChildren(),
    });

    return generateNode(tree.children);
  }, [tree]);

  return (
    <div className={styles.wrapper}>
      <ReactFlowProvider>
        <Flow transformedTree={transformedTree} />
      </ReactFlowProvider>
    </div>
  );
};

export default memo(Tracing);
