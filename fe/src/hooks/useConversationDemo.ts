import { useState, useEffect, useRef, useCallback } from "react";
import { DynamicComponent, ConversationDemoConfig, TimedComponent } from "~/types/components";

export function useConversationDemo(config: ConversationDemoConfig) {
  const [components, setComponents] = useState<DynamicComponent[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clear all timeouts
  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  // Add a component to the current list
  const addComponent = useCallback((component: DynamicComponent) => {
    setComponents(prev => [...prev, component]);
    config.onComponentAdd?.(component);
  }, [config]);

  // Start the conversation demo
  const startDemo = useCallback(() => {
    if (isPlaying || isComplete) return;
    
    setIsPlaying(true);
    setCurrentIndex(0);
    
    // Play audio if provided
    if (config.audioFile && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Schedule all components based on their delay
    let cumulativeDelay = 0;
    
    config.components.forEach((timedComponent: TimedComponent, index) => {
      cumulativeDelay += timedComponent.delay;
      
      const timeout = setTimeout(() => {
        addComponent(timedComponent.component);
        setCurrentIndex(index + 1);
        
        // Check if this is the last component
        if (index === config.components.length - 1) {
          setIsComplete(true);
          setIsPlaying(false);
          config.onSequenceComplete?.();
        }
      }, cumulativeDelay);
      
      timeoutRefs.current.push(timeout);
    });
  }, [isPlaying, isComplete, config, addComponent]);

  // Stop the conversation demo
  const stopDemo = useCallback(() => {
    setIsPlaying(false);
    clearTimeouts();
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [clearTimeouts]);

  // Reset the conversation demo
  const resetDemo = useCallback(() => {
    stopDemo();
    setComponents([]);
    setCurrentIndex(0);
    setIsComplete(false);
  }, [stopDemo]);

  // Remove a specific component
  const removeComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(comp => comp.params.id !== id));
  }, []);

  // Initialize audio element if audioFile is provided
  useEffect(() => {
    if (config.audioFile) {
      audioRef.current = new Audio(config.audioFile);
      audioRef.current.addEventListener('ended', () => {
        // Audio ended, but components might still be showing
        console.log('Audio playback completed');
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [config.audioFile]);

  // Auto-start if configured
  useEffect(() => {
    if (config.autoPlay && !isPlaying && !isComplete) {
      startDemo();
    }
  }, [config.autoPlay, startDemo, isPlaying, isComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [clearTimeouts]);

  return {
    components,
    isPlaying,
    isComplete,
    currentIndex,
    startDemo,
    stopDemo,
    resetDemo,
    removeComponent,
    progress: config.components.length > 0 ? (currentIndex / config.components.length) * 100 : 0,
  };
}