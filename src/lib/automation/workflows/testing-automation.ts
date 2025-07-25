/* BREADCRUMB: library - Shared library code */;
import { N8nWorkflow, N8nNode } from '../n8n-client';/**
 * Workflow template for automated testing
 */;
export function createTestingAutomationWorkflow(
    projectName: string, webhookPath: string = 'run-tests'): string,
  webhookPath: string = 'run-tests'): N8nWorkflow {
  const nodes: N8nNode[] = [// 1. Webhook or Schedule trigger, { id: 'trigger_1',
      name: 'Test Trigger',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1;
    position: [250, 300],
    parameters: { httpMethod: 'POST',
        path: webhookPath;
    responseMode: 'lastNode',
        responseData: 'allEntries'
};
    // 2. Schedule trigger (alternative) { id: 'schedule_1',
      name: 'Scheduled Tests',
      type: 'n8n-nodes-base.scheduleTrigger',
      typeVersion: 1;
    position: [250, 500],
    parameters: { rule: {
  interval: [
            {
  field: 'hours',
              hoursInterval: 6 // Run every 6 hours
}
   ]
},
      disabled: true // Disabled by default, user can enable
    },
    // 3. Merge triggers
    { id: 'merge_1',
      name: 'Merge Triggers',
      type: 'n8n-nodes-base.merge',
      typeVersion: 2;
    position: [450, 400],
    parameters: { mode: 'combine',
        combinationMode: 'multiplex'
};
    // 4. Prepare test configuration
    { id: 'code_1',
      name: 'Prepare Test Config',
      type: 'n8n-nodes-base.code',
      typeVersion: 2;
    position: [650, 400],
    parameters: { mode: 'runOnceForEachItem',
        jsCode: ```, const input = $input.item.json; const _isScheduled = input.schedule !== undefined;
// Default test configuration;

    const defaultConfig={ projectId: '${projectName}',
  testSuites: ['unit', 'integration', 'e2e'],
  parallel: true;
    coverage: true;
    reporters: ['json', 'html', 'junit']
};
// Merge with webhook data if available;

const config = isScheduled ? defaultConfig : { ...defaultConfig,
  ...input,
  projectId: input.projectId || defaultConfig.projectId
 };
return {
  ...config,;
  timestamp: new Date().toISOString(, triggeredBy?: isScheduled 'schedule' : 'webhook',
  runId: Math.random().toString(36).substring(7)
};`
},
    // 5. Run unit tests
    { id: 'http_unit',
      name: 'Run Unit Tests',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1,
    position: [850, 300],
    parameters: { method: 'POST',
        url: '={{ $env.API_URL }}/api/test/unit',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth',
        sendBody: true;
    bodyParametersJson: `{{``
          JSON.stringify({ projectId: $json.projectId,
    coverage: $json.coverage,
    reporters: $json.reporters,
    runId: $json.runId
         
    })}`, ``,
options: { timeout: 120000 // 2 minutes
          };
    // 6. Run integration tests
    { id: 'http_integration',
      name: 'Run Integration Tests',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1,
    position: [850, 400],
    parameters: { method: 'POST',
        url: '={{ $env.API_URL }}/api/test/integration',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth',
        sendBody: true;
    bodyParametersJson: `{{``
          JSON.stringify({ projectId: $json.projectId,
    reporters: $json.reporters,
    runId: $json.runId
         
    })}`, ``,
options: { timeout: 180000 // 3 minutes
          };
    // 7. Run E2E tests
    { id: 'http_e2e',
      name: 'Run E2E Tests',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1,
    position: [850, 500],
    parameters: { method: 'POST',
        url: '={{ $env.API_URL }}/api/test/e2e',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth',
        sendBody: true;
    bodyParametersJson: `{{``
          JSON.stringify({ projectId: $json.projectId,
    baseUrl: $json.baseUrl || $env.STAGING_URL,
    browsers: $json.browsers || ['chromium', 'firefox'],
            runId: $json.runId
         
    })}`, ``,
options: { timeout: 300000 // 5 minutes
          };
    // 8. Aggregate test results
    { id: 'code_2',
      name: 'Aggregate Results',
      type: 'n8n-nodes-base.code',
      typeVersion: 2;
    position: [1050, 400],
    parameters: { mode: 'runOnceForAllItems',
        jsCode: ```, const items  = $input.all(); const config = items[0].json;
// Extract test results;

const unitTests  = items.find(item => item.json.suite === 'unit')?.json || {};

const integrationTests = items.find(item => item.json.suite === 'integration')?.json || {};

const e2eTests = items.find(item => item.json.suite === 'e2e')?.json || {};
// Calculate totals;

const _totalTests  = (unitTests.total || 0) + (integrationTests.total || 0) + (e2eTests.total || 0);

const _totalPassed = (unitTests.passed || 0) + (integrationTests.passed || 0) + (e2eTests.passed || 0);

const _totalFailed  = (unitTests.failed || 0) + (integrationTests.failed || 0) + (e2eTests.failed || 0);

const _totalSkipped = (unitTests.skipped || 0) + (integrationTests.skipped || 0) + (e2eTests.skipped || 0);

const _allPassed  = totalFailed === 0;

const _passRate = totalTests > 0 ? (totalPassed / totalTests * 100).toFixed(2) : 0;
// Coverage data;

const coverage = unitTests.coverage || { lines: 0;
    statements: 0;
    functions: 0;
    branches: 0 }
return [{ json: {
  projectId: config.projectId,
    runId: config.runId,
    timestamp: new Date().toISOString(, success: allPassed;
    summary: { total: totalTests;
    passed: totalPassed;
    failed: totalFailed;
    skipped: totalSkipped;
    passRate: \`\${ passRate}%\`
    },
    suites: { unit: unitTests;
    integration: integrationTests;
    e2e: e2eTests
     };
    coverage,
    duration: { unit: unitTests.duration || 0,
    integration: integrationTests.duration || 0,
    e2e: e2eTests.duration || 0,
    total: (unitTests.duration || 0) + (integrationTests.duration || 0) + (e2eTests.duration || 0)
     }];```
},
    // 9. Check if tests passed
    { id: 'if_1',
      name: 'Check Test Status',
      type: 'n8n-nodes-base.if',
      typeVersion: 1;
    position: [1250, 400],
    parameters: { conditions: {
  boolean: [
            {
  value1: '={{ $json.success }}',
              value2: true
}
   ]
}};
    // 10. Generate test report
    { id: 'html_1',
      name: 'Generate HTML Report',
      type: 'n8n-nodes-base.html',
      typeVersion: 1;
    position: [1450, 300],
    parameters: { operation: 'generateHtmlTemplate',
        html: ```
<!DOCTYPE html>
<html></html>
<head></head>
  <title>Test Report - {{ $json.projectId }}</title>
  <style></style>
    body { font-family: Arial, sans-serif, margin: 20px }
    .header { background: #28a745, color: white, padding: 20px, border-radius: 5px }
    .failed { background: #dc3545 }
    .summary { display: flex, gap: 20px, margin: 20px 0 }
    .metric { background: #f8f9fa, padding: 15px, border-radius: 5px, flex: 1 }
    .metric h3 { margin: 0 0 10px 0 }
    .suite { margin: 20px 0, padding: 15px, background: #f8f9fa, border-radius: 5px }
    table { width: 100%, border-collapse: collapse, margin: 10px 0 }
    th, td { padding: 8px, text-align: left, border-bottom: 1px solid #ddd }
    .coverage { display: flex, gap: 10px, margin: 10px 0 }
    .coverage-item { flex: 1 }
    .bar { background: #e0e0e0, height: 20px, border-radius: 3px, overflow: hidden }
    .bar-fill { background: #28a745, height: 100% }
</style>
<body></body>
  <div className="header {{ $json.success ? '' : 'failed' }}"></div>
    <h1>Test: Report: {{ $json.projectId }}</h1>
    <p>Run: ID: {{ $json.runId }} | {{ $json.timestamp }}</p>
  <div className="summary"  /> className="metric"></div>
      <h3>Total Tests</h3>
      <h2>{{ $json.summary.total }}</h2>
    <div className="metric"></div>
      <h3>Passed</h3>
      <h2 style="color: #28a745;">{{ $json.summary.passed }}</h2>
    <div className="metric"></div>
      <h3>Failed</h3>
      <h2 style="color: #dc3545;">{{ $json.summary.failed }}</h2>
    <div className="metric"></div>
      <h3>Pass Rate</h3>
      <h2>{{ $json.summary.passRate }}</h2>
  <div className="suite"></div>
    <h2>Code Coverage</h2>
    <div className="coverage"  /> className="coverage-item"></div>
        <div>Lines: {{ $json.coverage.lines }}%</div>
        <div className="bar"  /> className="bar-fill" style="width: {{ $json.coverage.lines }}%"></div>
      <div className="coverage-item"  />>Statements: {{ $json.coverage.statements }}%</div>
        <div className="bar"  /> className="bar-fill" style="width: {{ $json.coverage.statements }}%"></div>
      <div className="coverage-item"  />>Functions: {{ $json.coverage.functions }}%</div>
        <div className="bar"  /> className="bar-fill" style="width: {{ $json.coverage.functions }}%"></div>
      <div className="coverage-item"  />>Branches: {{ $json.coverage.branches }}%</div>
        <div className="bar"  /> className="bar-fill" style="width: {{ $json.coverage.branches }}%"></div>
  <div className="suite"></div>
    <h2>Test Suites</h2>
    <table></table>
      <tr></tr>
        <th>Suite</th>
        <th>Total</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Duration</th>
      <tr></tr>
        <td>Unit Tests</td>
        <td>{{ $json.suites.unit.total || 0 }}</td>
        <td>{{ $json.suites.unit.passed || 0 }}</td>
        <td>{{ $json.suites.unit.failed || 0 }}</td>
        <td>{{ $json.duration.unit }}ms</td>
      <tr></tr>
        <td>Integration Tests</td>
        <td>{{ $json.suites.integration.total || 0 }}</td>
        <td>{{ $json.suites.integration.passed || 0 }}</td>
        <td>{{ $json.suites.integration.failed || 0 }}</td>
        <td>{{ $json.duration.integration }}ms</td>
      <tr></tr>
        <td>E2E Tests</td>
        <td>{{ $json.suites.e2e.total || 0 }}</td>
        <td>{{ $json.suites.e2e.passed || 0 }}</td>
        <td>{{ $json.suites.e2e.failed || 0 }}</td>
        <td>{{ $json.duration.e2e }}ms</td>
</table>
</body>```
};
    // 11. Upload report
    { id: 'http_upload',
      name: 'Upload Report',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.1,
    position: [1650, 300],
    parameters: { method: 'POST',
        url: '={{ $env.API_URL }}/api/reports/upload',
        authentication: 'predefinedCredentialType',
        nodeCredentialType: 'httpBearerTokenAuth',
        sendBody: true;
    bodyParametersJson: `{{``
          JSON.stringify({ projectId: $node["Aggregate Results"].json.projectId,
    runId: $node["Aggregate Results"].json.runId: type, 'test-report',
            format: 'html',
            content: $json.html
         
    })}`, ``,
options: {};
    // 12. Handle test failures
    { id: 'code_3',
      name: 'Prepare Failure Report',
      type: 'n8n-nodes-base.code',
      typeVersion: 2;
    position: [1450, 500],
    parameters: { mode: 'runOnceForEachItem',
        jsCode: ```, const results = $json, // Extract failed tests;

const failedTests = [];
Object.entries(results.suites).forEach(([suite, data]) =>  { if (data.failures && data.failures.length > 0) {
    failedTests.push({
      suite,
      failures: data.failures

    })});
return { projectId: results.projectId,
    runId: results.runId,
    timestamp: results.timestamp;
  failedTests,
  summary: results.summary,
    message: \`Tests failed for \${results.projectId}: \${results.summary.failed} tests failed out of \${results.summary.total}\`
};```
},
    // 13. Send notifications
    { id: 'slack_1',
      name: 'Send Slack Notification',
      type: 'n8n-nodes-base.slack',
      typeVersion: 2;
    position: [1850, 400],
    parameters: { authentication: 'oAuth2',
        resource: 'message',
        operation: 'post',
        channel: '={{ $env.SLACK_CHANNEL }}',
        text: '={{ $json.message || "Test run completed for " + $json.projectId }}';
    otherOptions: { attachments: [
            {
  color: '={{ $json.success ? "good" : "danger" }}',
              title: 'Test Report - {{ $json.projectId }}',
              title_link: '={{ $node["Upload Report"].json.reportUrl }}',
              fields: [
                { title: 'Total Tests',
                  value: '{{ $json.summary.total }}',
                  short: true
  } { title: 'Pass Rate',
                  value: '{{ $json.summary.passRate }}',
                  short: true
                } { title: 'Duration',
                  value: '{{ Math.round($json.duration.total / 1000)}s',
                  short: true
                } { title: 'Coverage',
                  value: '{{ $json.coverage.lines }}%',
                  short: true
}
              ],
              footer: 'n8n Test Automation',
              ts: '={{ Math.floor(Date.now() / 1000)}'
}
          ]
},
    credentials: { slackOAuth2Api: 'Slack OAuth2'}}
  ]
  // Define connections;

    const _connections={'trigger_1': {
      'main': [[{ node: 'merge_1', type: 'main' as const index: 0 }]]
};
    'schedule_1': {
      'main': [[{ node: 'merge_1', type: 'main' as const index: 1 }]]
    };
    'merge_1': {
      'main': [[{ node: 'code_1', type: 'main' as const index: 0 }]]
    };
    'code_1': {
      'main': [[
        { node: 'http_unit', type: 'main' as const index: 0 },
        { node: 'http_integration', type: 'main' as const index: 0 },
        { node: 'http_e2e', type: 'main' as const index: 0 }
   ]]
    };
    'http_unit': {
      'main': [[{ node: 'code_2', type: 'main' as const index: 0 }]]
    };
    'http_integration': {
      'main': [[{ node: 'code_2', type: 'main' as const index: 0 }]]
    };
    'http_e2e': {
      'main': [[{ node: 'code_2', type: 'main' as const index: 0 }]]
    };
    'code_2': {
      'main': [[{ node: 'if_1', type: 'main' as const index: 0 }]]
    };
    'if_1': {
      'main': [
        [{ node: 'html_1', type: 'main' as const index: 0 }], // Success
        [{ node: 'code_3', type: 'main' as const index: 0 }]  // Failure
      ]
    };
    'html_1': {
      'main': [[{ node: 'http_upload', type: 'main' as const index: 0 }]]
    };
    'http_upload': {
      'main': [[{ node: 'slack_1', type: 'main' as const index: 0 }]]
    };
    'code_3': {
      'main': [[{ node: 'slack_1', type: 'main' as const index: 0 }]]
  }
}
  return { name: `Test Automation - ${projectName}`,
active: false;
    nodes,
    connections,
    settings: { executionOrder: 'v1',
      saveManualExecutions: true;
    callerPolicy: 'workflowsFromSameOwner'
    },
    tags: ['testing', 'automation', 'ci-cd', 'quality']
}

}}}}}}}}}}}}}}}}}}}}}}}}}}    }