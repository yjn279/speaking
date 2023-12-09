'use client'

import { useEffect, useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { useRecord } from '@/hooks/useRecord';
import { Message } from '@/types/message';
import { Status } from '@/types/status';
import MessageList from '@/components/MessageList';
import MessageIem from '@/components/MessageItem';
import RecordingButton from '@/components/RecordingButton';

// TODO: 当社の使用ポリシーでは、エンド ユーザーに聞こえる TTS 音声が AI によって生成されたものであり、人間の音声ではないことを明確に開示する必要があることに注意してください。

export default function Page() {
  // React hooks
  const [status, setStatus] = useState<Status>('loading');
  const [messages, setMessages] = useState<Message[]>([]);
  const [record, { isRecording, startRecording, stopRecording }] = useRecord({});
  const speak = useSpeech({});

  // 初回メッセージ
  useEffect(() => {
    (async () => {
      // 初回メッセージを生成
      const message = await chatCompletions(messages);
      setMessages([message]);
      setStatus('waiting');

      // 音声合成
      speak(message.content);
    })();
  }, []);

  // 録音したテキストのレンダリング
  useEffect(() => {
    if (record !== '' && !isRecording) {
      setMessages([...messages, {
        role: 'user',
        content: record,
      }])

      handleStopRecording();
    }
  }, [isRecording]);

  // 録音開始
  const handleStartRecording = () => {
    setStatus('recording');
    startRecording();
  };

  // 録音停止
  const handleStopRecording = async () => {
    setStatus('loading');
    stopRecording();

    // 応答を生成
    const message = await chatCompletions(messages);
    setMessages([
      ...messages,
      {role: 'user', content: record},
      message,
    ]);
    setStatus('waiting');

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
      <MessageList messages={messages} />
      {isRecording && (
        <MessageIem message={{role: 'user', content: record}} />
      )}

      {/* レコーディングボタン */}
      <RecordingButton
        status={status}
        handleStart={handleStartRecording}
        handleStop={handleStopRecording}
      />
    </div>
  );
};
