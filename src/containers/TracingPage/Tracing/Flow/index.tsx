import {
  FC, useCallback, useMemo, useState,
} from 'react';
import ReactFlow, {
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
// this is important! You need to import the styles from the lib to make it work
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import cn from 'classnames';
import { TransformedTreeType } from '../../../../types/tracing.type';
import TracingBlock from './TracingBlock';
import TracingTransferBlock from './TracingTransferBlock';
import ZoomControl from './ZoomControl';
import PositionControl from './PositionControl';

import styles from './styles.module.scss';
import { MAX_ZOOM, MIN_ZOOM } from '../../../../constants/tracing.constants';

const nodeTypes = {
  defaultTracingBlock: TracingBlock,
  transferTracingBlock: TracingTransferBlock,
};

const dagreGraph = new dagre.graphlib.Graph({ compound: false });
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 220;
const minNodeHeight = 140;

type Props = {
  transformedTree: TransformedTreeType[]
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const { events } = node.data;
    dagreGraph.setNode(node.id, { width: nodeWidth, height: minNodeHeight + (events.length ? events.length * 30 - 10 : 0) });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y,
    };
  });

  return { nodes, edges };
};

const Flow: FC<Props> = ({ transformedTree }) => {

  const [isModalOpen, setModalOpen] = useState(false);

  const initialEdges: Edge[] = useMemo(() => {
    const edgeArray: Edge[] = [];
    transformedTree.forEach(
      ({ name, fatherName }) => {
        if (!fatherName) return;
        edgeArray.push({
          id: `${fatherName}-${name}`, source: fatherName, target: name, type: 'smoothstep', className: styles.edge,
        });
      },
    );
    return edgeArray;
  }, [transformedTree]);

  const initialNodes: Node[] = useMemo(() => {
    const newArray: Node[] = [];
    transformedTree.forEach(
      ({
        name, withoutChildren, data, isRoot, fatherName,
      }) => newArray.push(
        {
          id: name,
          type: data.nameHex ? 'defaultTracingBlock' : 'transferTracingBlock',
          data: {
            ...data, withoutChildren, isRoot, setModalOpen, fatherName,
          },
          position: { x: 0, y: 0 },
          dragging: false,
          draggable: false,
          connectable: false,
          className: styles.node,
        },
      ),
    );
    return newArray;
  }, [transformedTree]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => getLayoutedElements(
    initialNodes,
    initialEdges,
  ), [initialNodes, initialEdges]);

  const [nodes,, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params }, eds)),
    [],
  );

  return (
    <div className={cn(styles.flow, { [styles.isModalOpen]: isModalOpen })}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        zoomOnDoubleClick={false}
        elementsSelectable={false}
        nodeTypes={nodeTypes}
        panOnScroll
        fitView
        fitViewOptions={{ minZoom: 1, maxZoom: 1 }}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
      >
        <div className={styles.fixedContainersTop}>
          <PositionControl />
        </div>
        <div className={styles.fixedContainersBottom}>
          <ZoomControl />
        </div>
      </ReactFlow>
    </div>
  );
};

export default Flow;
