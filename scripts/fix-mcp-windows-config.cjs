const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔧 Fixing MCP Windows Configuration Issues...\n');

// Fix user config
const userConfigPath = path.join(os.homedir(), '.claude.json');
console.log(`📁 Checking user config: ${userConfigPath}`);

try {
    const userConfig = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
    let userUpdated = false;

    if (userConfig.mcpServers) {
        for (const [serverName, serverConfig] of Object.entries(userConfig.mcpServers)) {
            if (serverConfig.command === 'npx') {
                console.log(`  ⚠️  Fixing ${serverName}: Adding Windows cmd wrapper`);
                serverConfig.command = 'cmd';
                serverConfig.args = ['/c', 'npx', ...(serverConfig.args || [])];
                userUpdated = true;
            }
        }
    }

    if (userUpdated) {
        fs.writeFileSync(userConfigPath, JSON.stringify(userConfig, null, 2));
        console.log('  ✅ User config updated successfully\n');
    } else {
        console.log('  ✅ User config already correct\n');
    }
} catch (error) {
    console.log(`  ❌ Error processing user config: ${error.message}\n`);
}

// Fix project config
const projectConfigPath = path.join(process.cwd(), '.mcp.json');
console.log(`📁 Checking project config: ${projectConfigPath}`);

try {
    const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
    let projectUpdated = false;

    if (projectConfig.mcpServers) {
        for (const [serverName, serverConfig] of Object.entries(projectConfig.mcpServers)) {
            if (serverConfig.command === 'npx') {
                console.log(`  ⚠️  Fixing ${serverName}: Adding Windows cmd wrapper`);
                serverConfig.command = 'cmd';
                serverConfig.args = ['/c', 'npx', ...(serverConfig.args || [])];
                projectUpdated = true;
            }
        }
    }

    if (projectUpdated) {
        fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2));
        console.log('  ✅ Project config updated successfully\n');
    } else {
        console.log('  ✅ Project config already correct\n');
    }
} catch (error) {
    console.log(`  ❌ Error processing project config: ${error.message}\n`);
}

console.log('🎉 MCP Windows configuration fix complete!');
console.log('\n💡 Tip: Restart Claude Code to apply the changes.');