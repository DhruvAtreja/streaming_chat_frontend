import { Message, ToolCall } from "../types";

export const handleStreamEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (event.event === "messages/partial") {
    event.data.forEach((dataItem: any) => {
      if (dataItem.type === "ai" && dataItem.additional_kwargs.tool_calls) {
        // Handle tool call being initiated
        const toolCall: ToolCall = {
          id: dataItem.tool_calls[0].id,
          name: dataItem.tool_calls[0].name,
          args: dataItem.tool_calls[0].args,
        };
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === "ai") {
            if (lastMessage.toolCalls && lastMessage.toolCalls.length > 0) {
              // If the last message was also a tool call, update it
              console.log("updating tool call", ...prevMessages.slice(0, -1), {
                toolCalls: [...lastMessage.toolCalls, toolCall],
              });
              return [
                ...prevMessages.slice(0, -1),
                {
                  ...lastMessage,
                  toolCalls: [toolCall],
                },
              ];
            } else {
              // If the last message was not a tool call, add the tool call to it
              console.log("new tool call", ...prevMessages.slice(0, -1), {
                toolCalls: [toolCall],
              });
              return [
                ...prevMessages.slice(0, -1),
                {
                  ...lastMessage,
                  toolCalls: [toolCall],
                },
              ];
            }
          } else {
            // If the last message was not from AI, add a new message
            return [
              ...prevMessages,
              { text: "", sender: "ai", toolCalls: [toolCall] },
            ];
          }
        });
      } else if (dataItem.content) {
        console.log("sent by ai", dataItem);
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          console.log("lastMessage", lastMessage);
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
    console.log("messages/complete", event);
    const dataItem = event.data[event.data.length - 1];
    // setIsLoading(false);
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
