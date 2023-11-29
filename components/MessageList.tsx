import { Message } from "@/types/message";

export default function MessageList({ messages }: { messages: Message[] }) {
  return (
    <>
      {messages.map((message, index) => (
        <div key={index}>
          {message.role}: {message.content}
        </div>
      ))}
    </>
  )  
}
