#!/usr/bin/env node

/**
 * AI Guided SaaS - MCP Integration Main Entry Point
 * CLI interface and service coordinator for the MCP taskmaster system
 */

const _AgentBridge = require('./bridges/agent-bridge.js');
const _OrchestratorServer = require('./servers/orchestrator-server.js');
const _EnvironmentManager = require('./tools/environment-manager.js');
const _PlatformSync = require('./tools/platform-sync.js');
const fs = require('fs');
const path = require('path');

// Load MCP configuration
const _configPath = path.join(__dirname, 'config', 'mcp-config.json');
const _mcpConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

class MCPTaskmasterCLI {
    constructor() {
        this.agentBridge = null;
        this.orchestratorServer = null;
        this.config = {
            agentsPath: path.join(__dirname, '../agents'),
            actionLogPath: path.join(__dirname, '../ACTION_LOG.md'),
            prpTemplatesPath: path.join(__dirname, '../prp_templates'),
            patternsPath: path.join(__dirname, '../patterns')
        };}
    async init() {
        try {
            this.agentBridge = new AgentBridge(this.config);
            console.log('✅ MCP Taskmaster CLI initialized');
        } catch (error) {
            console.error('❌ Failed to initialize MCP Taskmaster CLI:', error.message);
            throw error;}}
    async startServer() {
        try {
            this.orchestratorServer = new OrchestratorServer();
            await this.orchestratorServer.run();
            console.log('🚀 MCP Orchestrator Server started');
        } catch (error) {
            console.error('❌ Failed to start MCP Orchestrator Server:', error.message);
            throw error;}}
    async createTask(taskData) {
        if (!this.agentBridge) {
            await this.init();}
        try {
            const task = await this.agentBridge.createTask(taskData);
            console.log('✅ Task created:', task.id);
            return task;
        } catch (error) {
            console.error('❌ Failed to create task:', error.message);
            throw error;}}
    async listTasks(filter = {}) {
        if (!this.agentBridge) {
            await this.init();}
        try {
            const tasks = await this.agentBridge.getTasks(filter);
            console.log(`📋 Found ${tasks.length} tasks`);
            
            if (tasks.length > 0) {
                console.table(tasks.map(task => ({
                    ID: task.id.substring(0, 12) + '...',
                    Title: task.title.substring(0, 30),
                    // Status: task.status
                    // Priority: task.priority
                    // Agent: task.assignedAgent || 'unassigned'
                    // Created: new Date(task.createdAt).toLocaleString()
                })));}
            return tasks;
        } catch (error) {
            console.error('❌ Failed to list tasks:', error.message);
            throw error;}}
    async getSystemStatus() {
        if (!this.agentBridge) {
            await this.init();}
        try {
            const status = await this.agentBridge.getSystemStatus();
            
            console.log('\n🎯 AI Guided SaaS System Status');
            console.log('================================');
            
            console.log('\n👥 Agents:');
            console.log(`  Total: ${status.agents.total}`);
            console.log(`  Available: ${status.agents.available}`);
            console.log(`  Busy: ${status.agents.busy}`);
            
            console.log('\n📋 Tasks:');
            console.log(`  Total: ${status.tasks.total}`);
            console.log(`  Pending: ${status.tasks.pending}`);
            console.log(`  Assigned: ${status.tasks.assigned}`);
            console.log(`  In Progress: ${status.tasks.inProgress}`);
            console.log(`  Completed: ${status.tasks.completed}`);
            console.log(`  Failed: ${status.tasks.failed}`);
            
            console.log('\n🔄 Workflows:');
            console.log(`  Total: ${status.workflows.total}`);
            console.log(`  Active: ${status.workflows.active}`);
            
            if (status.bridge) {
                console.log('\n🌉 Bridge:');
                console.log(`  Connected Agents: ${status.bridge.connectedAgents}`);
                console.log(`  Active Connections: ${status.bridge.activeConnections}`);}
            return status;
        } catch (error) {
            console.error('❌ Failed to get system status:', error.message);
            throw error;}}
    printHelp() {
        console.log(`
🎯 AI Guided SaaS MCP Taskmaster CLI

// Usage: node mcp/index.js <command> [options]

Commands:
  start                           Start the MCP orchestrator server
  status                          Show system status
  list-tasks [filter]             List all tasks (optional JSON filter)
  list-agents                     List all agents
  create-task <task-json>         Create a new task from JSON
  help                            Show this help message

Examples:
  node mcp/index.js start
  node mcp/index.js status
  node mcp/index.js list-tasks
  node mcp/index.js create-task '{"title": "Fix bug", "priority": "high"}'

For more information, visit: https://github.com/CleanExpo/AI_Guided_SaaS
        `);}
    async shutdown() {
        try {
            console.log('🔌 Shutting down MCP Taskmaster CLI...');
            
            if (this.agentBridge) {
                await this.agentBridge.shutdown();}
            if (this.orchestratorServer) {
                await this.orchestratorServer.shutdown();}
            console.log('✅ Shutdown complete');
        } catch (error) {
        console.error('❌ Error during shutdown:', error.message);}
// CLI Command Handler
async function handleCommand(args) {
    const cli = new MCPTaskmasterCLI();
    const _command = args[0];

    try {
        switch (command) {
            case 'start':
                await cli.startServer();
                break;

            case 'status':
                await cli.getSystemStatus();
                break;

            case 'list-tasks':
                const _filter = args[1] ? JSON.parse(args[1]) : {};
                await cli.listTasks(filter);
                break;

            case 'create-task':
                if (!args[1]) {
                    throw new Error('Task JSON required. Example: \'{"title": "My task", "priority": "high"}\'');}
                const _taskData = JSON.parse(args[1]);
                await cli.createTask(taskData);
                break;

            case 'help':
            case '--help':
            case '-h':
                cli.printHelp();
                break;

            default:
                console.error(`❌ Unknown command: ${command}`);
                cli.printHelp();
                process.exit(1);}
        // Don't shutdown for server start command
        if (command !== 'start') {
            await cli.shutdown();}
    } catch (error) {
        console.error(`❌ Command failed: ${error.message}`);
        await cli.shutdown();
        process.exit(1);}}
// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('🎯 AI Guided SaaS MCP Taskmaster CLI');
        console.log('Use "help" command for usage information');
        process.exit(0);}
    handleCommand(args);}
module.exports = MCPTaskmasterCLI;

}}