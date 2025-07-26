const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/app/admin/agent-monitor/page.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix missing div closing tag
      if (lines[15] && lines[15].includes('<h1 className="text-3xl font-bold">Agent Monitoring</h1>')) {
        lines[16] = '      </div>';
      }
      
      // Fix missing div closing tags for cards
      if (lines[45] && lines[45].includes('<div className="text-2xl font-bold">12')) {
        lines[45] = '                <div className="text-2xl font-bold">12</div>';
      }
      if (lines[55] && lines[55].includes('<div className="text-2xl font-bold">3')) {
        lines[55] = '                <div className="text-2xl font-bold">3</div>';
      }
      
      // Fix TabsContent closing tags
      if (lines[62] && lines[62].includes('<AgentPulseMonitor />')) {
        lines[63] = '        </TabsContent>';
      }
      if (lines[66] && lines[66].includes('<ContainerMonitor />')) {
        lines[67] = '        </TabsContent>';
      }
      if (lines[70] && lines[70].includes('<SystemMetrics />')) {
        lines[71] = '        </TabsContent>';
      }
      if (lines[74] && lines[74].includes('<AlertsPanel />')) {
        lines[75] = '        </TabsContent>';
      }
      
      // Fix overall structure closing
      if (lines[77] && lines[77].includes('</Tabs>')) {
        lines[78] = '    </div>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api-docs/page.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix Button closing tag
      if (lines[69] && lines[69].includes('View Docs') && !lines[69].includes('</Button>')) {
        lines[69] = '                      View Docs</Button>';
      }
      
      // Fix code closing tag
      if (lines[85] && lines[85].includes('curl -H') && !lines[85].includes('</code>')) {
        lines[86] = '                curl -H "Authorization: Bearer YOUR_API_KEY" https://api.aiguidedsaas.com/v1/</code>';
      }
      
      // Fix missing closing divs
      if (lines[75] && lines[75].includes('))}')) {
        lines[76] = '        </div>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/admin-direct/page.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix Button closing tag
      if (lines[54] && lines[54].includes('{isLoading ? \'Authenticating...\' : \'Access Admin\'}')) {
        lines[55] = '              {isLoading ? \'Authenticating...\' : \'Access Admin\'}</Button>';
        lines[56] = '          </form>';
      }
      
      // Fix Card closing tags
      if (lines[58] && lines[58].includes('</CardContent>')) {
        lines[59] = '      </Card>';
        lines[60] = '    </div>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/components/Dashboard.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix Link closing tags
      if (lines[211] && lines[211].includes('Projects') && !lines[211].includes('</Link>')) {
        lines[211] = '                Projects</Link>';
      }
      if (lines[217] && lines[217].includes('Analytics') && !lines[217].includes('</Link>')) {
        lines[217] = '                Analytics</Link>';
      }
      if (lines[220] && lines[220].includes('Settings') && !lines[220].includes('</Link>')) {
        lines[220] = '                Settings</Link>';
      }
      
      // Fix nav closing tag
      if (lines[221] && !lines[221].includes('</Link>')) {
        lines[222] = '            </nav>';
      }
      
      // Fix Button closing tags
      if (lines[227] && lines[227].includes('<Search className="w-5 h-5" />')) {
        lines[227] = '                <Search className="w-5 h-5" /></Button>';
      }
      if (lines[229] && lines[229].includes('<Bell className="w-5 h-5" />')) {
        lines[229] = '                <Bell className="w-5 h-5" /></Button>';
      }
      if (lines[238] && lines[238].includes('<LogOut className="w-5 h-5" />')) {
        lines[238] = '                  <LogOut className="w-5 h-5" /></Button>';
      }
      
      // Fix p closing tag
      if (lines[251] && lines[251].includes("Here's what's happening")) {
        lines[251] = '            <p className="text-gray-600 mt-1">Here\'s what\'s happening with your projects today.</p>';
      }
      
      // Fix closing p tags in stat cards
      if (lines[266] && lines[266].includes('{stat.change}')) {
        lines[266] = '                  <p className="text-xs text-gray-600 mt-1">{stat.change}</p>';
      }
      
      // Fix closing p tags in quick actions
      if (lines[286] && lines[286].includes('{action.description}')) {
        lines[286] = '                    <p className="text-sm text-gray-600">{action.description}</p>';
      }
      
      // Fix Button closing tag
      if (lines[300] && lines[300].includes('New Project')) {
        lines[300] = '                New Project</Button>';
      }
      
      // Fix CardTitle closing tag
      if (lines[308] && lines[308].includes('{project.name}')) {
        lines[308] = '                      <CardTitle className="text-lg">{project.name}</CardTitle>';
      }
      
      // Fix Badge closing tag
      if (lines[311] && lines[311].includes('{project.status}')) {
        lines[311] = '                        {project.status}</Badge>';
      }
      
      // Fix span closing tags
      if (lines[319] && lines[319].includes('Last deploy:')) {
        lines[319] = '                        <span className="text-gray-600">Last deploy:</span>';
        lines[320] = '                        <span className="font-medium">{project.lastDeploy}</span>';
      }
      
      if (lines[327] && lines[327].includes('Users')) {
        lines[327] = '                              <span className="text-gray-600">Users</span>';
        lines[328] = '                              <span className="font-medium">{project.metrics.users}</span>';
      }
      
      if (lines[331] && lines[331].includes('API Calls')) {
        lines[331] = '                              <span className="text-gray-600">API Calls</span>';
        lines[332] = '                              <span className="font-medium">{project.metrics.apiCalls.toLocaleString()}</span>';
      }
      
      if (lines[335] && lines[335].includes('Uptime')) {
        lines[335] = '                              <span className="text-gray-600">Uptime</span>';
        lines[336] = '                              <span className="font-medium">{project.metrics.uptime}%</span>';
      }
      
      // Fix Button closing tags in project cards
      if (lines[343] && lines[343].includes('View Live')) {
        lines[343] = '                              View Live</Button>';
      }
      
      if (lines[347] && lines[347].includes('Settings')) {
        lines[347] = '                              Settings</Button>';
      }
      
      // Fix p closing tag
      if (lines[355] && lines[355].includes('Building... 45%')) {
        lines[355] = '                          <p className="text-sm text-gray-600 text-center">Building... 45%</p>';
      }
      
      // Fix span closing tags in resource usage
      if (lines[374] && lines[374].includes('CPU Usage')) {
        lines[374] = '                      <span className="text-sm text-gray-600">CPU Usage</span>';
        lines[375] = '                      <span className="text-sm font-medium">32%</span>';
      }
      
      if (lines[381] && lines[381].includes('Memory')) {
        lines[381] = '                      <span className="text-sm text-gray-600">Memory</span>';
        lines[382] = '                      <span className="text-sm font-medium">2.4GB / 8GB</span>';
      }
      
      if (lines[388] && lines[388].includes('Storage')) {
        lines[388] = '                      <span className="text-sm text-gray-600">Storage</span>';
        lines[389] = '                      <span className="text-sm font-medium">45GB / 100GB</span>';
      }
      
      // Fix header closing tag
      if (lines[243] && lines[243].includes('</div>')) {
        lines[244] = '      </header>';
      }
      
      // Ensure the component ends correctly
      const lastLines = content.split('\n');
      if (lastLines[lastLines.length - 2] && lastLines[lastLines.length - 2].includes('</main>')) {
        lastLines[lastLines.length - 1] = '  );\n}';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/analytics/page.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix CardHeader closing tags
      if (lines[63] && lines[63].includes('<Users className="h-4 w-4 text-muted-foreground" />')) {
        lines[63] = '            <Users className="h-4 w-4 text-muted-foreground" /></CardHeader>';
      }
      
      if (lines[74] && lines[74].includes('<Activity className="h-4 w-4 text-muted-foreground" />')) {
        lines[74] = '            <Activity className="h-4 w-4 text-muted-foreground" /></CardHeader>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/about/page.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix p closing tag
      if (lines[24] && lines[24].includes('To democratize software development')) {
        lines[24] = '                To democratize software development by providing intelligent, AI-driven tools that bridge the gap between no-code simplicity and professional development power.</p>';
      }
      
      // Fix ul closing tag
      if (lines[35] && lines[35].includes('<li>Continuous learning')) {
        lines[36] = '              </ul>';
      }
      
      // Fix section closing tags
      if (lines[37] && lines[37].includes('</section>')) {
        lines[38] = '          </div>';
        lines[39] = '        </Card>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api-docs/[slug]/page.tsx',
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix missing closing div
      if (lines[39] && lines[39].includes('<p>The requested API documentation could not be found.</p>')) {
        lines[40] = '      </div>';
      }
      
      // Fix span closing tags
      if (lines[51] && lines[51].includes('{doc.category}')) {
        lines[51] = '            {doc.category}</span>';
      }
      
      if (lines[54] && lines[54].includes('{doc.version}')) {
        lines[54] = '            {doc.version}</span>';
      }
      
      return lines.join('\n');
    }
  }
];

console.log('Fixing specific JSX errors for deployment...\n');

let totalFixed = 0;

fixes.forEach(fix => {
  try {
    const filePath = path.join(__dirname, fix.file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    content = fix.fix(content);
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${fix.file}`);
      totalFixed++;
    } else {
      console.log(`⚠️  No changes needed in ${fix.file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${fix.file}:`, error.message);
  }
});

console.log(`\n✅ Total files fixed: ${totalFixed}`);