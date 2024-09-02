export const createAssistant = async (graphId: string) => {
  const response = await fetch("/api/createAssistant", {
    method: "POST",
    body: JSON.stringify({ graphId }),
  });
  return response.json();
};

export const createThread = async () => {
  const response = await fetch("/api/createThread", { method: "POST" });
  return response.json();
};

export const sendMessage = async (params: {
  threadId: string;
  assistantId: string;
  message: string;
  model: string;
  userId: string;
  systemInstructions: string;
}) => {
  return fetch("/api/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
};
