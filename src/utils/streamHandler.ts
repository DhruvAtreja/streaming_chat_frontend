import { Message, ToolCall } from "../types";

export const handleStreamEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (event.event === "messages/partial") {
    event.data.forEach((dataItem: any) => {
      if (
        dataItem.type === "ai" &&
        Array.isArray(dataItem.tool_calls) &&
        dataItem.tool_calls.length > 0
      ) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === "ai") {
            if (lastMessage.toolCalls && lastMessage.toolCalls.length > 0) {
              // If the last message was also a tool call, update it with new tool calls
              return [
                ...prevMessages.slice(0, -1),
                {
                  ...lastMessage,
                  toolCalls: [
                    ...lastMessage.toolCalls,
                    ...dataItem.tool_calls.filter(
                      (newTc: ToolCall) =>
                        !lastMessage.toolCalls?.some(
                          (existingTc) => existingTc.id === newTc.id
                        )
                    ),
                  ],
                },
              ];
            } else {
              // If the last message was not a tool call, add the tool call to it
              return [
                ...prevMessages.slice(0, -1),
                {
                  ...lastMessage,
                  toolCalls: dataItem.tool_calls,
                },
              ];
            }
          } else {
            // If the last message was not from AI, add a new message
            return [
              ...prevMessages,
              { text: "", sender: "ai", toolCalls: dataItem.tool_calls },
            ];
          }
        });
      } else if (dataItem.content) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === "ai") {
            setIsLoading(false);
            return [
              ...prevMessages.slice(0, -1),
              {
                ...lastMessage,
                text: dataItem.content,
                toolCalls: lastMessage.toolCalls || [],
              },
            ];
          } else {
            return [
              ...prevMessages,
              { text: dataItem.content, sender: "ai", toolCalls: [] },
            ];
          }
        });
      }
    });
  } else if (event.event === "messages/complete") {
    const dataItem = event.data[event.data.length - 1];
    if (dataItem.type === "tool") {
      // Handle tool call completion
      const toolCall: ToolCall = {
        id: dataItem.tool_call_id,
        name: dataItem.name,
        args: dataItem.artifact,
        result: dataItem.content,
      };
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === "ai") {
          return [
            ...prevMessages.slice(0, -1),
            {
              ...lastMessage,
              toolCalls: lastMessage.toolCalls?.map((tc) =>
                tc.id === toolCall.id ? toolCall : tc
              ) || [toolCall],
            },
          ];
        } else {
          return [
            ...prevMessages,
            { text: "", sender: "ai", toolCalls: [toolCall] },
          ];
        }
      });
    }
  }
};
