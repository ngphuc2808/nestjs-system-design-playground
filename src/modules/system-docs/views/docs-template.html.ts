import { SystemModuleDoc } from '../interfaces/system-docs.interface';

export function renderDocsHtml(modules: SystemModuleDoc[]): string {
  const modulesJson = JSON.stringify(modules);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ NestJS System Design & Architecture Portal</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #090d16;
      --bg-card: rgba(17, 24, 39, 0.75);
      --bg-card-hover: rgba(28, 36, 56, 0.85);
      --border-color: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(99, 102, 241, 0.3);
      --accent-purple: #6366f1;
      --accent-blue: #3b82f6;
      --accent-cyan: #06b6d4;
      --accent-green: #10b981;
      --accent-red: #ef4444;
      --text-main: #f3f4f6;
      --text-muted: #9ca3af;
      --font-main: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-code: 'JetBrains Mono', Consolas, Monaco, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-primary);
      color: var(--text-main);
      font-family: var(--font-main);
      display: flex;
      height: 100vh;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-image: 
        radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 40%);
    }

    /* Sidebar Navigation */
    .sidebar {
      width: 340px;
      background: rgba(13, 17, 26, 0.85);
      backdrop-filter: blur(16px);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .sidebar-header {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    .sidebar-header h1 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #a5b4fc, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sidebar-header p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 6px;
      font-weight: 400;
    }
    .module-list {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .module-item {
      padding: 14px 16px;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .module-item:hover {
      background: var(--bg-card-hover);
      border-color: var(--border-glow);
      transform: translateX(4px);
    }
    .module-item.active {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2));
      border-color: var(--accent-purple);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
    }
    .module-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .phase-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 20px;
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
      border: 1px solid rgba(165, 180, 252, 0.3);
    }
    .module-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.4;
    }
    .module-code {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-code);
    }

    /* Main Content Area */
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 36px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .hero-banner {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .hero-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .hero-desc {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.6;
      font-weight: 400;
    }

    /* Strategy Cards Grid */
    .strategy-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    }
    .card-naive {
      border-top: 4px solid var(--accent-red);
    }
    .card-optimized {
      border-top: 4px solid var(--accent-green);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .card-tag {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-tag-naive { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
    .card-tag-optimized { background: rgba(16, 185, 129, 0.15); color: #6ee7b7; }
    
    .endpoint-badge {
      font-family: var(--font-code);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.2px;
      padding: 10px 14px;
      background: #0d1117;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #38bdf8;
      margin-bottom: 14px;
      display: block;
      word-break: break-all;
      line-height: 1.6;
    }
    .card-desc {
      font-size: 14px;
      color: var(--text-main);
      line-height: 1.6;
      font-weight: 400;
      margin-bottom: 14px;
    }
    .card-footer {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.5;
      padding-top: 12px;
      border-top: 1px solid var(--border-color);
    }
    .footer-drawback { color: #fca5a5; }
    .footer-advantage { color: #6ee7b7; }

    /* Flow Sequence Steps */
    .section-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #e0e7ff;
    }
    .flow-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .flow-step {
      display: flex;
      align-items: center;
      gap: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 16px 20px;
      backdrop-filter: blur(12px);
    }
    .step-number {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));
      color: #ffffff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
    .step-body { flex: 1; }
    .step-title { font-size: 14px; font-weight: 600; color: #ffffff; }
    .step-desc { font-size: 13px; color: var(--text-muted); margin-top: 2px; font-weight: 400; line-height: 1.5; }
    .step-component {
      font-family: var(--font-code);
      font-size: 11px;
      font-weight: 500;
      background: rgba(255, 255, 255, 0.06);
      padding: 4px 10px;
      border-radius: 6px;
      color: #a5b4fc;
    }

    /* Benchmark Banner & cURL Box */
    .benchmark-banner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15));
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .metric-item { text-align: center; }
    .metric-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
    .metric-value { font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 4px; }
    .metric-highlight { color: #6ee7b7; }

    .curl-box {
      background: #0d1117;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 16px;
      position: relative;
    }
    .curl-code {
      font-family: var(--font-code);
      font-size: 12px;
      font-weight: 400;
      color: #7dd3fc;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.5;
    }
    .copy-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--border-color);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .copy-btn:hover { background: var(--accent-purple); }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1>⚡ System Design Portal</h1>
      <p>NestJS High-Concurrency & Architecture Explorer</p>
    </div>
    <div class="module-list" id="moduleList"></div>
  </aside>

  <!-- Main Content -->
  <main class="main-content" id="mainContent">
    <div class="hero-banner">
      <div class="hero-title" id="heroTitle">⚡ Select a Module</div>
      <div class="hero-desc" id="heroDesc">Choose any System Design module from the left sidebar to inspect its architecture flow, Naive vs. Optimized code comparison, and live execution metrics.</div>
    </div>

    <!-- Strategy Cards Grid -->
    <div class="strategy-grid">
      <div class="card card-naive">
        <div class="card-header">
          <span class="card-tag card-tag-naive">🔴 NAIVE STRATEGY</span>
        </div>
        <div class="endpoint-badge" id="naiveEndpoint">METHOD /api/v1/sample</div>
        <div class="card-desc" id="naiveDesc">Baseline code path.</div>
        <div class="card-footer footer-drawback" id="naiveDrawback">Drawback details</div>
      </div>

      <div class="card card-optimized">
        <div class="card-header">
          <span class="card-tag card-tag-optimized">🟢 OPTIMIZED STRATEGY</span>
        </div>
        <div class="endpoint-badge" id="optimizedEndpoint">METHOD /api/v1/sample</div>
        <div class="card-desc" id="optimizedDesc">High-performance code path.</div>
        <div class="card-footer footer-advantage" id="optimizedAdvantage">Advantage details</div>
      </div>
    </div>

    <!-- Flow Sequence Steps -->
    <div>
      <div class="section-title">🔄 Execution Sequence & Architecture Flow</div>
      <div class="flow-container" id="flowContainer"></div>
    </div>

    <!-- Live Benchmark Summary -->
    <div>
      <div class="section-title">📊 Empirical Benchmark Summary</div>
      <div class="benchmark-banner">
        <div class="metric-item">
          <div class="metric-label">Naive Metric</div>
          <div class="metric-value" id="naiveMetric">0 ms</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Optimized Metric</div>
          <div class="metric-value metric-highlight" id="optimizedMetric">0 ms</div>
        </div>
        <div class="metric-item">
          <div class="metric-label">Performance Improvement</div>
          <div class="metric-value metric-highlight" id="improvementMetric">0x</div>
        </div>
      </div>
    </div>

    <!-- Live cURL Box -->
    <div>
      <div class="section-title">💻 Live cURL Command Snippet</div>
      <div class="curl-box">
        <button class="copy-btn" onclick="copyCurl()">📋 Copy cURL</button>
        <div class="curl-code" id="curlCode">curl -s http://localhost:3000/api/v1/sample</div>
      </div>
    </div>
  </main>

  <script>
    const modules = ${modulesJson};
    let currentModule = modules[0];

    function renderSidebar() {
      const listEl = document.getElementById('moduleList');
      listEl.innerHTML = modules.map((m, idx) => \`
        <div class="module-item \${m.id === currentModule.id ? 'active' : ''}" onclick="selectModule('\${m.id}')">
          <div class="module-item-header">
            <span class="phase-badge">\${m.phase}</span>
            <span class="module-code">\${m.moduleCode}</span>
          </div>
          <div class="module-title">\${m.title}</div>
        </div>
      \`).join('');
    }

    function selectModule(id) {
      currentModule = modules.find(m => m.id === id) || modules[0];
      renderSidebar();
      renderContent();
    }

    function renderContent() {
      document.getElementById('heroTitle').innerText = '⚡ ' + currentModule.title;
      document.getElementById('heroDesc').innerText = currentModule.overview;

      // Naive Card
      document.getElementById('naiveEndpoint').innerText = currentModule.naiveStrategy.method + ' ' + currentModule.naiveStrategy.endpoint;
      document.getElementById('naiveDesc').innerText = currentModule.naiveStrategy.description;
      document.getElementById('naiveDrawback').innerText = '⚠️ Drawback: ' + currentModule.naiveStrategy.drawback;

      // Optimized Card
      let optEndpointHtml = currentModule.optimizedStrategy.method + ' ' + currentModule.optimizedStrategy.endpoint;
      if (currentModule.optimizedStrategy.additionalEndpoints && currentModule.optimizedStrategy.additionalEndpoints.length > 0) {
        optEndpointHtml = currentModule.optimizedStrategy.additionalEndpoints.map(ep => \`
          <div style="margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px;">
            <div style="font-size:11px; color:#a5b4fc; font-weight:600; margin-bottom:2px;">\${ep.label}</div>
            <div style="color:#38bdf8; font-weight:500;">\${ep.method} \${ep.endpoint}</div>
          </div>
        \`).join('');
      }
      document.getElementById('optimizedEndpoint').innerHTML = optEndpointHtml;
      document.getElementById('optimizedDesc').innerText = currentModule.optimizedStrategy.description;
      document.getElementById('optimizedAdvantage').innerText = '🚀 Advantage: ' + currentModule.optimizedStrategy.advantage;

      // Flow Steps
      const flowEl = document.getElementById('flowContainer');
      flowEl.innerHTML = currentModule.flowSteps.map(step => \`
        <div class="flow-step">
          <div class="step-number">\${step.stepNumber}</div>
          <div class="step-body">
            <div class="step-title">\${step.title}</div>
            <div class="step-desc">\${step.description}</div>
          </div>
          <div class="step-component">\${step.component}</div>
        </div>
      \`).join('');

      // Benchmark metrics
      document.getElementById('naiveMetric').innerText = currentModule.benchmarkResult.naiveMetric;
      document.getElementById('optimizedMetric').innerText = currentModule.benchmarkResult.optimizedMetric;
      document.getElementById('improvementMetric').innerText = currentModule.benchmarkResult.improvement;

      // cURL code
      document.getElementById('curlCode').innerText = currentModule.curlSnippet;
    }

    function copyCurl() {
      const code = document.getElementById('curlCode').innerText;
      navigator.clipboard.writeText(code).then(() => {
        alert('Copied cURL command to clipboard!');
      });
    }

    // Initial render
    renderSidebar();
    renderContent();
  </script>
</body>
</html>`;
}
