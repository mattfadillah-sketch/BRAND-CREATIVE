
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Tabs } from './components/Tabs';
import { OutputDisplay } from './components/OutputDisplay';
import { generateContentFromImages } from './services/geminiService';
import { OutputMode } from './types';
import { SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [brandDnaFile, setBrandDnaFile] = useState<File | null>(null);
  const [moodboardFile, setMoodboardFile] = useState<File | null>(null);
  const [brandDnaPreview, setBrandDnaPreview] = useState<string | null>(null);
  const [moodboardPreview, setMoodboardPreview] = useState<string | null>(null);
  
  const [objective, setObjective] = useState('');
  const [activeTab, setActiveTab] = useState<OutputMode>(OutputMode.VisualPrompt);
  
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>, previewSetter: React.Dispatch<React.SetStateAction<string | null>>) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setter(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        previewSetter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!brandDnaFile || !moodboardFile || !objective) {
      setError("Please provide both images and a content objective.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const result = await generateContentFromImages(brandDnaFile, moodboardFile, objective, activeTab);
      setOutput(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [brandDnaFile, moodboardFile, objective, activeTab]);

  const isButtonDisabled = !brandDnaFile || !moodboardFile || !objective || isLoading;

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Brand Vision AI MATT
          </h1>
          <p className="text-gray-400 mt-2">Fuse your brand's DNA with new inspiration to generate brilliant content.</p>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ImageUploader
              id="brand-dna"
              label="Upload Brand Identity / Past Content"
              onFileChange={handleFileChange(setBrandDnaFile, setBrandDnaPreview)}
              previewUrl={brandDnaPreview}
            />
            <ImageUploader
              id="moodboard"
              label="Upload Moodboard / New Inspiration"
              onFileChange={handleFileChange(setMoodboardFile, setMoodboardPreview)}
              previewUrl={moodboardPreview}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="objective" className="block text-sm font-medium text-cyan-400 mb-2">
              Content / Campaign Objective
            </label>
            <textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder='e.g., "Launch campaign for a new matcha-flavored energy drink"'
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 placeholder-gray-500"
              rows={3}
            />
          </div>

          <div className="mb-6">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={isButtonDisabled}
              className={`inline-flex items-center justify-center px-8 py-3 font-bold text-lg rounded-full transition-all duration-300
                ${isButtonDisabled 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-4 focus:ring-cyan-300'
                }`}
            >
              <SparklesIcon className="w-6 h-6 mr-2" />
              {isLoading ? 'Generating...' : 'Generate Content'}
            </button>
          </div>

          <OutputDisplay output={output} isLoading={isLoading} error={error} />
        </main>
      </div>
    </div>
  );
};

export default App;
