'use client'

import { useEffect, useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { useRecord } from '@/hooks/useRecord';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

// TODO: 当社の使用ポリシーでは、エンド ユーザーに聞こえる TTS 音声が AI によって生成されたものであり、人間の音声ではないことを明確に開示する必要があることに注意してください。

export default function Page() {
  // React hooks
  const [status, setStatus] = useState<'wait' | 'record' | 'load'>('load');
  const [messages, setMessages] = useState<Message[]>([]);
  const [record, { isRecording, startRecording, stopRecording }] = useRecord({ interimResults: false });
  const speak = useSpeech({});

  // 初回メッセージ
  useEffect(() => {
    if (!messages.length) {
      (async () => {
        // 初回メッセージを生成
        const message = await chatCompletions(messages);
        setMessages([...messages, message]);
        setStatus('wait');

        // 音声合成
        speak(message.content);
      })();
    }
  }, []);

  // 録音したテキストのレンダリング
  useEffect(() => {
    if (isRecording) {
      setMessages([...messages, {
        role: 'user',
        content: record,
      }])
    }
  }, [record]);

  // 録音開始
  const handleStartRecording = () => {
    setStatus('record');
    startRecording();
  };

  // 録音停止
  const handleStopRecording = async () => {
    setStatus('load');
    stopRecording();

    // 応答を生成
    const message = await chatCompletions(messages);
    setMessages([...messages, message]);
    setStatus('wait');

    // 音声合成
    speak(message.content);
  };

  // テキスト生成
  async function chatCompletions(messages: Message[]): Promise<Message>{
    const response = await fetch(location.origin + '/openai/chat-completions', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });

    const payload: { data: { message: Message } } = await response.json();
    const message = payload.data.message;
    return message;
  }

  return (
    <div className="container mx-auto h-screen">
      {/* メッセージログ */}
      {messages.map((message, index) => (
        (message.role === 'user' || message.role === 'assistant') && (
          <div key={index}>
            {message.role === 'user' ? 'You' : 'Assistant'}: {message.content}
          </div>
        )
      ))}

      {/* レコーディングボタン */}
      <div className="fixed inset-x-0 bottom-12 text-center">
        {status === 'wait' ? (
          // 録音ボタン
          <button onClick={handleStartRecording}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </button>
        ) : (status === 'record' ? (
          // 停止ボタン
          <button onClick={handleStopRecording}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          // ローディング
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-bounce w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
};
