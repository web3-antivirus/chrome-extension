import {
  FC, memo, ReactElement, useCallback, useMemo, useState,
} from 'react';
import smallArrowIcon from 'assets/images/tracing/extenstion/small-arrow.svg';
import linkIcon from 'assets/images/tracing/extenstion/link.svg';
import bigArrowIcon from 'assets/images/tracing/extenstion/big-arrow.svg';
import nextArrowFirstTypeIcon from 'assets/images/tracing/extenstion/next-arrow-first-type.svg';
import nextArrowSecondTypeIcon from 'assets/images/tracing/extenstion/next-arrow-second-type.svg';
import cn from 'classnames';
import { REQUEST_OPEN_TRACING_DIAGRAM_PAGE } from 'constants/chrome-send-message.constants';
import Warning from 'components/Warning';
import TracingBlock from './TracingBlock';
import TracingTransferBlock from './TracingTransferBlock';
import useDragScroll from '../../../../hooks/use-drag-scroll';
import styles from './styles.module.scss';
import { getImageUrl } from '../../../../helpers/image.helpers';
import { TraceWithRisk } from '../../../../types/fetch.type';
import { generateTreeFromTracingData } from '../../../../helpers/tracing.helpers';
import ButtonNew from '../../../../components/ButtonNew';
import { BUTTON_TYPES } from '../../../../constants/button.constants';

type Props = {
  trace: TraceWithRisk[];
  hasSimulationAlert: boolean;
};

const Tracing: FC<Props> = ({ trace, hasSimulationAlert }) => {
  const { scrolledContentRef, mouseDownHandler } = useDragScroll();
  const [maxDepth, setMaxDepth] = useState(0);
  const tree = useMemo(() => generateTreeFromTracingData(trace), [trace]);

  const firstIndexDepth = useMemo(() => tree.level, [tree]);

  const handleSetMaxDepth = useCallback((checkedDepth: number) => {
    setMaxDepth(((currentDepth) => (currentDepth < checkedDepth ? checkedDepth : currentDepth)));
  }, []);

  const transformedTree = useMemo(() => {
    const endNode: { [key: string]: ReactElement[] } = {};

    const generateNode = (enterChildren: typeof tree[]) => {

      enterChildren.forEach((nodeItem) => {
        const { method, events } = nodeItem.value;

        const currentDepth = nodeItem.level;
        const withChildren = nodeItem.hasChildren();
        handleSetMaxDepth(currentDepth);

        endNode[`depth-${currentDepth}`] = endNode[`depth-${currentDepth}`]
          ? endNode[`depth-${currentDepth}`] : [];

        if (withChildren) {
          const node = generateNode(nodeItem.children);
          Object.assign(endNode, node);
        }

        if (!method.nameHex) {
          endNode[`depth-${currentDepth}`] = endNode[`depth-${currentDepth}`]
            ? endNode[`depth-${currentDepth}`] : [];

          endNode[`depth-${currentDepth}`].unshift(
            <TracingTransferBlock risk={nodeItem.value.risk} {...method} />,
          );
          return;
        }
        endNode[`depth-${currentDepth}`].unshift(
          <TracingBlock {...method} risk={nodeItem.value.risk} events={events} />,
        );
      });
      return endNode;
    };

    endNode[`depth-${firstIndexDepth}`] = endNode[`depth-${firstIndexDepth}`]
      ? endNode[`depth-${firstIndexDepth}`] : [];

    endNode[`depth-${firstIndexDepth}`].unshift(
      <TracingBlock {...tree.value.method} risk={tree.value.risk} events={tree.value.events} />,
    );

    return generateNode(tree.children);
  }, [tree]);

  const lastDepthItems = useMemo(() => transformedTree[`depth-${maxDepth}`], [maxDepth]);

  const numberMethods = useMemo(() => {
    let count = 0;
    Object.keys(transformedTree).forEach((treeObjectKey) => {
      if (treeObjectKey !== `depth-${firstIndexDepth}` && treeObjectKey !== `depth-${maxDepth}`) {
        count += transformedTree[treeObjectKey].length;
      }
    });

    return count;
  }, [transformedTree, maxDepth, firstIndexDepth]);

  const handleButtonLinkClick = () => {
    chrome.runtime.sendMessage({ message: REQUEST_OPEN_TRACING_DIAGRAM_PAGE, trace });
  };

  return (
    <>
      {hasSimulationAlert && (
        <Warning
          className={styles.warning}
          isDanger
          message="We found risks in the linked smart contracts during the simulation."
        />
      )}
      <div
        className={styles.tracingContent}
        onMouseDown={mouseDownHandler}
        ref={scrolledContentRef}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className={styles.rootBlock}>
            {transformedTree[`depth-${firstIndexDepth}`][0]}
            <img className={styles.arrowIcon} src={getImageUrl(smallArrowIcon)} alt="small arrow icon" />
          </div>
        </div>
        <div className={cn(styles.hideMethods, { [styles.withMoreLastItems]: lastDepthItems.length > 1 })}>
          <p className={styles.bold}>{numberMethods} more methods...</p>
          <ButtonNew
            styleType={BUTTON_TYPES.POSITIVE}
            buttonClassName={styles.link}
            onClick={handleButtonLinkClick}
          >
            <span className={styles.buttonInner}>View full diagram <img src={getImageUrl(linkIcon)} alt="link icon" /></span>
          </ButtonNew>
          {Boolean(maxDepth) && (lastDepthItems.length > 1 ? <img src={getImageUrl(bigArrowIcon)} alt="big arrow icon" />
            : <img src={getImageUrl(smallArrowIcon)} alt="small arrow icon" />)}
        </div>
        {Boolean(maxDepth) && (
          <div className={styles.lastDepth}>
            {lastDepthItems?.map((treeElement, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className={styles.lastDepthItem} key={`${maxDepth}-${index}`}>
                {lastDepthItems.length > 1 && index !== lastDepthItems.length - 1 && (
                  <img
                    src={index === 0 ? getImageUrl(nextArrowFirstTypeIcon) : getImageUrl(nextArrowSecondTypeIcon)}
                    className={cn({ [styles.oneArrow]: lastDepthItems.length > 2 }, { [styles.secondArrowType]: index !== 0 })}
                    alt="next arrow icon"
                  />
                )}
                <div>
                  {treeElement}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(Tracing);
