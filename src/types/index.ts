export interface CodeBoxRichProps {
  code?: React.ReactNode;
  language?: 'javascript' | 'typescript' | 'css' | 'html' | 'python';
  theme?: 'light' | 'dark';
  showLineNumbers?: boolean;
  readOnly?: boolean;
  maxHeight?: number;
  width?: string;
}

