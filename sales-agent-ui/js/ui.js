/**
 * ui.js
 * Everything that touches the DOM for status/console/report rendering.
 * Deliberately tolerant of the exact shape of the n8n response — different
 * "Format Response" nodes will name fields differently, so we look for a
 * handful of likely keys before falling back to a raw JSON view.
 */

const Ui = (() => {
  const consoleOut = document.getElementById('consoleOut');
  const statusPill = document.getElementById('statusPill');
  const progressShell = document.getElementById('progressShell');
  const progressFill = document.getElementById('progressFill');
  const progressLabel = document.getElementById('progressLabel');
  const reportCard = document.getElementById('reportCard');
  const agentPanel = document.getElementById('agentPanel');
  const agentList = document.getElementById('agentList');

  const AGENTS = [
    { key: 'pain', name: 'Pain point agent', fallbackTime: '1.4 sec' },
    { key: 'research', name: 'Company research agent', fallbackTime: '0.9 sec' },
    { key: 'copywriter', name: 'Sales copywriter agent', fallbackTime: '1.8 sec' },
  ];

  // ---------- console ----------
  function resetConsole() {
    consoleOut.innerHTML = '';
  }

  function log(text, cls) {
    const line = document.createElement('div');
    line.className = 'line fade-in' + (cls ? ' ' + cls : '');
    line.textContent = text;
    consoleOut.appendChild(line);
    consoleOut.scrollTop = consoleOut.scrollHeight;
  }

  // ---------- status pill ----------
  function setStatus(state) {
    statusPill.classList.remove('live', 'success', 'failed');
    switch (state) {
      case 'running':
        statusPill.textContent = 'running';
        statusPill.classList.add('live');
        break;
      case 'success':
        statusPill.textContent = 'success';
        statusPill.classList.add('success');
        break;
      case 'failed':
        statusPill.textContent = 'failed';
        statusPill.classList.add('failed');
        break;
      default:
        statusPill.textContent = 'idle';
    }
  }

  // ---------- overall progress bar ----------
  function showProgress() {
    progressShell.hidden = false;
    setProgress(0);
  }

  function setProgress(pct, failed) {
    progressFill.style.width = Math.max(0, Math.min(100, pct)) + '%';
    progressFill.classList.toggle('failed', !!failed);
    progressLabel.textContent = Math.round(pct) + '%';
  }

  function hideProgress() {
    progressShell.hidden = true;
  }

  // ---------- agent panel ----------
  function showAgentPanel() {
    agentList.innerHTML = '';
    AGENTS.forEach(agent => {
      const row = document.createElement('div');
      row.className = 'agent-row fade-in';
      row.dataset.key = agent.key;
      row.innerHTML = `
        <div class="agent-top">
          <span class="agent-name">${agent.name}</span>
          <span class="agent-meta">queued</span>
        </div>
        <div class="agent-bar-track"><div class="agent-bar-fill"></div></div>
      `;
      agentList.appendChild(row);
    });
    agentPanel.hidden = false;
  }

  function setAgentState(key, state, timeLabel) {
    const row = agentList.querySelector(`[data-key="${key}"]`);
    if (!row) return;
    const meta = row.querySelector('.agent-meta');
    const fill = row.querySelector('.agent-bar-fill');
    if (state === 'running') {
      meta.textContent = 'running…';
      meta.classList.remove('ok');
      fill.style.width = '55%';
    } else if (state === 'done') {
      meta.textContent = `Completed · ${timeLabel || '—'}`;
      meta.classList.add('ok');
      fill.style.width = '100%';
    } else {
      meta.textContent = 'queued';
      fill.style.width = '0%';
    }
  }

  function completeAllAgents() {
    AGENTS.forEach(a => setAgentState(a.key, 'done', a.fallbackTime));
  }

  function hideAgentPanel() {
    agentPanel.hidden = true;
  }

  // ---------- report normalization ----------
  function firstDefined(obj, keys) {
    for (const k of keys) {
      const v = k.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }

  function normalizeReport(data, fallbackClientName, fallbackUrl) {
    const body = data && data.data ? data.data : data; // unwrap common { status, data } shape

    const company = firstDefined(body, ['company', 'company_name', 'client_name', 'clientName']) || fallbackClientName || 'Prospect';
    const industry = firstDefined(body, ['industry', 'company_industry', 'sector']) || '—';
    const website = firstDefined(body, ['website', 'url', 'target_url']) || fallbackUrl || '—';
    const executionTime = firstDefined(body, ['execution_time', 'duration', 'elapsed']) || null;

    let painPoints = firstDefined(body, ['pain_points', 'painPoints']);
    if (typeof painPoints === 'string') painPoints = painPoints.split(/\n|;/).map(s => s.trim()).filter(Boolean);
    if (!Array.isArray(painPoints)) painPoints = [];

    const subject = firstDefined(body, ['subject', 'email_subject', 'generated_subject']);
    const email = firstDefined(body, ['email', 'email_body', 'pitch', 'generated_email', 'draft']);

    const hasStructuredFields = Boolean(
      firstDefined(body, ['company', 'company_name']) || painPoints.length || subject || email
    );

    return { company, industry, website, executionTime, painPoints, subject, email, hasStructuredFields, raw: data };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderReport(data, fallbackClientName, fallbackUrl) {
    const r = normalizeReport(data, fallbackClientName, fallbackUrl);

    const dashCards = [
      { k: 'Website', v: r.website },
      { k: 'Industry', v: r.industry },
      { k: 'Pain points', v: r.painPoints.length || '—' },
      { k: 'Execution time', v: r.executionTime || '—' },
    ].map(c => `<div class="dash-card"><div class="k">${escapeHtml(c.k)}</div><div class="v">${escapeHtml(c.v)}</div></div>`).join('');

    const painHtml = r.painPoints.length
      ? `<div class="report-block">
           <div class="block-label">Pain points identified</div>
           <div class="pain-list">
             ${r.painPoints.map(p => `<div class="pain-item"><span class="check">✔</span><span>${escapeHtml(p)}</span></div>`).join('')}
           </div>
         </div>`
      : '';

    const subjectHtml = r.subject
      ? `<div class="report-block">
           <div class="block-label">Generated subject line</div>
           <div class="subject-line">${escapeHtml(r.subject)}</div>
         </div>`
      : '';

    const emailHtml = r.email
      ? `<div class="report-block">
           <div class="block-label">Generated email</div>
           <div class="email-box">${escapeHtml(r.email)}</div>
         </div>`
      : '';

    const fallbackNotice = !r.hasStructuredFields
      ? `<div class="report-block">
           <div class="block-label">Response payload</div>
           <p style="font-size:13px; color:var(--text-dim); margin-bottom:8px;">
             The webhook responded successfully, but this page didn't recognize any of the usual
             report fields (company, pain_points, subject, email…). Showing the raw response instead —
             rename the fields in n8n's "Format Response" node to match, and this card will render them automatically.
           </p>
           <div class="raw-json">${escapeHtml(JSON.stringify(data, null, 2))}</div>
         </div>`
      : `<button class="raw-toggle" id="rawToggleBtn">View raw response JSON</button>
         <div class="raw-json" id="rawJson" hidden>${escapeHtml(JSON.stringify(data, null, 2))}</div>`;

    reportCard.innerHTML = `
      <div class="report-banner">
        <div class="icon">🤖</div>
        <div>
          <div class="title">AI sales intelligence report</div>
          <div class="sub">${escapeHtml(r.company)}</div>
        </div>
      </div>
      <div class="report-body">
        <div class="dash-grid">${dashCards}</div>
        ${painHtml}
        ${subjectHtml}
        ${emailHtml}
        ${fallbackNotice}
        <div class="action-row">
          <button class="btn btn-ghost btn-sm" id="copyEmailBtn">📋 Copy email</button>
          <button class="btn btn-ghost btn-sm" id="downloadReportBtn">📄 Download report</button>
          <button class="btn btn-ghost btn-sm" id="runAgainBtn">↻ Run again</button>
        </div>
      </div>
    `;
    reportCard.hidden = false;
    reportCard.classList.add('fade-in');

    wireReportActions(r, data);
  }

  function wireReportActions(r, rawData) {
    const rawToggle = document.getElementById('rawToggleBtn');
    if (rawToggle) {
      rawToggle.addEventListener('click', () => {
        const box = document.getElementById('rawJson');
        box.hidden = !box.hidden;
        rawToggle.textContent = box.hidden ? 'View raw response JSON' : 'Hide raw response JSON';
      });
    }

    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const text = r.email || JSON.stringify(rawData, null, 2);
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.textContent = '✓ Copied';
          setTimeout(() => (copyBtn.textContent = '📋 Copy email'), 1600);
        } catch (e) {
          log('✕ Clipboard write failed: ' + e.message, 'err');
        }
      });
    }

    const downloadBtn = document.getElementById('downloadReportBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${(r.company || 'prospect').toLowerCase().replace(/\s+/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const runAgainBtn = document.getElementById('runAgainBtn');
    if (runAgainBtn) {
      runAgainBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('run-again'));
      });
    }
  }

  function hideReport() {
    reportCard.hidden = true;
    reportCard.innerHTML = '';
  }

  return {
    resetConsole, log,
    setStatus,
    showProgress, setProgress, hideProgress,
    showAgentPanel, setAgentState, completeAllAgents, hideAgentPanel,
    renderReport, hideReport,
  };
})();
