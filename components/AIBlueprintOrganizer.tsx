'use client';

import { useState } from 'react';
import { FileText, Upload, Download, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface KCSEntry {
  id: string;
  content: string;
  metadata: {
    tags: string[];
    category: string;
    timestamp: string;
  };
  chunks: string[];
}

export default function AIBlueprintOrganizer() {
  const [irText, setIrText] = useState('');
  const [irMarkdown, setIrMarkdown] = useState('');
  const [showIrPreview, setShowIrPreview] = useState(false);
  const [kcsData, setKcsData] = useState<KCSEntry[]>([]);
  const [kcsInput, setKcsInput] = useState('');
  const [inputFormat, setInputFormat] = useState<'json' | 'jsonl'>('json');

  const convertToMarkdown = (text: string): string => {
    let markdown = text;

    // Convert headers (lines ending with colon)
    markdown = markdown.replace(/^(.+):$/gm, '## $1');

    // Convert bullet points
    markdown = markdown.replace(/^[\-\*]\s+(.+)$/gm, '- $1');

    // Convert numbered lists
    markdown = markdown.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');

    // Bold important words (all caps)
    markdown = markdown.replace(/\b([A-Z]{3,})\b/g, '**$1**');

    // Add line breaks for paragraphs
    markdown = markdown.replace(/\n\n/g, '\n\n');

    return markdown;
  };

  const handleIrSubmit = () => {
    const markdown = convertToMarkdown(irText);
    setIrMarkdown(markdown);
    setShowIrPreview(true);
  };

  const chunkText = (text: string, chunkSize: number = 500): string[] => {
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk = '';

    for (const word of words) {
      if ((currentChunk + word).length > chunkSize) {
        chunks.push(currentChunk.trim());
        currentChunk = word + ' ';
      } else {
        currentChunk += word + ' ';
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const extractMetadata = (content: string): { tags: string[]; category: string } => {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for']);
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq: { [key: string]: number } = {};

    words.forEach(word => {
      if (!commonWords.has(word) && word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const tags = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    const category = tags[0] || 'general';

    return { tags, category };
  };

  const handleKcsSubmit = () => {
    try {
      let entries: any[];

      if (inputFormat === 'json') {
        const parsed = JSON.parse(kcsInput);
        entries = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        entries = kcsInput
          .split('\n')
          .filter(line => line.trim())
          .map(line => JSON.parse(line));
      }

      const processedEntries: KCSEntry[] = entries.map((entry, index) => {
        const content = typeof entry === 'string' ? entry : JSON.stringify(entry);
        const chunks = chunkText(content);
        const metadata = extractMetadata(content);

        return {
          id: Date.now().toString() + index,
          content,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
          },
          chunks,
        };
      });

      setKcsData([...kcsData, ...processedEntries]);
      setKcsInput('');
    } catch (error) {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setKcsInput(text);
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(kcsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kcs-export-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Instructional Rulesets */}
        <div className="bg-white rounded-lg border-2 border-purple-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Instructional Rulesets (IR)
            </h2>
          </div>

          <textarea
            value={irText}
            onChange={(e) => setIrText(e.target.value)}
            placeholder="Enter your instructional rules here..."
            className="w-full h-64 px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-mono resize-none"
          />

          <button
            onClick={handleIrSubmit}
            disabled={!irText.trim()}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Convert to Markdown
          </button>

          {showIrPreview && irMarkdown && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-900 mb-3">
                Markdown Preview
              </h3>
              <div className="prose prose-sm max-w-none prose-headings:text-purple-900 prose-strong:text-purple-800">
                <ReactMarkdown>{irMarkdown}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Compendium Synthesis */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Knowledge Compendium Synthesis (KCS)
            </h2>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setInputFormat('json')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                inputFormat === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setInputFormat('jsonl')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                inputFormat === 'jsonl'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              JSONL
            </button>
          </div>

          <textarea
            value={kcsInput}
            onChange={(e) => setKcsInput(e.target.value)}
            placeholder={
              inputFormat === 'json'
                ? '{\n  "content": "Your knowledge entry"\n}'
                : '{"content": "Entry 1"}\n{"content": "Entry 2"}'
            }
            className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono resize-none"
          />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 cursor-pointer transition-colors font-medium">
              <Upload className="w-5 h-5" />
              Upload File
              <input
                type="file"
                accept=".json,.jsonl"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleExport}
              disabled={kcsData.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          <button
            onClick={handleKcsSubmit}
            disabled={!kcsInput.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Process & Add
          </button>

          {kcsData.length > 0 && (
            <div className="mt-6 space-y-4 max-h-96 overflow-y-auto">
              <h3 className="text-sm font-semibold text-slate-700">
                Processed Entries ({kcsData.length})
              </h3>
              {kcsData.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-700 uppercase">
                      {entry.metadata.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(entry.metadata.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2 line-clamp-2">
                    {entry.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {entry.metadata.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600">
                    {entry.chunks.length} chunk{entry.chunks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          AI Blueprint Organizer Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <strong>IR Processing:</strong> Automatic Markdown conversion with intelligent formatting
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <strong>KCS Chunking:</strong> Automatic text segmentation for optimal processing
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <strong>Metadata Tagging:</strong> AI-powered tag and category extraction
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <strong>Format Support:</strong> JSON and JSONL with file import/export
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
