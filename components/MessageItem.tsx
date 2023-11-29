import { Message } from "@/types/message";

export default function MessageIem({ message }: { message: Message }) {
  return (
    <div>{message.role}: {message.content}</div>
  )  
}
