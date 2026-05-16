"use client";

import { useState, useEffect } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    // Extract the text content from the code element
    if (children && typeof children === 'object' && 'props' in children) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const codeElement = children as any;
      if (codeElement.props.children) {
        setCode(codeElement.props.children);
      }
    }
  }, [children]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Extract language from className
  const language = className?.replace('language-', '') || 'text';

  return (
    <div className="relative group my-6">
      {/* Language badge */}
      <div className="absolute top-0 right-0 z-10">
        <div className="text-gray-300 text-xs px-3 py-1 rounded-bl-lg font-mono" style={{ background: "oklch(22% 0.01 72)" }}>
          {language}
        </div>
      </div>
      
      {/* Copy button */}
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white p-2 rounded-md text-sm font-medium" style={{ background: "oklch(30% 0.01 72)" }}
        title="Copy code"
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* Code block */}
      <div className="rounded-lg overflow-hidden shadow-lg border">
        <pre className="p-4 overflow-x-auto">
          <code className={`${className} text-sm leading-relaxed`}>
            {children}
          </code>
        </pre>
      </div>

      {/* Success message */}
      {copied && (
        <div className="absolute top-2 right-12 z-20 bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium animate-fade-in">
          Copied!
        </div>
      )}
    </div>
  );
} 