import { FC, memo } from 'react';
import {
  useReactFlow, useStoreApi, Node,
} from 'reactflow';
import arrowUpIcon from 'assets/images/icons/arrow-up.svg';
import arrowDownIcon from 'assets/images/icons/arrow-down.svg';
import Button from '../../../../../components/ButtonNew';
import { CallMethodDescriptor } from '../../../../../types/fetch.type';
import { BUTTON_TYPES } from '../../../../../constants/button.constants';
import { getImageUrl } from '../../../../../helpers/image.helpers';
import styles from './styles.module.scss';

type Props = {
};

const PositionControl: FC<Props> = () => {
  const store = useStoreApi();
  const { setCenter, getZoom } = useReactFlow();

  const scrollTo = (nodeItem: Node<CallMethodDescriptor>) => {

    const x = nodeItem.position.x + (nodeItem?.width ?? 0) / 2;
    const y = nodeItem.position.y + (nodeItem?.height ?? 0) / 2;
    const zoom = getZoom();

    setCenter(x, y, { zoom });

  };

  const handleScrollTopClick = () => {
    const { nodeInternals } = store.getState();
    const nodes: Node<CallMethodDescriptor>[] = Array.from(nodeInternals).map(([, node]) => node);
    if (!nodes.length) return;
    const firstNodeItem = nodes.reduce(
      (previousValue, currentValue) => (
        previousValue.position.y < currentValue.position.y ? previousValue : currentValue),
    );
    scrollTo(firstNodeItem);
  };

  const handleScrollBottomClick = () => {
    const { nodeInternals } = store.getState();
    const nodes: Node<CallMethodDescriptor>[] = Array.from(nodeInternals).map(([, node]) => node);
    if (!nodes.length) return;

    const latestItem = nodes.reduce(
      (previousValue, currentValue) => (
        previousValue.position.y > currentValue.position.y ? previousValue : currentValue),
    );
    scrollTo(latestItem);
  };

  return (

    <div className={styles.buttons}>
      <Button styleType={BUTTON_TYPES.PRIMARY} className={styles.buttonWrapper} onClick={handleScrollTopClick}>
        <span className={styles.btnInner}>
          To begin<img src={getImageUrl(arrowUpIcon)} alt="arr-up" className={styles.icon} />
        </span>
      </Button>
      <Button styleType={BUTTON_TYPES.PRIMARY} className={styles.buttonWrapper} onClick={handleScrollBottomClick}>
        <span className={styles.btnInner}>
          To end<img src={getImageUrl(arrowDownIcon)} alt="arr-down" className={styles.icon} />
        </span>
      </Button>
    </div>
  );
};

export default memo(PositionControl);
