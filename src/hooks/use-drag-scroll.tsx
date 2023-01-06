import {
  MouseEvent as MouseEventReact, useRef,
} from 'react';

const useDragScroll = () => {
  const scrolledContentRef = useRef<HTMLDivElement>(null);

  const positionRef = useRef({
    top: 0, left: 0, x: 0, y: 0,
  });

  const mouseMoveHandler = (event: MouseEvent) => {
    // How far the mouse has been moved
    if (!scrolledContentRef.current) return;
    const dx = event.clientX - positionRef.current.x;
    const dy = event.clientY - positionRef.current.y;

    // Scroll the element
    scrolledContentRef.current.scrollTop = positionRef.current.top - dy;
    scrolledContentRef.current.scrollLeft = positionRef.current.left - dx;
  };

  const mouseUpHandler = () => {
    if (!scrolledContentRef.current) return;

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    scrolledContentRef.current.style.cursor = 'default';
    scrolledContentRef.current.style.removeProperty('user-select');
  };

  const mouseDownHandler = (event: MouseEventReact<HTMLDivElement>) => {
    if (!scrolledContentRef.current) return;

    scrolledContentRef.current.style.cursor = 'grabbing';
    scrolledContentRef.current.style.userSelect = 'none';

    positionRef.current = {
      // The current scroll
      left: scrolledContentRef.current.scrollLeft,
      top: scrolledContentRef.current.scrollTop,
      // Get the current mouse position
      x: event.clientX,
      y: event.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return { scrolledContentRef, mouseDownHandler };
};

export default useDragScroll;
