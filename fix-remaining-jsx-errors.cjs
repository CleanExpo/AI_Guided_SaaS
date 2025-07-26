const fs = require('fs');
const path = require('path');

const fixes = [
  {
    file: 'src/app/about/page.tsx',
    line: 25,
    fix: (content) => {
      // The p tag needs closing on line 25
      const lines = content.split('\n');
      if (lines[24] && lines[24].includes('To democratize software development') && !lines[24].includes('</p>')) {
        lines[24] = '                To democratize software development by providing intelligent, AI-driven tools that bridge the gap between no-code simplicity and professional development power.</p>';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/admin-direct/page.tsx',
    lines: [56, 57],
    fix: (content) => {
      const lines = content.split('\n');
      // Fix missing closing tags for Button and form
      if (lines[55] && lines[55].includes('</Button>')) {
        // Button is already closed, check for form
        if (lines[56] && lines[56].trim() === '') {
          lines[56] = '          </form>';
        }
      } else if (lines[55] && lines[55].includes('{isLoading ? \'Authenticating...\' : \'Access Admin\'}')) {
        lines[55] = '              {isLoading ? \'Authenticating...\' : \'Access Admin\'}</Button>';
        lines[56] = '          </form>';
      }
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/admin/agent-monitor/page.tsx',
    lines: [20, 21, 22, 23, 24, 46, 56, 64, 68, 72, 76],
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix TabsTrigger closing tags
      if (lines[19] && lines[19].includes('<TabsTrigger value="overview">Overview')) {
        lines[19] = '          <TabsTrigger value="overview">Overview</TabsTrigger>';
      }
      if (lines[20] && lines[20].includes('<TabsTrigger value="agents">Agents')) {
        lines[20] = '          <TabsTrigger value="agents">Agents</TabsTrigger>';
      }
      if (lines[21] && lines[21].includes('<TabsTrigger value="containers">Containers')) {
        lines[21] = '          <TabsTrigger value="containers">Containers</TabsTrigger>';
      }
      if (lines[22] && lines[22].includes('<TabsTrigger value="metrics">Metrics')) {
        lines[22] = '          <TabsTrigger value="metrics">Metrics</TabsTrigger>';
      }
      if (lines[23] && lines[23].includes('<TabsTrigger value="alerts">Alerts')) {
        lines[23] = '          <TabsTrigger value="alerts">Alerts</TabsTrigger>';
      }
      
      // Fix div closing tags
      if (lines[45] && lines[45].includes('<div className="text-2xl font-bold">12')) {
        lines[45] = '                <div className="text-2xl font-bold">12</div>';
      }
      if (lines[55] && lines[55].includes('<div className="text-2xl font-bold">3')) {
        lines[55] = '                <div className="text-2xl font-bold">3</div>';
      }
      
      // Fix missing closing tags for sections
      if (lines[58] && lines[58].includes('</Card>')) {
        lines[59] = '          </div>';
        lines[60] = '        </TabsContent>';
      }
      
      // Fix TabsContent closing tags
      if (lines[63] && lines[63].includes('<AgentPulseMonitor />')) {
        lines[64] = '        </TabsContent>';
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
      
      // Fix Tabs closing
      if (lines[76] && lines[76].trim() === '') {
        lines[76] = '      </Tabs>';
      }
      if (lines[77] && lines[77].trim() === '') {
        lines[77] = '    </div>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api-docs/page.tsx',
    lines: [45, 48, 59, 68, 70, 76, 82, 86],
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix closing div after h1
      if (lines[44] && lines[44].includes('</h1>')) {
        if (!lines[45] || lines[45].trim() === '') {
          lines[45] = '          </div>';
        }
      }
      
      // Fix closing p tag
      if (lines[47] && lines[47].includes('Complete reference for integrating') && !lines[47].includes('</p>')) {
        lines[47] = '            Complete reference for integrating with the AI Guided SaaS Platform API</p>';
      }
      
      // Fix Badge closing
      if (lines[58] && lines[58].includes('{endpoint.status}') && !lines[58].includes('</Badge>')) {
        lines[58] = '                    {endpoint.status}</Badge>';
      }
      
      // Fix ExternalLink self-closing
      if (lines[67] && lines[67].includes('<ExternalLink className="w-4 h-4 mr-2"   />')) {
        lines[67] = '                      <ExternalLink className="w-4 h-4 mr-2" />';
      }
      
      // Fix Button closing
      if (lines[69] && lines[69].includes('View Docs') && !lines[69].includes('</Button>')) {
        lines[69] = '                      View Docs</Button>';
      }
      
      // Fix closing div after cards
      if (lines[75] && lines[75].includes('))')) {
        lines[76] = '        </div>';
      }
      
      // Fix code closing tag
      if (lines[85] && lines[85].includes('curl -H') && !lines[85].includes('</code>')) {
        lines[85] = '                curl -H "Authorization: Bearer YOUR_API_KEY" https://api.aiguidedsaas.com/v1/</code>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/api-docs/[slug]/page.tsx',
    line: 40,
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix missing closing div tag
      if (lines[39] && lines[39].includes('<p>The requested API documentation could not be found.</p>')) {
        if (!lines[40] || lines[40].trim() === '') {
          lines[40] = '      </div>';
        }
      }
      
      // Fix closing span tags
      if (lines[51] && lines[51].includes('{doc.category}') && !lines[51].includes('</span>')) {
        lines[51] = '            {doc.category}</span>';
      }
      
      if (lines[54] && lines[54].includes('{doc.version}') && !lines[54].includes('</span>')) {
        lines[54] = '            {doc.version}</span>';
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/app/analytics/page.tsx',
    lines: [64, 75],
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix missing closing tag for CardHeader
      if (lines[63] && lines[63].includes('<Users className="h-4 w-4 text-muted-foreground" />')) {
        if (!lines[64] || !lines[64].includes('</CardHeader>')) {
          lines[64] = '          </CardHeader>';
        }
      }
      
      // Fix missing closing tag for second CardHeader
      if (lines[74] && lines[74].includes('<Activity className="h-4 w-4 text-muted-foreground" />')) {
        if (!lines[75] || !lines[75].includes('</CardHeader>')) {
          lines[75] = '          </CardHeader>';
        }
      }
      
      return lines.join('\n');
    }
  },
  {
    file: 'src/components/Dashboard.tsx',
    lines: [206, 212, 214, 218, 222, 228, 230, 239, 252, 267, 287, 301, 309, 312, 320, 328, 332, 336, 344, 348, 356, 375, 382, 389],
    fix: (content) => {
      const lines = content.split('\n');
      
      // Fix missing closing tags throughout Dashboard
      if (lines[205] && lines[205].includes('</span>')) {
        lines[206] = '              </Link>';
      }
      
      // Fix Link closing tags in navigation
      if (lines[211] && lines[211].includes('Projects') && !lines[211].includes('</Link>')) {
        lines[212] = '              </Link>';
      }
      if (lines[213] && lines[213].includes('Deployments') && !lines[213].includes('</Link>')) {
        lines[214] = '              </Link>';
      }
      if (lines[217] && lines[217].includes('Analytics') && !lines[217].includes('</Link>')) {
        lines[218] = '              </Link>';
      }
      if (lines[221] && lines[221].includes('Settings') && !lines[221].includes('</Link>')) {
        lines[222] = '              </Link>';
      }
      
      // Fix nav closing
      if (lines[222] && lines[222].includes('</Link>')) {
        lines[223] = '            </nav>';
      }
      
      // Fix Button closing tags
      if (lines[227] && lines[227].includes('<Search className="w-5 h-5" />')) {
        lines[228] = '              </Button>';
      }
      if (lines[229] && lines[229].includes('<Bell className="w-5 h-5" />')) {
        lines[230] = '              </Button>';
      }
      if (lines[238] && lines[238].includes('<LogOut className="w-5 h-5" />')) {
        lines[239] = '                </Button>';
      }
      
      // Fix p closing tag
      if (lines[251] && lines[251].includes("Here's what's happening") && !lines[251].includes('</p>')) {
        lines[252] = '          </div>';
      }
      
      // Fix p closing tags in cards
      if (lines[266] && lines[266].includes('{stat.change}') && !lines[266].includes('</p>')) {
        lines[267] = '                </CardContent>';
      }
      
      // Fix p closing in quick actions
      if (lines[286] && lines[286].includes('{action.description}') && !lines[286].includes('</p>')) {
        lines[287] = '                  </CardContent>';
      }
      
      // Fix Button closing in projects section
      if (lines[300] && lines[300].includes('New Project') && !lines[300].includes('</Button>')) {
        lines[301] = '              </Button>';
      }
      
      // Fix CardTitle closing
      if (lines[308] && lines[308].includes('{project.name}') && !lines[308].includes('</CardTitle>')) {
        lines[309] = '                      </CardTitle>';
      }
      
      // Fix Badge closing
      if (lines[311] && lines[311].includes('{project.status}') && !lines[311].includes('</Badge>')) {
        lines[312] = '                      </Badge>';
      }
      
      // Fix span closing tags
      if (lines[319] && lines[319].includes('Last deploy:') && !lines[319].includes('</span>')) {
        lines[320] = '                      </div>';
      }
      
      if (lines[327] && lines[327].includes('Users') && !lines[327].includes('</span>')) {
        lines[328] = '                            </div>';
      }
      
      if (lines[331] && lines[331].includes('API Calls') && !lines[331].includes('</span>')) {
        lines[332] = '                            </div>';
      }
      
      if (lines[335] && lines[335].includes('Uptime') && !lines[335].includes('</span>')) {
        lines[336] = '                            </div>';
      }
      
      // Fix Button closing tags
      if (lines[343] && lines[343].includes('View Live') && !lines[343].includes('</Button>')) {
        lines[344] = '                            </Button>';
      }
      
      if (lines[347] && lines[347].includes('Settings') && !lines[347].includes('</Button>')) {
        lines[348] = '                            </Button>';
      }
      
      // Fix p closing tag
      if (lines[355] && lines[355].includes('Building... 45%') && !lines[355].includes('</p>')) {
        lines[356] = '                        </div>';
      }
      
      // Fix span closing tags in resource usage
      if (lines[374] && lines[374].includes('CPU Usage') && !lines[374].includes('</span>')) {
        lines[375] = '                    </div>';
      }
      
      if (lines[381] && lines[381].includes('Memory') && !lines[381].includes('</span>')) {
        lines[382] = '                    </div>';
      }
      
      if (lines[388] && lines[388].includes('Storage') && !lines[388].includes('</span>')) {
        lines[389] = '                    </div>';
      }
      
      // Fix main and header closing
      if (lines[397] && lines[397].includes('</div>')) {
        lines[398] = '      </main>';
      }
      
      return lines.join('\n');
    }
  }
];

console.log('Fixing remaining JSX errors...\n');

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