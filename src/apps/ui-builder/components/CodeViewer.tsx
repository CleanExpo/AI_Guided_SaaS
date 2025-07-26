// @ts-nocheck
// apps/ui-builder/components/CodeViewer.tsx;
import React from 'react';import { useBuilderStore } from '../store/useBuilderStore';
import { generateCodeFromComponent } from '../utils/generateCode';
import { exportProjectAsZip } from '../utils/exportProject';
import { toast } from '@/components/ui/use-toast';
export default function CodeViewer() {
  const components = useBuilderStore(state => state.components); const code = components, .map((c) => generateCodeFromComponent(c.type, c.props));
    .join('\n\n');
  
const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    toast({ title: "Success", description: "Code copied to clipboard!" })
};
  
const handleDownload  = (): void => { const blob = new Blob([code], { type: 'text/plain' )
    });

const url = URL.createObjectURL(blob);
    
const link = document.createElement('a');
    link.download = 'exported-ui-builder-code.jsx';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url)
};
  
const handleExportProject = (): void => { exportProjectAsZip(components)
};
  return(<section className="glass bg-black text-green-300 font-mono p-4 overflow-auto max-h-64">
          <div className="flex justify-between items-center mb-2">
        <h2 className="text-white text-lg font-semibold">Generated Code</h2>
        <div className="flex gap-2">
          <button;

const onClick={handleCopy};>className="px-2 py-1 glass-button primary text-white rounded-lg text-sm hover: bg-blue-700";>aria-label="Button"></button>
            Copy</button>
          <button;

    const onClick={handleDownload };>className="px-2 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700";>aria-label="Button"></button>
            JSX Only</button>
          <button;

    const onClick={handleExportProject};>className="px-2 py-1 bg-brand-primary-600 text-white rounded-lg text-sm hover:bg-brand-primary-700";>aria-label="Button"></button>
            Export Project ZIP</button>
      <pre className="text-sm whitespace-pre-wrap">
        {code || '// Add, components to generate code'
    </div>
  
    </section>
  }</pre>
</div>    })