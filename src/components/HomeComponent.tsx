import React from "react";
import Image from "next/image";

const exampleMessages = [
  "What's the weather in SF?",
  "What's langchain?",
  "Tell me the revenue of mcdonalds",
  "Tell me a joke",
];

const HomeComponent: React.FC<{
  onMessageSelect: (message: string) => void;
}> = ({ onMessageSelect }) => {
  return (
    <div className="flex flex-col items-center  justify-center h-full">
      <Image
        src="/logo.jpeg"
        alt="StreamChat"
        width={80}
        height={80}
        className="mb-8 rounded-full"
      />
      <div className="grid grid-cols-2 gap-4 mx-2 sm:mx-0">
        {exampleMessages.map((message, index) => (
          <div
            key={index}
            className="bg-transparent border-[1px] border-[#ffffff1a] p-2 sm:p-4 rounded-lg text-gray-400 cursor-pointer transition-all duration-500 ease-in-out hover:bg-[#2f2f2f] hover:scale-105"
            onClick={() => onMessageSelect(message)}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
