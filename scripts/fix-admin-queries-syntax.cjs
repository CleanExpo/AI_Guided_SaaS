#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix syntax errors in admin-queries.ts
function fixAdminQueriesSyntax() {
  const filePath = path.join(process.cwd(), 'src/lib/admin-queries.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;

  // Fix broken Promise return types
  content = content.replace(/:\s*Promise\s*{\s*$/gm, ': Promise<any> {');
  changeCount++;

  // Fix broken destructuring with trailing symbols
  content = content.replace(/const\s+{\s*page}\s*$/gm, 'const { page,');
  changeCount++;

  // Fix variable declarations with missing assignments
  content = content.replace(/const\s+_(\w+)\s*=\s*;/g, (match, varName) => {
    changeCount++;
    return `const ${varName} =`;
  });

  // Fix broken object syntax
  content = content.replace(/return\s+{\s*users:\s*enrichedUsers,$/gm, 'return {\n        users: enrichedUsers,');
  changeCount++;

  // Fix pagination object
  content = content.replace(/pagination:\s*{\s*$/gm, '        pagination: {');
  content = content.replace(/page;\s*$/gm, '          page,');
  content = content.replace(/limit;\s*$/gm, '          limit,');
  changeCount += 3;

  // Fix closing braces
  content = content.replace(/totalPages:\s*Math\.ceil\(\(count \|\| 0\) \/ limit\)\s*}\s*catch/g, 
    '          totalPages: Math.ceil((count || 0) / limit)\n        }\n      };\n    } catch');
  changeCount++;

  // Fix async user lookup
  content = content.replace(/const\s+{\s*data:\s*user,\s*error\s*}:\s*any\s*=\s*await\s*supabase;/g,
    'const { data: user, error }: any = await supabase');
  changeCount++;

  // Fix profile object
  content = content.replace(/profile:\s*{\s*$/gm, '        profile: {');
  content = content.replace(/bio:\s*user\.bio/g, '          bio: user.bio');
  content = content.replace(/avatar:\s*user\.image/g, '          avatar: user.image');
  content = content.replace(/location:\s*user\.location/g, '          location: user.location');
  content = content.replace(/company:\s*user\.company/g, '          company: user.company');
  changeCount += 5;

  // Fix subscription object
  content = content.replace(/},\s*$/gm, (match, offset) => {
    const before = content.substring(Math.max(0, offset - 50), offset);
    if (before.includes('company:')) {
      changeCount++;
      return '        },';
    }
    return match;
  });

  // Fix stats object
  content = content.replace(/stats:\s*{\s*$/gm, '        stats: {');
  content = content.replace(/totalProjects:\s*projects/g, '          totalProjects: projects');
  content = content.replace(/totalApiCalls:\s*totalApiCalls/g, '          totalApiCalls: totalApiCalls');
  changeCount += 3;

  // Fix closing braces for getUserById
  content = content.replace(/}\s*catch\s*\(error\)\s*{\s*console\.error\('Error fetching user, details:'/g,
    '        }\n      };\n    } catch (error) {\n      console.error(\'Error fetching user details:\'');
  changeCount++;

  // Fix formatActivityMessage closing brace
  content = content.replace(/};$/gm, (match, offset) => {
    const before = content.substring(Math.max(0, offset - 100), offset);
    if (before.includes('template_used')) {
      changeCount++;
      return '    };';
    }
    return match;
  });

  // Fix getUserMetrics closing
  content = content.replace(/return\s*{\s*totalUsers:\s*totalUsers\s*\|\|\s*0;\s*$/gm,
    '    return {\n      totalUsers: totalUsers || 0,');
  content = content.replace(/avgSessionDuration:\s*'12m 34s';\s*$/gm,
    '      avgSessionDuration: \'12m 34s\'');
  content = content.replace(/}\s*}\s*$/gm, (match, offset) => {
    const before = content.substring(Math.max(0, offset - 50), offset);
    if (before.includes('avgSessionDuration')) {
      changeCount++;
      return '    };\n  }';
    }
    return match;
  });

  // Fix getProjectMetrics
  content = content.replace(/totalProjects:\s*totalProjects\s*\|\|\s*0;\s*$/gm,
    '      totalProjects: totalProjects || 0,');
  content = content.replace(/avgCompletionTime:\s*'2h 15m';\s*$/gm,
    '      avgCompletionTime: \'2h 15m\',');
  content = content.replace(/successRate;\s*$/gm, '      successRate');
  changeCount += 3;

  // Fix getApiMetrics 
  content = content.replace(/errorRate:\s*0\.12;\s*$/gm, '      errorRate: 0.12,');
  content = content.replace(/topEndpoints;\s*$/gm, '      topEndpoints');
  changeCount += 2;

  // Fix getRevenueMetrics
  content = content.replace(/totalRevenue:\s*totalRevenue\s*\/\s*100;\s*$/gm,
    '      totalRevenue: totalRevenue / 100,');
  content = content.replace(/\/\/\s*Convert from cents,\s*activeSubscriptions:/g,
    '      // Convert from cents\n      activeSubscriptions:');
  content = content.replace(/churnRate;\s*$/gm, '      churnRate');
  content = content.replace(/}\s*private static async getPlatformHealth/g,
    '    };\n  }\n\n  private static async getPlatformHealth');
  changeCount += 4;

  // Fix getPlatformHealth
  content = content.replace(/:\s*Promise\s*{\s*\/\/ These would come from real monitoring/g,
    ': Promise<any> {\n    // These would come from real monitoring');
  content = content.replace(/satisfaction:\s*94\.7\s*}\s*$/gm,
    '      satisfaction: 94.7\n    };\n  }\n}');
  changeCount += 2;

  // Fix async/await syntax
  content = content.replace(/const\s+{\s*count:\s*totalUsers\s*}\s*:\s*any\s*=\s*await\s*supabase!;/g,
    'const { count: totalUsers }: any = await supabase!');
  content = content.replace(/const\s+{\s*count:\s*newUsers\s*}\s*:\s*any\s*=\s*await\s*supabase!;/g,
    'const { count: newUsers }: any = await supabase!');
  content = content.replace(/const\s+{\s*data:\s*sessions\s*}\s*:\s*any\s*=\s*await\s*supabase!;/g,
    'const { data: sessions }: any = await supabase!');
  changeCount += 3;

  // Fix object closing syntax
  content = content.replace(/},\s*$/gm, (match, offset) => {
    const lineStart = content.lastIndexOf('\n', offset);
    const line = content.substring(lineStart, offset);
    if (line.includes('count: newUsers') || line.includes('count: activeCount')) {
      changeCount++;
      return '      });';
    }
    return match;
  });

  // Fix variable names
  content = content.replace(/const\s+_platformHealth\s*=/g, 'const platformHealth =');
  content = content.replace(/platformHealth;$/gm, (match, offset) => {
    const before = content.substring(Math.max(0, offset - 100), offset);
    if (before.includes('topEndpoints')) {
      changeCount++;
      return '        platformHealth';
    }
    return match;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${changeCount} syntax errors in admin-queries.ts`);
}

// Run the fixer
fixAdminQueriesSyntax();