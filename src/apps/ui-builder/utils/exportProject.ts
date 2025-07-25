/* BREADCRUMB: unknown - Purpose to be determined */
// @ts-nocheck
// apps/ui-builder/utils/exportProject.ts

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateCodeFromComponent } from './generateCode';

type ComponentInstance = {
  id: string;
  type: string;
  props: { [key: string]: string };
};

export const exportProjectAsZip = (components: ComponentInstance[]) => {
  const zip = new JSZip();
  
  const componentBlocks = components
    .map((c) => generateCodeFromComponent(c.type, c.props))
    .join('\n\n');
  
  const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Guided UI Builder Export</title>
  <link href="style.css" rel="stylesheet" />
</head>
<body className="bg-gray-100 p-8 font-sans">
  <div className="max-w-4xl mx-auto space-y-4">
    ${componentBlocks}
  </div>
</body>
</html>`;

  const styleCSS = `@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');`;

  zip.file('index.html', indexHTML);
  zip.file('style.css', styleCSS);
  
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, 'ai-builder-export.zip');
  });
};