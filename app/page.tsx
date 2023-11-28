'use client'

import React, { useState, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function Page() {
  // ステート 
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // モックデータ
  useEffect(() => {
    setMessages([
      {role: 'assistant', content: 'Welcome!'},
      {role: 'user', content: 'I want to learn engineering in English.'},
    ])
  }, []);

  // 録音開始
  const handleStartRecording = () => {
    // TODO: 録音
    setIsRecording(true);
  };

  // 録音停止
  const handleStopRecording = () => {
    // TODO: 音声ファイルをサーバーに送信
    setIsRecording(false);
  };

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
        {isRecording ? (
          <button onClick={handleStopRecording}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <button onClick={handleStartRecording}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
