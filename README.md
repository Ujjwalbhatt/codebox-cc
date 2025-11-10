# CodeBoxRich - Webflow Code Component

A beautiful code display component with syntax highlighting and copy functionality for Webflow. Built with React and CodeMirror, this component allows you to showcase code snippets with support for multiple languages, themes, and customizable styling in webflow designer panel.

## Features

- ✨ **Syntax Highlighting** - Supports JavaScript, TypeScript, CSS, HTML, and Python
- 🎨 **Theme Support** - Light and dark themes
- 📋 **Copy to Clipboard** - One-click code copying
- 🔢 **Line Numbers** - Optional line number display
- 📏 **Customizable Size** - Adjustable width and max height
- 🔒 **Read-only Mode** - Prevent editing or allow interactive code editing

## Prerequisites

Before installing this component, make sure you have:

- A Webflow account with either:
  - A Workspace on a Freelancer, Core, Growth, Agency, or Enterprise plan
  - A Webflow site with a CMS, Business, or Enterprise plan
- A Webflow site where you can test the component
- Node.js 20+ and npm 10+ installed
- Basic familiarity with React components and TypeScript

## Installation

### Step 1: Clone or Download the Repository

```bash
git clone <repository-url>
cd codebox-cc
```

Or download the repository as a ZIP file and extract it.

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- CodeMirror and language support packages
- Webflow CLI and React utilities

### Step 3: Share the Library to Webflow

In your terminal, run the following command to upload your library to Webflow:

```bash
npx webflow library share
```

## Using the Component in Webflow

### Step 1: Install the Library on Your Webflow Site

1. Open any Webflow site in your workspace.
2. Open the **Libraries panel** by pressing `L` or clicking the Resources icon in the left sidebar.
3. Find your library in the list of available libraries.
4. Install the library by clicking the **Install** icon next to your library.

### Step 2: Add the Component to Your Page

1. Open the **Components panel** by clicking the Components icon in the left sidebar.
2. Scroll to the section for the library you just installed. You should see the **CodeBox** component listed under the **CodeCompV1** group.
3. Click and drag the CodeBox component from the components panel onto your page.

### Step 3: Customize the Component

Customize your component in the **Properties panel** on the right. You'll see the following configurable properties:

#### Code Properties

- **Code** (Rich Text): Paste or type your code. Supports multiline via Rich Text.
  - Default: `// Enter your code here\nfunction hello() {\n  console.log("Hello, World!");\n}`

- **Language** (Variant): Choose the syntax highlighting language.
  - Options: `javascript`, `typescript`, `css`, `html`, `python`
  - Default: `javascript`

- **Theme** (Variant): Pick the editor color theme.
  - Options: `light`, `dark`
  - Default: `light`

- **Show Line Numbers** (Boolean): Toggle line numbers in the gutter.
  - Default: `true`

- **Read Only** (Boolean): Disable editing inside the code editor when enabled.
  - Default: `true`

- **Max Height (rem)** (Number): Editor height in rem. Set 0 for minimal height.
  - Range: 0 - 62.5
  - Default: `25`

- **Width** (Text): Editor width. Accepts %, rem, px (e.g., `100%`, `50rem`, `800px`).
  - Default: `100%`

## Component Structure

```
code-components/
├── src/
│   ├── components/
│   │   └── CodeBoxRich/
│   │       ├── CodeBoxRich.tsx      # Main component implementation
│   │       ├── CodeBoxRich.css      # Component styles
│   │       ├── codeBoxRich.webflow.tsx  # Webflow component definition
│   │       └── types.ts            # TypeScript type definitions
│   └── styles/
│       └── index.css                # Shared styles
├── package.json
├── webflow.json                     # Webflow library configuration
└── README.md
```

## Development

### Project Structure

This is a Webflow code component library built with React and TypeScript. The component uses:

- **CodeMirror** for syntax highlighting and code editing
- **React** for component logic
- **Webflow React** utilities for component declaration

### Key Files

- `src/components/CodeBoxRich/CodeBoxRich.tsx` - Main React component
- `src/components/CodeBoxRich/codeBoxRich.webflow.tsx` - Webflow component definition with props
- `src/components/CodeBoxRich/CodeBoxRich.css` - Component-specific styles
- `webflow.json` - Library configuration file

## Troubleshooting

### Component Not Appearing in Webflow

- Make sure you've run `npx webflow library share` successfully
- Verify the library is installed on your Webflow site
- Check that you're using a compatible Webflow plan

### Syntax Highlighting Not Working

- Ensure you've selected the correct language variant
- Check that your code is properly formatted in the Rich Text field

### Styling Issues

- The component includes its own CSS. Make sure the CSS file is being imported correctly
- Check for any conflicting styles in your Webflow project

## Resources

- [Webflow Code Components Documentation](https://developers.webflow.com/code-components/introduction)
