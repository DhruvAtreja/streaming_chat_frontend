export type Message = {
  text: string;
  sender: "user" | "ai";
};

export type Model = "gpt-4o-mini" | string; // Add other model options as needed
