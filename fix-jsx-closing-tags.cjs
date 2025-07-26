const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/components/Dashboard.tsx',
    line: 205,
    issue: 'Missing closing tag for span',
    fix: (content) => {
      const lines = content.split('\n');
      if (lines[204] && lines[204].includes('<span className="text-xl font-bold">AI Platform')) {
        lines[204] = '                <span className="text-xl font-bold">AI Platform</span>';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/about/page.tsx',
    line: 25,
    issue: 'Missing closing tag for p',
    fix: (content) => {
      const lines = content.split('\n');
      if (lines[24] && lines[24].includes('To democratize software development')) {
        lines[24] = '                To democratize software development by providing intelligent, AI-driven tools that bridge the gap between no-code simplicity and professional development power.</p>';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/admin-direct/page.tsx',
    line: 53,
    issue: 'Missing closing tag for p and extra brace',
    fix: (content) => {
      const lines = content.split('\n');
      if (lines[52] && lines[52].includes('{error && <p className="text-red-600 text-sm">{error}}')) {
        lines[52] = '            {error && <p className="text-red-600 text-sm">{error}</p>}';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/admin/agent-monitor/page.tsx',
    line: 35,
    issue: 'Missing closing tag for div',
    fix: (content) => {
      const lines = content.split('\n');
      if (lines[34] && lines[34].includes('<div className="text-2xl font-bold text-green-600">Healthy')) {
        lines[34] = '                <div className="text-2xl font-bold text-green-600">Healthy</div>';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/analytics/page.tsx',
    line: 42,
    issue: 'Missing closing tag',
    fix: (content) => {
      const lines = content.split('\n');
      if (lines[41] && lines[41].includes('setIsLoading(false)')) {
        lines[41] = '      setIsLoading(false);';
      }
      if (lines[42] && lines[42].includes('}, 1000)')) {
        lines[42] = '    }, 1000);';
      }
      if (lines[43] && lines[43].includes('}, []);')) {
        lines[43] = '  }, []);';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api-docs/page.tsx',
    lines: [43, 47, 48, 56, 58, 59, 62, 67, 70, 73, 81, 87],
    issue: 'Missing closing tags throughout file',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix line 43: <Code className="w-8 h-8 text-blue-600 mr-3"  />
      if (lines[42] && lines[42].includes('<Code className="w-8 h-8 text-blue-600 mr-3"  />')) {
        lines[42] = '            <Code className="w-8 h-8 text-blue-600 mr-3" />';
      }
      
      // Fix line 44: missing closing tag
      if (lines[44] && lines[44].includes('</h1>')) {
        lines[44] = '          </div>';
      }
      
      // Fix line 47: missing closing tag for p
      if (lines[47] && lines[47].includes('Complete reference for integrating with the AI Guided SaaS Platform API')) {
        lines[47] = '            Complete reference for integrating with the AI Guided SaaS Platform API</p>';
      }
      
      // Fix line 48: extra closing tag
      if (lines[48] && lines[48].trim() === '') {
        lines[48] = '        </div>';
      }
      
      // Fix line 56: missing closing tag for CardTitle
      if (lines[55] && lines[55].includes('<CardTitle className="text-lg glass">{endpoint.name}')) {
        lines[55] = '                  <CardTitle className="text-lg glass">{endpoint.name}</CardTitle>';
      }
      
      // Fix line 59: missing closing tag for Badge
      if (lines[58] && lines[58].includes('{endpoint.status}')) {
        lines[58] = '                    {endpoint.status}</Badge>';
      }
      
      // Fix line 60: extra closing tag
      if (lines[59] && lines[59].trim() === '') {
        lines[59] = '                </div>';
      }
      
      // Fix line 61: extra closing tag
      if (lines[60] && lines[60].trim() === '') {
        lines[60] = '              </CardHeader>';
      }
      
      // Fix line 63: missing closing tag for p
      if (lines[62] && lines[62].includes('<p className="text-gray-600 mb-4">{endpoint.description}')) {
        lines[62] = '                <p className="text-gray-600 mb-4">{endpoint.description}</p>';
      }
      
      // Fix line 65: missing closing tag for span
      if (lines[64] && lines[64].includes('<span className="text-sm text-gray-500">Version {endpoint.version}')) {
        lines[64] = '                  <span className="text-sm text-gray-500">Version {endpoint.version}</span>';
      }
      
      // Fix line 68: missing closing tag
      if (lines[68] && lines[68].includes('<ExternalLink className="w-4 h-4 mr-2"   />')) {
        lines[68] = '                      <ExternalLink className="w-4 h-4 mr-2" />';
      }
      
      // Fix line 70: missing closing tag for Button
      if (lines[69] && lines[69].includes('View Docs')) {
        lines[69] = '                      View Docs</Button>';
      }
      
      // Fix line 71-73: missing closing tags
      if (lines[70] && lines[70].trim() === '') {
        lines[70] = '                  </Link>';
      }
      if (lines[71] && lines[71].trim() === '') {
        lines[71] = '                </div>';
      }
      if (lines[72] && lines[72].trim() === '') {
        lines[72] = '              </CardContent>';
      }
      if (lines[73] && lines[73].trim() === '') {
        lines[73] = '            </Card>';
      }
      
      // Fix line 82: missing closing tag for p
      if (lines[81] && lines[81].includes('To get started with our API')) {
        lines[81] = '            To get started with our API, you\'ll need to authenticate using your API key.</p>';
      }
      
      // Fix line 87: missing closing tag for code
      if (lines[86] && lines[86].includes('curl -H "Authorization: Bearer YOUR_API_KEY"')) {
        lines[86] = '                curl -H "Authorization: Bearer YOUR_API_KEY" https://api.aiguidedsaas.com/v1/</code>';
      }
      
      // Fix closing tags at the end
      if (lines[87] && lines[87].trim() === '') {
        lines[87] = '            </div>';
      }
      if (lines[88] && lines[88].trim() === '') {
        lines[88] = '          </div>';
      }
      if (lines[89] && lines[89].trim() === '') {
        lines[89] = '        </div>';
      }
      if (lines[90] && lines[90].trim() === '') {
        lines[90] = '      </div>';
      }
      if (lines[91] && lines[91].trim() === '') {
        lines[91] = '    </div>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api-docs/[slug]/page.tsx',
    lines: [40, 42, 59, 60],
    issue: 'Missing closing tags',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix line 40: missing closing tag for p
      if (lines[39] && lines[39].includes('<p>The requested API documentation could not be found.</p>')) {
        lines[39] = '        <p>The requested API documentation could not be found.</p></div>';
      }
      
      // Fix line 41: remove extra closing tag
      if (lines[40] && lines[40].trim() === '') {
        lines[40] = '    );';
      }
      
      // Fix line 42: ensure closing brace
      if (lines[41] && lines[41] === '}') {
        lines[41] = '  }';
      }
      
      // Fix line 52: missing closing tag for span
      if (lines[51] && lines[51].includes('{doc.category}')) {
        lines[51] = '            {doc.category}</span>';
      }
      
      // Fix line 55: missing closing tag for span  
      if (lines[54] && lines[54].includes('{doc.version}')) {
        lines[54] = '            {doc.version}</span>';
      }
      
      // Fix line 56-57: missing closing tags
      if (lines[55] && lines[55].trim() === '') {
        lines[55] = '        </div>';
      }
      if (lines[56] && lines[56].trim() === '') {
        lines[56] = '      </div>';
      }
      
      // Fix line 59: missing closing tag for pre
      if (lines[58] && lines[58].includes('<pre className="whitespace-pre-wrap text-sm">{doc.content}')) {
        lines[58] = '        <pre className="whitespace-pre-wrap text-sm">{doc.content}</pre>';
      }
      
      // Fix line 60-61: missing closing tags
      if (lines[59] && lines[59].trim() === '') {
        lines[59] = '      </div>';
      }
      if (lines[60] && lines[60].trim() === '') {
        lines[60] = '    </div>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/analytics/page.tsx',
    lines: [62, 67, 73, 78],
    issue: 'Missing closing tags for CardTitle and p elements',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix line 62: missing closing tag for CardTitle
      if (lines[61] && lines[61].includes('<CardTitle className="text-sm font-medium glass">Total Users')) {
        lines[61] = '            <CardTitle className="text-sm font-medium glass">Total Users</CardTitle>';
      }
      
      // Fix line 64: missing closing tag for CardHeader
      if (lines[63] && lines[63].includes('<Users className="h-4 w-4 text-muted-foreground" />')) {
        lines[63] = '            <Users className="h-4 w-4 text-muted-foreground" /></CardHeader>';
      }
      
      // Fix line 67: missing closing tag for p
      if (lines[66] && lines[66].includes('<p className="text-xs text-muted-foreground">Total registered users')) {
        lines[66] = '            <p className="text-xs text-muted-foreground">Total registered users</p>';
      }
      
      // Fix line 68-69: missing closing tags
      if (lines[67] && lines[67].trim() === '') {
        lines[67] = '          </CardContent>';
      }
      if (lines[68] && lines[68].trim() === '') {
        lines[68] = '        </Card>';
      }
      
      // Fix line 73: missing closing tag for CardTitle
      if (lines[72] && lines[72].includes('<CardTitle className="text-sm font-medium glass">Active Users')) {
        lines[72] = '            <CardTitle className="text-sm font-medium glass">Active Users</CardTitle>';
      }
      
      // Fix line 75: missing closing tag for CardHeader
      if (lines[74] && lines[74].includes('<Activity className="h-4 w-4 text-muted-foreground" />')) {
        lines[74] = '            <Activity className="h-4 w-4 text-muted-foreground" /></CardHeader>';
      }
      
      // Fix line 78: missing closing tag for p
      if (lines[77] && lines[77].includes('<p className="text-xs text-muted-foreground">Active in last 24h')) {
        lines[77] = '            <p className="text-xs text-muted-foreground">Active in last 24h</p>';
      }
      
      // Fix line 79-80: missing closing tags
      if (lines[78] && lines[78].trim() === '') {
        lines[78] = '          </CardContent>';
      }
      if (lines[79] && lines[79].trim() === '') {
        lines[79] = '        </Card>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api/collaboration/rooms/route.ts',
    line: 65,
    issue: 'Syntax error in return statement',
    fix: (content) => {
      const lines = content.split('\n');
      if (lines[64] && lines[64].includes('return NextResponse.json({ success: true, rooms    })')) {
        lines[64] = '        return NextResponse.json({ success: true, rooms });';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api/analytics/route.ts',
    lines: [60, 61, 62],
    issue: 'Syntax error in logger.info call',
    fix: (content) => {
      const lines = content.split('\n');
      // Fix logger.info call with proper object syntax
      if (lines[59] && lines[59].includes('logger.info(\'Analytics event tracked\', { event,')) {
        lines[59] = '            logger.info(\'Analytics event tracked\', {';
        lines[60] = '                event,';
        lines[61] = '                properties,';
        lines[62] = '                timestamp,';
        lines[63] = '                userId';
        lines[64] = '            });';
      }
      return lines.join('\n');
    }
  }
];

console.log('Fixing JSX closing tag errors...\n');

let totalFixed = 0;

fixes.forEach(fix => {
  try {
    const filePath = path.join(__dirname, fix.file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    content = fix.fix(content);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${fix.file} - ${fix.issue}`);
      totalFixed++;
    } else {
      console.log(`⚠️  No changes needed in ${fix.file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${fix.file}:`, error.message);
  }
});

console.log(`\n✅ Total files fixed: ${totalFixed}`);