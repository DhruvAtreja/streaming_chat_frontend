"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import HomeComponent from "./HomeComponent";
import Settings from "./Settings";
import { Message, Model } from "../types";
import { handleStreamEvent } from "../utils/streamHandler";
import { createAssistant, createThread, sendMessage } from "../utils/chatApi";
import { ASSISTANT_ID_COOKIE } from "@/constants";
import { getCookie, setCookie } from "@/utils/cookies";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>("gpt-4o-mini" as Model);
  const [userId, setUserId] = useState<string>("");
  const [systemInstructions, setSystemInstructions] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      let assistantId = getCookie(ASSISTANT_ID_COOKIE);
      if (!assistantId) {
        const assistant = await createAssistant(
          process.env.NEXT_PUBLIC_LANGGRAPH_GRAPH_ID as string
        );
        assistantId = assistant.assistant_id as string;
        setCookie(ASSISTANT_ID_COOKIE, assistantId);
        setAssistantId(assistantId);
      }

      const { thread_id } = await createThread();
      setThreadId(thread_id);
      setAssistantId(assistantId);
      setUserId(uuidv4());
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: "user" }]);
    setIsLoading(true);

    if (!threadId) {
      console.error("Thread ID is not available");
      return;
    }
    if (!assistantId) {
      console.error("Assistant ID is not available");
      return;
    }

    try {
      const response = await sendMessage({
        threadId,
        assistantId,
        message,
        model,
        userId,
        systemInstructions,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        console.error("Response body is not readable");
        return;
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        try {
          const jsonData = JSON.parse(chunk);
          handleStreamEvent(jsonData, setMessages, setIsLoading);
        } catch (_) {
          console.error("Error parsing JSON data");
        }
      }
    } catch (error) {
      console.error("Error streaming messages:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#212121] overflow-hidden rounded-lg shadow-md">
      <Settings
        onModelChange={setModel}
        onSystemInstructionsChange={setSystemInstructions}
        currentModel={model as any}
        currentSystemInstructions={systemInstructions}
      />
      {messages.length === 0 ? (
        <HomeComponent onMessageSelect={handleSendMessage} />
      ) : (
        <div ref={messageListRef} className="overflow-y-auto h-screen">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      )}
      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}
