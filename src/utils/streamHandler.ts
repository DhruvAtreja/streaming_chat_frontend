import { Message } from "../types";

export const handleStreamEvent = (
  event: any,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (event.event === "messages/partial") {
    event.data.forEach((dataItem: any) => {
      if (dataItem.content) {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === "ai") {
            setIsLoading(false);
            return [
              ...prevMessages.slice(0, -1),
              { text: dataItem.content, sender: "ai" },
            ];
          } else {
            return [...prevMessages, { text: dataItem.content, sender: "ai" }];
          }
        });
      }
    });
  }
};
