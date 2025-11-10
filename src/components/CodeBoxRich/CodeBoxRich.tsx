import React, { useState, useRef, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { CodeBoxRichProps } from './types';
import '../../styles/index.css';
import './CodeBoxRich.css';

export const CodeBoxRich: React.FC<CodeBoxRichProps> = ({
  code,
  language = 'javascript',
  theme = 'light',
  showLineNumbers = true,
  readOnly = true,
  maxHeight = 25,
  width = '100%',
}) => {
  const [copied, setCopied] = useState(false);
  const [codeString, setCodeString] = useState('// Enter your code here\nfunction hello() {\n  console.log("Hello, World!");\n}');
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Decode all HTML entities including numeric and hex
  const decodeHTMLEntities = useCallback((text: string): string => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }, []);

  // Extract text from slot content and watch for changes with MutationObserver
  useEffect(() => {
    console.log('CodeBoxRich - Received code prop:', code);
    console.log('CodeBoxRich - Code prop type:', typeof code);
    
    // Function to extract text from slot content
    const extractTextFromSlot = () => {
      try {
        if (!containerRef.current) return;
        
        // Try multiple methods to find the slot content
        let slotContent: HTMLElement | null = null;
        
        // Method 1: Access shadow root host and find slot in light DOM
        const rootNode = containerRef.current.getRootNode();
        const shadowRoot = rootNode as ShadowRoot;
        const shadowHost = shadowRoot?.host as HTMLElement;
        
        console.log('CodeBoxRich - Shadow root:', shadowRoot);
        console.log('CodeBoxRich - Shadow host:', shadowHost);
        
        if (shadowHost) {
          // Look for slot content in the shadow host's light DOM children
          slotContent = shadowHost.querySelector('[slot="code"]') as HTMLElement;
        }
        
        // Method 2: Look in parent code-island
        if (!slotContent && shadowHost) {
          const codeIsland = shadowHost.closest('code-island');
          if (codeIsland) {
            slotContent = codeIsland.querySelector('[slot="code"]') as HTMLElement;
          }
        }
        
        // Method 3: Search in document if previous methods fail
        if (!slotContent) {
          const allSlots = document.querySelectorAll('[slot="code"]');
          for (const slot of Array.from(allSlots)) {
            const nearbyCodeIsland = slot.closest('code-island');
            if (nearbyCodeIsland && shadowHost && nearbyCodeIsland.contains(shadowHost)) {
              slotContent = slot as HTMLElement;
              break;
            }
          }
        }
        
        console.log('CodeBoxRich - Slot content element:', slotContent);
        
        if (slotContent) {
          // Clean up existing observer
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
          
          // Set up new MutationObserver with debouncing
          observerRef.current = new MutationObserver(() => {
            console.log('CodeBoxRich - Slot content changed, debouncing...');
            
            // Clear previous debounce timer
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current);
            }
            
            // Debounce extraction by 150ms
            debounceTimerRef.current = setTimeout(() => {
              console.log('CodeBoxRich - Re-extracting code...');
              extractAndSetCode(slotContent);
            }, 150);
          });
          
          observerRef.current.observe(slotContent, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: false, // Don't watch attributes for performance
          });
          
          // Initial extraction
          extractAndSetCode(slotContent);
        }
      } catch (error) {
        console.error('CodeBoxRich - Error in extractTextFromSlot:', error);
      }
    };
    
    // Function to extract and set code from slot element
    const extractAndSetCode = (slotContent: HTMLElement | null) => {
      try {
        if (!slotContent) return;
        
        const htmlContent = slotContent.innerHTML;
        
        console.log('CodeBoxRich - Raw HTML content:', htmlContent);
        
        // Convert HTML to plain text, preserving line breaks
        let plainText = htmlContent
          // Handle all br tag variations (including those with attributes)
          .replace(/<br[^>]*>/gi, '\n')
          .replace(/<br\s*\/?>/gi, '\n')
          // Handle block-level elements that should create new lines
          .replace(/<\/p>/gi, '\n')
          .replace(/<\/div>/gi, '\n')
          .replace(/<\/li>/gi, '\n')
          .replace(/<\/h[1-6]>/gi, '\n')
          // Remove all remaining HTML tags
          .replace(/<[^>]*>/g, '')
          // Clean up individual lines but KEEP empty lines for proper formatting
          .split('\n')
          .map(line => line.trim())
          // Don't filter out empty lines - preserve intentional blank lines
          .join('\n')
          // Remove only leading/trailing whitespace, not blank lines in between
          .replace(/^\s+/, '') // Remove leading whitespace
          .replace(/\s+$/, ''); // Remove trailing whitespace
        
        // Decode ALL HTML entities (including numeric and hex)
        plainText = decodeHTMLEntities(plainText);
        
        console.log('CodeBoxRich - Extracted plain text:', plainText);
        
        // Always update, even if empty (to clear stale content)
        setCodeString(plainText || '// No code provided');
      } catch (error) {
        console.error('CodeBoxRich - Error in extractAndSetCode:', error);
        setCodeString('// Error extracting code');
      }
    };
    
    // Use setTimeout to wait for Webflow's slot projection to complete
    const timer = setTimeout(extractTextFromSlot, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [code, decodeHTMLEntities]);

  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript':
      case 'typescript':
        return [javascript({ jsx: true, typescript: language === 'typescript' })];
      case 'css':
        return [css()];
      case 'html':
        return [html()];
      case 'python':
        return [python()];
      default:
        return [];
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Parse width value - default to 100% if empty or invalid
  const getWidthStyle = () => {
    if (!width || width.trim() === '') {
      return { width: '100%' };
    }
    
    const widthValue = width.trim();
    
    // Check if it already has a unit (%, rem, px, em, vw, vh, etc.)
    // Matches patterns like: "100%", "50rem", "800px", "50.5em", etc.
    if (widthValue.match(/^-?[\d.]+(%|rem|px|em|vw|vh|ch|ex|fr)$/i)) {
      return { width: widthValue };
    }
    
    // If it's just a number (with optional negative sign), assume rem
    if (widthValue.match(/^-?[\d.]+$/)) {
      return { width: `${widthValue}rem` };
    }
    
    // Default to 100% for invalid input
    return { width: '100%' };
  };

  return (
        <div
          ref={containerRef}
          className={`code-box-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}
          style={getWidthStyle()}
        >
      {/* Hidden slot rendering - Webflow handles projection */}
      <div style={{ display: 'none' }}>
        {code}
      </div>
      
      <div className="code-box-header">
        <span className="code-box-language">{language.toUpperCase()}</span>
        <button 
          className="code-box-copy-btn" 
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
              <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
            </svg>
          )}
          <span className="code-box-copy-text">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="code-box-editor">
        <CodeMirror
          value={codeString}
          height={`${maxHeight}rem`}
          extensions={getLanguageExtension()}
          theme={theme === 'dark' ? oneDark : 'light'}
          editable={!readOnly}
          basicSetup={{
            lineNumbers: showLineNumbers,
            highlightActiveLineGutter: false,
            highlightActiveLine: false,
            foldGutter: false,
          }}
        />
      </div>
    </div>
  );
};