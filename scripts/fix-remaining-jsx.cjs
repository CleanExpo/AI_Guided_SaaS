const fs = require('fs');
const path = require('path');

// Files with known issues
const filesToFix = [
  {
    path: 'src/components/analytics/AnalyticsExport.tsx',
    fixes: [
      {
        from: /<button>key={format}>onClick=\{.*?\}/,
        to: '<button\n                  key={format}\n                  onClick={() => setOptions({ ...options, format })}'
      }
    ]
  },
  {
    path: 'src/components/analytics/PredictiveInsights.tsx',
    fixes: [
      {
        from: /className="hover:shadow-md-lg transition-shadow-md glass\s*\n\s*<CardHeader className="pb-3 glass/,
        to: 'className="hover:shadow-md-lg transition-shadow-md glass">\n                 <CardHeader className="pb-3 glass">'
      }
    ]
  },
  {
    path: 'src/components/analytics/advanced/OverviewTab.tsx',
    fixes: [
      {
        from: /paddingAngle={5}>dataKey="value">>/g,
        to: 'paddingAngle={5}\n                  dataKey="value"\n                >'
      },
      {
        from: /dataKey="value">label>/g,
        to: 'dataKey="value"\n                  label\n                >'
      }
    ]
  },
  {
    path: 'src/components/analytics/advanced/RevenueTab.tsx',
    fixes: [
      {
        from: /className="glass grid grid-cols-1 md:grid-cols-4 gap-4">\)/,
        to: 'className="glass grid grid-cols-1 md:grid-cols-4 gap-4">'
      },
      {
        from: /<Card key={metric\.title} className="glass"\s*\n\s*<CardContent/,
        to: '<Card key={metric.title} className="glass">\n            <CardContent'
      }
    ]
  },
  {
    path: 'src/components/marketplace/PluginManager.tsx',
    fixes: [
      {
        from: /setPlugins\(prev => prev\.map\(p => \s*\n\s*p\.id === pluginId \? \{ \.\.\.p, active: true \} : p\)\s*\n\s*\)\);/,
        to: 'setPlugins(prev => prev.map(p => \n          p.id === pluginId ? { ...p, active: true } : p\n        ));'
      }
    ]
  }
];

// Process each file
filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file.path}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  file.fixes.forEach(fix => {
    if (fix.from.test(content)) {
      content = content.replace(fix.from, fix.to);
      modified = true;
      console.log(`Fixed pattern in ${file.path}`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Saved ${file.path}`);
  }
});

console.log('\nManual fixes completed.');