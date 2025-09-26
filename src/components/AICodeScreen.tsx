import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Play, Cpu, Zap } from 'lucide-react';
import { AnimatedI } from './AnimatedI';

const codeSnippets = [
  {
    language: 'Python',
    code: `# Ai Model Training
import tensorflow as tf
from sklearn.model_selection import train_test_split

class AiModel:
    def __init__(self, layers=3):
        self.model = tf.keras.Sequential([
            tf.keras.layers.Dense(128, activation='relu'),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(10, activation='softmax')
        ])
    
    def train(self, X, y):
        self.model.compile(
            optimizer='adam',
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        return self.model.fit(X, y, epochs=100)

# Initialize and train model  
ai_model = AiModel()
history = ai_model.train(X_train, y_train)
print(f"Training accuracy: {history.history['accuracy'][-1]:.4f}")`,
     color: 'from-secondary-blue to-secondary-purple'
  },
  {
    language: 'JavaScript',
    code: `// Ai-Powered Web Application
class IntelligentSystem {
    constructor() {
        this.neuralNetwork = new NeuralNetwork({
            inputSize: 784,
            hiddenLayers: [128, 64],
            outputSize: 10
        });
        this.isLearning = false;
    }

    async processData(inputData) {
        const preprocessed = this.normalize(inputData);
        const prediction = await this.neuralNetwork.predict(preprocessed);
        
        return {
            confidence: Math.max(...prediction),
            classification: this.getLabel(prediction),
            processingTime: performance.now()
        };
    }

    async continuousLearning(dataStream) {
        this.isLearning = true;
        for await (const batch of dataStream) {
            await this.neuralNetwork.trainBatch(batch);
            this.updateMetrics();
        }
    }
}

const aiSystem = new IntelligentSystem(); 
console.log("Ai System initialized and ready for deployment");`,
     color: 'from-primary-accent to-secondary-blue'
  },
  {
    language: 'React',
    code: `// Ai-Enhanced React Component
import { useAi, useMachineLearning } from '@thinkzo/ai-hooks';

const SmartComponent = () => {
    const { predict, isProcessing } = useAi({
        model: 'gpt-4-turbo',
        temperature: 0.7
    });
    
    const { trainModel, accuracy } = useMachineLearning({
        algorithm: 'neural-network',
        layers: [256, 128, 64]
    });

    const handleIntelligentAction = async (userInput) => {
        const analysis = await predict({
            prompt: userInput,
            context: 'business-automation'
        });
        
        return {
            recommendation: analysis.suggestion,
            confidence: analysis.confidence,
            nextSteps: analysis.actions
        };
    };

    return (
        <div className="ai-interface">
            <AIProcessor 
                onResult={handleIntelligentAction}
                realTimeAnalysis={true}
            />
            <MetricsDisplay accuracy={accuracy} />
        </div>
    );
};`,
     color: 'from-secondary-purple to-primary-accent'
  }
];

interface AICodeScreenProps {
  children?: React.ReactNode;
}

export default function AICodeScreen({ children }: AICodeScreenProps) {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (children) return; // Don't run animation if children are provided

    const snippet = codeSnippets[currentSnippet];
    const lines = snippet.code.split('\n');
    
    if (currentLine < lines.length) {
      const timer: NodeJS.Timeout = setTimeout(() => {
        setDisplayedCode(() => {
          const newCode = lines.slice(0, currentLine + 1).join('\n');
          return newCode;
        });
        setCurrentLine(prev => prev + 1);
      }, 80);

      return (): void => clearTimeout(timer);
    } else if (currentLine >= lines.length) {
      const pauseTimer: NodeJS.Timeout = setTimeout(() => {
        setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
        setCurrentLine(0);
        setDisplayedCode('');
      }, 3000);

      return (): void => clearTimeout(pauseTimer);
    }
  }, [currentLine, currentSnippet, children]);

  const currentSnippetData = codeSnippets[currentSnippet];

  return (
    <div
      className="
        relative 
        bg-gradient-to-br from-terminal-bg-start to-terminal-bg-end 
        rounded-2xl shadow-2xl border border-gray-700 
        overflow-hidden flex flex-col 
        max-h-[80vh] min-h-[400px] h-full w-full
      "
    >
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 bg-gray-800/80 px-3 py-2 border-b border-gray-700">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-sm text-gray-300 font-medium">
          AI Terminal {!children && `- ${currentSnippetData.language}`}
        </span>
        {!children && (
          <div className="ml-auto flex items-center space-x-2">
            <motion.div
              className="flex items-center space-x-1 text-xs text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cpu className="w-3 h-3" />
              <span>A<AnimatedI /> Processing</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Terminal Body — scrollable */}
      <div
        className="
          flex-1 overflow-y-auto h-full 
          px-4 py-3 font-mono text-sm leading-relaxed text-green-400
        "
      >
        {/* animated typing goes here */}
        {children || (
          <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap m-0 p-0">
            <code className="block">
              {displayedCode}
              <span
                className="inline-block w-2 bg-primary-accent ml-1 animate-pulse"
                style={{ height: '1.2em' }}
              />
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}