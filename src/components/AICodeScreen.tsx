import React from "react";

interface AICodeScreenProps {
  children?: React.ReactNode;
}

export default function AICodeScreen({ children }: AICodeScreenProps) {
  return (
    <div
      className="
        relative 
        bg-cream-100 
        rounded-2xl shadow-2xl border border-gray-300
        overflow-hidden flex flex-col 
        max-h-[80vh] min-h-[400px] h-full w-full
      "
    >
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 bg-gray-200 px-3 py-2 border-b border-gray-300">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-sm text-gray-800 font-medium">AI Terminal</span>
      </div>

      {/* Terminal Body — scrollable */}
      <div
        className="
          flex-1 overflow-y-auto h-full 
          px-4 py-3 font-mono text-sm leading-relaxed 
          text-gray-900
          bg-[#FFFDF5]
        "
      >
        {/* animated typing goes here */}
        {children || (
          <>
            <p>$ initializing AI process...</p>
            <p>$ loading models...</p>
            <p>$ generating code output...</p>
          </>
        )}
      </div>
    </div>
  );
}