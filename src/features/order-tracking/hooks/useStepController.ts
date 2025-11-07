import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWebSocket } from "../../../hooks/useWebSocket";

import type { LoadingSections, Step } from "../types";

const INITIAL_LOADING_STATE: LoadingSections = {
  products: false,
  banner: false,
  status: false,
};

function computeDiff(from: Step, to: Step): LoadingSections {
  return {
    products: from.strikePallets !== to.strikePallets,
    banner: from.bannerKey !== to.bannerKey,
    status: from.status !== to.status,
  };
}

const THINK_DELAY = 900;
const UNLOCK_DELAY = 100;

export function useStepController(steps: Step[], useRealtime: boolean = false) {
  const [index, setIndex] = useState(0);
  const [loadingSections, setLoadingSections] = useState<LoadingSections>(INITIAL_LOADING_STATE);
  const lockRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  
  // WebSocket connection for real-time updates
  const { isConnected, currentStep: realtimeStep, error: wsError } = useWebSocket();

  const scheduleTimeout = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      fn();
      timeoutsRef.current = timeoutsRef.current.filter((timeoutId) => timeoutId !== id);
    }, delay);

    timeoutsRef.current.push(id);
    return id;
  }, []);

  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (targetIndex < 0 || targetIndex >= steps.length) return;
      if (lockRef.current || targetIndex === index) return;

      const diff = computeDiff(steps[index], steps[targetIndex]);
      lockRef.current = true;
      setLoadingSections(diff);

      scheduleTimeout(() => {
        setIndex(targetIndex);
        setLoadingSections(INITIAL_LOADING_STATE);
        scheduleTimeout(() => {
          lockRef.current = false;
        }, UNLOCK_DELAY);
      }, THINK_DELAY);
    },
    [index, scheduleTimeout, steps]
  );

  const goToNext = useCallback(() => goToIndex(Math.min(index + 1, steps.length - 1)), [goToIndex, index, steps.length]);
  const goToPrevious = useCallback(() => goToIndex(Math.max(index - 1, 0)), [goToIndex, index]);
  const reset = useCallback(() => goToIndex(0), [goToIndex]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (lockRef.current) return;

      if (event.key === " " || event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, reset]);

  // Handle real-time updates from WebSocket
  useEffect(() => {
    if (useRealtime && realtimeStep) {
      // Find matching step in our steps array
      const matchingStepIndex = steps.findIndex(step => step.id === realtimeStep.id);
      if (matchingStepIndex !== -1) {
        goToIndex(matchingStepIndex);
      }
    }
  }, [realtimeStep, useRealtime, goToIndex, steps]);

  const step = useMemo(() => {
    if (useRealtime && realtimeStep) {
      // Convert realtime step to our Step format
      return {
        id: realtimeStep.id,
        name: realtimeStep.name,
        status: realtimeStep.status as any,
        strikePallets: realtimeStep.strikePallets,
        capacity: realtimeStep.capacity,
        bannerKey: realtimeStep.bannerKey,
        banner: realtimeStep.message ? React.createElement('div', {
          className:
            realtimeStep.bannerKey === 'error'
              ? "p-3 border border-red-200 bg-red-50 rounded-md text-red-800"
              : realtimeStep.bannerKey === 'success'
              ? "p-3 border border-green-200 bg-green-50 rounded-md text-green-800"
              : realtimeStep.bannerKey === 'warn'
              ? "p-3 border border-amber-200 bg-amber-50 rounded-md text-amber-800"
              : "p-3 border border-blue-200 bg-blue-50 rounded-md text-blue-800"
        },
          ...realtimeStep.message.split('\n').map((line, idx) => React.createElement('div', { key: idx }, line))
        ) : undefined
      };
    }
    return steps[index];
  }, [index, steps, useRealtime, realtimeStep]);

  return { 
    index, 
    step, 
    loadingSections, 
    goToIndex, 
    goToNext, 
    goToPrevious, 
    reset,
    isConnected,
    wsError
  };
}
