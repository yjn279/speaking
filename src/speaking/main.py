from pathlib import Path

import streamlit as st
from openai import OpenAI
from audio_recorder_streamlit import audio_recorder

system_prompt = """
### You are a helpful assistant acting as an English teacher for a language learning application.
### Start with basic English suitable for beginners and gradually increase the complexity as the user"s understanding improves.
### If the user"s responses show inaccuracies or misunderstandings, provide feedback using simpler English and maintain the current difficulty level.
### Your goal is to make learning enjoyable and effective, adapting to the user"s pace and encouraging progress.
"""

class API:
    def __init__(self, api_key: str) -> None:
        self.client = OpenAI(api_key=api_key)


    def generate(self, messages: list, model: str = "gpt-3.5-turbo") -> str:
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
        )
        return response.choices[0].message.content
    

    def to_speech(
            self,
            input: str,
            model: str = "tts-1",
            voice: str = "alloy",
        ) -> str:
        response = self.client.audio.speech.create(
            input=input,
            model=model,
            voice=voice,
        )
        response.stream_to_file("temp_audio.wav")
        return "temp_audio.wav"
    
    
    def to_text(self, audio_bytes, model: str = "whisper-1") -> str:
        with open("temp_audio.wav", "wb") as f:
            f.write(audio_bytes)

        audio_file = open("temp_audio.wav", "rb")
        transcript = self.client.audio.transcriptions.create(
            model=model, 
            file=audio_file,
        )
        return transcript.text


def main():
    # APIキーの入力
    if "api_key" not in st.session_state:
        st.text_input("OpenAIのAPIキーを入力してください。", key="api_key", placeholder="sk-******")
        return
    
    # APIキーのステート維持
    st.session_state.api_key = st.session_state.api_key

    # 音声入力
    audio_bytes = audio_recorder()

    # 会話ログ
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "system", "content": system_prompt},
        ]

    # 会話ログの表示
    for message in st.session_state.messages:
        role = message["role"]

        if role == "assistant":
            st.write("アシスタント：", message["content"])

        elif role == "user":
            st.write("あなた：", message["content"])
        
    # レスポンスの生成
    if audio_bytes:
        api = API(api_key=st.session_state.api_key)

        # Speech to text
        text = api.to_text(audio_bytes)
        st.session_state.messages.append({
            "role": "user",
            "content": text,
        })
        st.write("あなた：", text)

        # Text generation
        text = api.generate(st.session_state.messages)
        st.session_state.messages.append({
            "role": "assistant",
            "content": text,
        })

        # Text to speech
        audio_path = api.to_speech(text)
        st.write("アシスタント：", text)
        st.write(audio_path)
        st.audio(audio_path)


if __name__ == "__main__":
    main()
