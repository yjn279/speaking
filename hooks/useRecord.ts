'use client'

import { useCallback, useMemo, useState } from 'react';

export const useRecord = ({
  lang = 'en-US',
  continuous = true,
  interimResults = true,
}: {
  lang?: string,
  continuous?: boolean,
  interimResults?: boolean,
}) => {
  const [record, setRecord] = useState('');  // 録音したテキスト
  const [isRecording, setIsRecording] = useState(false);  // 録音状態の判定

  // 録音設定
  const recognition = useMemo(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).speechRecognition || (window as any).webkitSpeechRecognition;
      
      const recognition: SpeechRecognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.onresult = (({ results }: any) => {
        setRecord(results[0][0].transcript);
        setIsRecording(!results[0].isFinal);
      });

      return recognition;
    }
  }, [typeof window]);

  // 録音開始
  const startRecording = useCallback(() => {
    if (typeof recognition !== 'undefined') {
      recognition.start();
    }
  }, [recognition]);

  // 録音終了
  const stopRecording = useCallback(() => {
    if (typeof recognition !== 'undefined') {
      recognition.stop();
    }
  }, [recognition]);

  return [record, { isRecording, startRecording, stopRecording }] as const;
};
