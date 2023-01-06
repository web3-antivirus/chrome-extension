import {
  FC, memo, useEffect, useState,
} from 'react';
import { ReactComponent as PlusIcon } from 'assets/images/icons/plus.svg';
import { ReactComponent as MinusIcon } from 'assets/images/icons/minus.svg';
import questionIcon from 'assets/images/icons/question.svg';
import cn from 'classnames';
import { useReactFlow, useStoreApi } from 'reactflow';
import PromptBlock from './PromptBlock';
import styles from './styles.module.scss';
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '../../../../../constants/tracing.constants';

type Props = {
};

const ZoomControl: FC<Props> = () => {

  const [isPrompt, setPrompt] = useState(false);
  const [zoom, setZoom] = useState(1);

  const { getZoom, zoomTo } = useReactFlow();
  const store = useStoreApi();

  useEffect(() => {
    const reactState = store.getState();
    if (!reactState) return undefined;
    setZoom(reactState.transform[2]);

    return store.subscribe(
      (state) => setZoom(state.transform[2]),
    );
  }, []);

  const handleZoomClick = (typeZoom: 'zoomOut' | 'zoomIn') => {
    let zoomValue = getZoom();
    if (typeZoom === 'zoomOut' && zoomValue > MIN_ZOOM) {
      zoomValue -= ZOOM_STEP;
    }
    if (typeZoom === 'zoomIn' && zoomValue < MAX_ZOOM) {
      zoomValue += ZOOM_STEP;
    }
    zoomTo(Math.round(zoomValue * 100) / 100);
  };

  const handlePromptStatus = () => {
    setPrompt(!isPrompt);
  };

  return (

    <div className={styles.zoomContainer}>
      {isPrompt && (
        <div className={styles.prompt}>
          <PromptBlock handleClose={handlePromptStatus} />
        </div>
      )}
      <button className={cn(styles.questionButton, { [styles.isOpenPrompt]: isPrompt })} onClick={handlePromptStatus}>
        <img src={questionIcon} alt="question" className={styles.questionIcon} />
      </button>
      <button className={styles.button} onClick={() => handleZoomClick('zoomIn')}>
        <PlusIcon />
      </button>
      <p className={styles.zoomValue}>{Math.round(zoom * 100)}%</p>
      <button className={styles.button} onClick={() => handleZoomClick('zoomOut')}>
        <MinusIcon />
      </button>
    </div>
  );
};

export default memo(ZoomControl);
