
import React from 'react';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-600 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-cyan-400">AI is thinking...</p>
    </div>
);

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output, isLoading, error }) => {
  if (isLoading) {
    return <div className="mt-6 flex justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!output) {
    return (
        <div className="mt-6 p-8 bg-gray-900 border border-gray-800 rounded-lg text-center text-gray-500">
            <p>Your generated content will appear here.</p>
        </div>
    );
  }

  // A simple markdown-like renderer for demonstration
  const renderOutput = () => {
    return output.split('\n').map((line, index) => {
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-purple-400">{line.substring(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-cyan-400">{line.substring(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-cyan-300">{line.substring(2)}</h1>;
      }
       if (line.startsWith('* ')) {
        return <li key={index} className="ml-5 list-disc list-inside">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="my-1">{line}</p>;
    });
  };

  return (
    <div className="mt-6 p-6 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {renderOutput()}
        </div>
    </div>
  );
};
