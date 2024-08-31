import React, { useState } from "react";

const ToolCall = ({
  id,
  name,
  args,
  result,
}: {
  id: string;
  name: string;
  args: any;
  result?: any;
}) => {
  const [isResultVisible, setIsResultVisible] = useState(false);
  const resultObject = JSON.parse(result);
  const resultString = JSON.stringify(resultObject[0], null, 2);
  return (
    <div className="bg-[#3a3a3a] text-white p-4 rounded-lg mb-2 text-sm relative">
      <div className="w-full mb-2 flex justify-between items-center">
        <span className="text-xs text-gray-400">Tool Call</span>
        {result && (
          <button
            onClick={() => setIsResultVisible(!isResultVisible)}
            className="text-gray-400 hover:text-gray-300 focus:outline-none"
          >
            {isResultVisible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      <p>{args.query}</p>
      <p className="text-xs opacity-80">{name}</p>

      {result && (
        <div
          className={`mt-2 overflow-y-scroll transition-all duration-500 ease-in-out ${
            isResultVisible ? "max-h-96" : "max-h-0"
          }`}
        >
          <p>
            <strong>Result:</strong>{" "}
            <div className="text-sm">
              <pre>{resultString}</pre>
            </div>
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolCall;
