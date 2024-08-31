import Message from "./Message";
import SkeletonMessage from "./SkeletonMessage";

export default function MessageList({
  messages,
  isLoading,
}: {
  messages: { text: string; sender: string; toolCalls?: any[] }[];
  isLoading: boolean;
}) {
  return (
    <div className="max-h-screen pb-[100px] w-2/3 mx-auto p-10 overflow-y-scroll">
      {messages.map((message, index) => (
        <div key={index}>
          <Message text={message.text} sender={message.sender} />
        </div>
      ))}
      {isLoading && <SkeletonMessage />}
    </div>
  );
}
