import { useState, useEffect } from "react";

export const useSpeech = (text) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const u = new SpeechSynthesisUtterance(text);
    const selectedVoices = window.speechSynthesis
      .getVoices()
      .filter(
        (v) =>
          v.name.startsWith("Microsoft Emma Online") ||
          v.name === "Google US English"
      );

    if (selectedVoices) {
      u.voice = selectedVoices[0];
    }

    u.rate = 1.1;

    u.onend = () => {
      setIsPlaying(false);
    };

    setUtterance(u);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text]);

  const speak = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.speak(utterance);
    }

    setIsPlaying(true);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPaused(false);
    setIsPlaying(false);
  };

  return {
    speak,
    pause,
    stop,
    isPaused,
    isPlaying,
  };
};
