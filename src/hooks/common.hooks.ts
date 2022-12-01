/* eslint-disable consistent-return */
import { STORAGE_TOKEN } from 'constants/chrome-storage.constants';
import { getValueToChromeStorage, subscribeChangesChromeStorage } from 'helpers/chrome-storage.helpers';
import {
  RefObject, useCallback, useEffect, useRef, useState,
} from 'react';

export const useExtensionScroll = (className: string): void => {

  useEffect(() => {
    const [container] = document.getElementsByClassName(className);

    container?.addEventListener('wheel' as keyof ElementEventMap, (evt) => {
      evt.preventDefault();
      container.scrollTop += (evt as WheelEvent).deltaY;
    });
  }, [className]);
};

export const useUserToken = (): string => {
  const [token, setToken] = useState('');

  subscribeChangesChromeStorage(STORAGE_TOKEN, (value: string) => {
    setToken(value);
  });

  useEffect(() => {
    getValueToChromeStorage(STORAGE_TOKEN, (value) => setToken(value as string));
  }, []);

  return token;
};

interface UseEventListener {
  type: keyof WindowEventMap;
  listener: EventListener;
  element?: RefObject<Element> | Document | Window | null;
  options?: AddEventListenerOptions;
}

export const getRefElement = <T>(
  element?: RefObject<Element> | T,
): Element | T | undefined | null => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (element && 'current' in element) {
    return element.current;
  }

  return element;
};

export const useEventListener = ({
  type,
  listener,
  element = window,
  options,
}: UseEventListener): void => {
  const savedListener = useRef<EventListener>();

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  const handleEventListener = useCallback((event: Event) => {
    savedListener.current?.(event);
  }, []);

  useEffect(() => {
    const target = getRefElement(element);
    target?.addEventListener(type, handleEventListener, options);
    return () => target?.removeEventListener(type, handleEventListener);
  }, [type, element, options, handleEventListener]);
};
