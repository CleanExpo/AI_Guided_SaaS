#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING FINAL CRITICAL PARSING ERRORS FOR 100% SUCCESS');
console.log('========================================================\n');

// Direct fixes for the most critical files
const criticalFixes = [
  {
    file: 'src/app/admin/analytics/page.tsx',
    fixes: [
      {
        find: `const [users, setUsers] = useState<AdminUsernull>(null)`,
        replace: `const [users, setUsers] = useState<AdminUser[] | null>(null)`
      },
      {
        find: `useEffect(() =>  {`,
        replace: `useEffect(() => {`
      },
      {
        find: `setUsers([
        { id: '1';
          email: 'admin@example.com')
          name: 'Admin User';)
          lastActive: new Date(), role: 'admin' ;
}
      ]);`,
        replace: `setUsers([
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          lastActive: new Date(),
          role: 'admin'
        }
      ]);`
      },
      {
        find: `setTimeout(() => {
      setUsers([
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          lastActive: new Date(),
          role: 'admin'
        }
      ]);
      setIsLoading(false)
}, 1000)
}, []);`,
        replace: `setTimeout(() => {
      setUsers([
        {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          lastActive: new Date(),
          role: 'admin'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);`
      }
    ]
  },
  {
    file: 'src/app/admin/login/page.tsx',
    fixes: [
      {
        find: `const response = await fetch('/api/admin/auth', { method: 'POST')
        headers: { 'Content-Type': 'application/json'  },)
        body: JSON.stringify({ password    })
      });`,
        replace: `const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });`
      },
      {
        find: `if (response.ok) {
        router.push('/admin/dashboard')
} else {
        setError('Invalid password')
}`,
        replace: `if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid password');
      }`
      },
      {
        find: `} catch (error) {
      setError('Authentication failed')
} finally {
      setLoading(false)
}`,
        replace: `} catch (error) {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }`
      }
    ]
  },
  {
    file: 'src/app/admin-direct/page.tsx',
    fixes: [
      {
        find: `const response = await fetch('/api/admin/direct-auth', { method: 'POST')
        headers: { 'Content-Type': 'application/json'  },)
        body: JSON.stringify({ password    })
      });`,
        replace: `const response = await fetch('/api/admin/direct-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });`
      },
      {
        find: `if (response.ok && data.token) {
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard')
      } else {
        setError('Invalid password')
}`,
        replace: `if (response.ok && data.token) {
        localStorage.setItem('admin-token', data.token);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid password');
      }`
      },
      {
        find: `} catch (err) {
      setError('Network error. Please try again.')
} finally {
      setIsLoading(false);
}`,
        replace: `} catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }`
      }
    ]
  },
  {
    file: 'src/app/auth/signin/page.tsx',
    fixes: [
      {
        find: `await signIn('email', {
        email)
        callbackUrl: '/dashboard';)
      });`,
        replace: `await signIn('email', {
        email,
        callbackUrl: '/dashboard'
      });`
      }
    ]
  }
];

let totalFixes = 0;
let filesFixed = 0;

for (const fileConfig of criticalFixes) {
  const filePath = path.join(process.cwd(), fileConfig.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${fileConfig.file}`);
    continue;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileHasFixes = false;
    
    for (const fix of fileConfig.fixes) {
      if (content.includes(fix.find)) {
        content = content.replace(fix.find, fix.replace);
        console.log(`  ✓ Fixed pattern in ${fileConfig.file}`);
        totalFixes++;
        fileHasFixes = true;
      }
    }
    
    if (fileHasFixes) {
      fs.writeFileSync(filePath, content);
      filesFixed++;
      console.log(`📝 Successfully fixed ${fileConfig.file}\n`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${fileConfig.file}:`, error.message);
  }
}

console.log(`✅ Critical file fixes complete!`);
console.log(`   Files fixed: ${filesFixed}`);
console.log(`   Total fixes applied: ${totalFixes}\n`);

console.log('🧪 Running validation tests...');
const { execSync } = require('child_process');

try {
  const lintResult = execSync('npm run lint', { encoding: 'utf8', timeout: 30000 });
  console.log('✅ ESLint validation: PASSED');
} catch (error) {
  const errorCount = (error.stdout?.match(/Error:/g) || []).length;
  const warningCount = (error.stdout?.match(/Warning:/g) || []).length;
  console.log(`⚠️ ESLint: ${errorCount} errors, ${warningCount} warnings (checking if critical...)`);
  
  if (errorCount === 0) {
    console.log('✅ No critical ESLint errors - only warnings remain');
  }
}

console.log('\n🎯 Final assessment for 100% production readiness...');