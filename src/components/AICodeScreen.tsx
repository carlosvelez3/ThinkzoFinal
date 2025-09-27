import React, { useState, useEffect } from "react";

interface AICodeScreenProps {
  children?: React.ReactNode;
}

export default function AICodeScreen({ children }: AICodeScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [currentFileName, setCurrentFileName] = useState("initializing...");

  const codeLines = [
    "$ initializing AI process...",
    "✓ Loading neural networks",
    "✓ Connecting to OpenAI API",
    "$ analyzing project requirements...",
    "",
    "// Generating React component",
    "import React from 'react';",
    "import { motion } from 'framer-motion';",
    "",
    "const AIComponent = () => {",
    "  const [data, setData] = useState(null);",
    "  ",
    "  useEffect(() => {",
    "    fetchAIData().then(setData);",
    "  }, []);",
    "",
    "  return (",
    "    <motion.div",
    "      initial={{ opacity: 0 }}",
    "      animate={{ opacity: 1 }}",
    "      className='ai-powered-component'",
    "    >",
    "      {data && <DataVisualization data={data} />}",
    "    </motion.div>",
    "  );",
    "};",
    "",
    "$ optimizing performance...",
    "✓ Bundle size: 234KB → 156KB",
    "✓ Load time: 2.1s → 0.8s",
    "✓ Lighthouse score: 94/100",
    "",
    "$ deployment ready ✨",
    "🚀 Your AI-powered website is live!"
  ];

  const fileNames = [
    "ai-process.sh",
    "neural-networks.js",
    "openai-config.json",
    "requirements.md",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "AIComponent.tsx",
    "performance.config.js",
    "webpack.config.js",
    "lighthouse.json",
    "build.log",
    "deployment.sh",
    "success.log"
  ];
  // Typing animation effect
  useEffect(() => {
    if (currentLineIndex >= codeLines.length) return;

    const currentLine = codeLines[currentLineIndex];
    
    // Update filename based on current line
    if (fileNames[currentLineIndex]) {
      setCurrentFileName(fileNames[currentLineIndex]);
    }
    
    if (currentCharIndex < currentLine.length) {
      const timer = setTimeout(() => {
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = currentLine.slice(0, currentCharIndex + 1);
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, Math.random() * 50 + 30); // Variable typing speed

      return () => clearTimeout(timer);
    } else {
      // Move to next line after a brief pause
      const timer = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        if (currentLineIndex + 1 < codeLines.length) {
          setLines(prev => [...prev, ""]);
        }
      }, Math.random() * 200 + 100);

      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, codeLines]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div
      className="
        relative w-full max-w-none
        bg-gradient-to-br from-terminal-bg-start to-terminal-bg-end 
        rounded-2xl shadow-2xl border border-gray-600 
        overflow-hidden flex flex-col 
        max-h-[80vh] min-h-[500px] h-full
        backdrop-blur-sm
      "
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800/90 px-4 py-3 border-b border-gray-600 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
          <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
          <span className="text-sm text-gray-200 font-medium">AI Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">~/projects/ai-website/</span>
          <span className="text-xs text-white font-mono bg-gray-700 px-2 py-1 rounded">
            {currentFileName}
          </span>
        </div>
      </div>

      {/* Terminal Body — scrollable */}
      <div
        className="
          flex-1 overflow-y-scroll h-full 
          px-4 py-3 font-mono text-sm leading-relaxed 
          text-white
          scrollbar-gutter-stable
        "
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #374151'
        }}
      >
        {children || (
          <div className="space-y-1">
            {lines.map((line, index) => (
              <div key={index} className="flex items-start">
                <span className="whitespace-pre-wrap break-words">
                  {line}
                  {index === currentLineIndex && showCursor && (
                    <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}