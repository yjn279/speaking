'use client'

import { useCallback } from 'react';

export const useSpeech = ({
  lang = 'en-US',
}: {
  lang?: string,
}) => {
  return useCallback((text: string) => {
    // 音声設定
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.lang = lang;

    // 音声出力
    speechSynthesis.speak(utterance);
  }, []);
};
