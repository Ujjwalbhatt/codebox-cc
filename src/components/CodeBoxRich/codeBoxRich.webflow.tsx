import { CodeBoxRich } from './CodeBoxRich';
import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';

export default declareComponent(CodeBoxRich, {
  name: 'CodeBox',
  description: 'A code display component with syntax highlighting and copy functionality',
  group: 'Content',
  options: {
    ssr: false, // Disable SSR to prevent loading errors
  },
  props: {
    code: props.RichText({
      name: 'Code',
      group: 'Content',
      tooltip: 'Paste or type your code. Supports multiline via Rich Text.',
      defaultValue: '// Enter your code here\nfunction hello() {\n  console.log("Hello, World!");\n}',
    }),
    language: props.Variant({
      name: 'Language',
      options: ['javascript', 'typescript', 'css', 'html', 'python'],
      tooltip: 'Choose the syntax highlighting language.',
      defaultValue: 'javascript',
    }),
    theme: props.Variant({
      name: 'Theme',
      options: ['light', 'dark'],
      tooltip: 'Pick the editor color theme.',
      defaultValue: 'light',
    }),
    showLineNumbers: props.Boolean({
      name: 'Show Line Numbers',
      tooltip: 'Toggle line numbers in the gutter.',
      defaultValue: true,
    }),
    readOnly: props.Boolean({
      name: 'Read Only',
      tooltip: 'Disable editing inside the code editor when enabled.',
      defaultValue: true,
    }),
        maxHeight: props.Number({
          name: 'Max Height (rem)',
          tooltip: 'Editor height in rem. Set 0 for minimal height (0rem).',
          defaultValue: 25,
          min: 0,
          max: 62.5,
        }),
        width: props.Text({
          name: 'Width (e.g., "100%", "50rem", "800px")',
          tooltip: 'Editor width. Accepts %, rem, px (e.g., 100%, 50rem, 800px).',
          defaultValue: '100%',
        }),
  },
});

