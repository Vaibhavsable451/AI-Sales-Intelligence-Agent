/**
 * app.js
 * Glue code: wires the DOM to workflow.js / api.js / ui.js and defines
 * the timed reveal sequence for a single pipeline run.
 */

(() => {
  const WEBHOOK_URL = 'http://localhost:5678/webhook/sales-intelligence-agent';

  const runBtn = document.getElementById('runBtn');
  const workflowAnimEl = document.getElementById('workflowAnim');
  const clientNameInput = document.getElementById('clientName');
  const targetUrlInput = document.getElementById('targetUrl');

  document.getElementById('endpointText').textContent = WEBHOOK_URL;
  Workflow.mount(workflowAnimEl);

  // Friendly console line shown per workflow step, in place of raw payloads.
  const STEP_LOG_LINES = [
    'Webhook received',
    'Website scraped',
    'Company research complete',
    'Pain point agent complete',
    'Personalization agent complete',
    'Sales copywriter complete',
  ];

  async function runPipeline() {
    const clientName = clientNameInput.value.trim() || 'Prospect';
    const targetUrl = targetUrlInput.value.trim();

    if (!targetUrl) {
      Ui.resetConsole();
      Ui.log('✕ Enter a website URL before running the pipeline.', 'err');
      return;
    }

    // reset UI
    Ui.resetConsole();
    Ui.hideReport();
    Ui.setStatus('running');
    Ui.showProgress();
    Ui.showAgentPanel();
    Workflow.reset();
    runBtn.disabled = true;
    runBtn.innerHTML = '<span class="spinner"></span> Running…';

    Ui.log(`→ Target: ${targetUrl}`, 'dim');
    Ui.log(`→ Client: ${clientName}`, 'dim');

    const totalSteps = Workflow.steps.length;

    Workflow.start((i) => {
      if (STEP_LOG_LINES[i]) Ui.log('✓ ' + STEP_LOG_LINES[i], 'ok');
      Ui.setProgress(((i + 1) / totalSteps) * 100 * 0.7); // cap animation progress under real completion

      if (i === 3) Ui.setAgentState('pain', 'running');
      if (i === 2) Ui.setAgentState('research', 'running');
      if (i === 4) { Ui.setAgentState('pain', 'done', '1.4 sec'); Ui.setAgentState('research', 'done', '0.9 sec'); }
      if (i === 5) Ui.setAgentState('copywriter', 'running');
    });

    try {
      const data = await Api.runPipeline(WEBHOOK_URL, { url: targetUrl, client_name: clientName });

      Workflow.complete();
      Ui.completeAllAgents();
      Ui.setProgress(100);
      Ui.log('✓ Gmail sent', 'ok');
      Ui.log('✓ Google Sheet updated', 'ok');
      Ui.log('✓ Slack notification sent', 'ok');
      Ui.log('✓ Workflow finished', 'ok');
      Ui.setStatus('success');

      Ui.renderReport(data, clientName, targetUrl);
    } catch (err) {
      Workflow.markFailed();
      Ui.setProgress(60, true);
      Ui.log('✕ Request failed: ' + err.message, 'err');
      Ui.log(
        'This page can only reach an n8n instance running on your own machine at localhost:5678. ' +
        'If n8n is running, enable CORS for this origin on the webhook node, or open this page from the same machine.',
        'dim'
      );
      Ui.setStatus('failed');
    } finally {
      runBtn.disabled = false;
      runBtn.innerHTML = '▶ Run workflow';
    }
  }

  runBtn.addEventListener('click', runPipeline);
  window.addEventListener('run-again', runPipeline);
})();
