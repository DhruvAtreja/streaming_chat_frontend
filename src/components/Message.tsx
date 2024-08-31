import Markdown from "react-markdown";
import ToolCall from "./ToolCall";
import { ToolCall as ToolCallType } from "../types";

export default function Message({
  text,
  sender,
  toolCalls,
}: {
  text: string;
  sender: string;
  toolCalls?: ToolCallType[];
}) {
  const isBot = sender === "ai";
  return (
    <div
      className={`flex ${
        isBot ? "justify-start" : "justify-end"
      } mb-4 relative`}
    >
      {isBot && (
        <img
          src="/logo.jpeg"
          alt="Bot Icon"
          className="absolute left-0 top-4 w-8 h-8 rounded-full"
          style={{ transform: "translateX(-120%)" }}
        />
      )}
      <div
        className={`overflow-x-wrap break-words p-5 rounded-3xl ${
          isBot
            ? " w-full opacity-90"
            : "mt-10 max-w-md bg-[#2f2f2f] text-sm text-white opacity-90"
        }`}
      >
        {toolCalls &&
          toolCalls.map((toolCall, index) => (
            <ToolCall key={index} {...toolCall} />
          ))}
        {isBot ? <Markdown>{text}</Markdown> : text}
      </div>
    </div>
  );
}
