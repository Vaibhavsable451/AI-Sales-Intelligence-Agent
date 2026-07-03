/**
 * workflow.js
 * Renders the "webhook -> ... -> slack" step list and animates progress
 * through it while a run is in flight. Purely visual — it does not know
 * the real status of each n8n node, so it advances on a timer and is
 * capped just short of 100% until the actual response comes back.
 */

const WORKFLOW_STEPS = [
  { icon: '🌐', label: 'Webhook received' },
  { icon: '🕸️', label: 'Website scraper' },
  { icon: '🔍', label: 'Company research' },
  { icon: '🧠', label: 'Pain point agent' },
  { icon: '🧠', label: 'Personalization agent' },
  { icon: '✍️', label: 'Sales copywriter' },
  { icon: '📧', label: 'Gmail draft' },
  { icon: '📊', label: 'Sheets log' },
  { icon: '💬', label: 'Slack notify' },
];

const Workflow = (() => {
  let container = null;
  let stepEls = [];
  let currentIndex = -1;
  let timer = null;

  function mount(el) {
    container = el;
    container.innerHTML = '';
    stepEls = WORKFLOW_STEPS.map((step, i) => {
      if (i > 0) {
        const connector = document.createElement('div');
        connector.className = 'wf-connector';
        container.appendChild(connector);
      }
      const row = document.createElement('div');
      row.className = 'wf-step';
      row.innerHTML = `<div class="wf-icon">${step.icon}</div><div class="wf-label">${step.label}</div>`;
      container.appendChild(row);
      return row;
    });
    container.hidden = false;
  }

  function connectorAt(i) {
    // connectors are interleaved: step0, conn1, step1, conn2, step2...
    return container.children[i * 2 - 1] || null;
  }

  function setActive(i) {
    stepEls.forEach((el, idx) => {
      el.classList.toggle('active', idx === i);
      el.classList.toggle('done', idx < i);
      el.classList.remove('failed');
    });
    for (let k = 1; k <= i; k++) {
      const c = connectorAt(k);
      if (c) c.classList.add('done');
    }
    currentIndex = i;
  }

  function markFailed() {
    if (currentIndex >= 0 && stepEls[currentIndex]) {
      stepEls[currentIndex].classList.remove('active');
      stepEls[currentIndex].classList.add('failed');
    }
    stop();
  }

  function complete() {
    stop();
    setActive(WORKFLOW_STEPS.length); // marks everything done, nothing active
    stepEls.forEach(el => el.classList.add('done'));
  }

  function start(onStep) {
    reset();
    let i = 0;
    setActive(0);
    if (onStep) onStep(0, WORKFLOW_STEPS[0]);
    timer = setInterval(() => {
      // advance but never reach the final "delivery" steps on our own —
      // those only light up once the real response confirms delivery
      if (i < WORKFLOW_STEPS.length - 3) {
        i += 1;
        setActive(i);
        if (onStep) onStep(i, WORKFLOW_STEPS[i]);
      }
    }, 850);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function reset() {
    stop();
    currentIndex = -1;
    stepEls.forEach(el => el.classList.remove('active', 'done', 'failed'));
    Array.from(container.children).forEach(c => {
      if (c.classList.contains('wf-connector')) c.classList.remove('done');
    });
  }

  return { mount, start, stop, reset, complete, markFailed, steps: WORKFLOW_STEPS };
})();
