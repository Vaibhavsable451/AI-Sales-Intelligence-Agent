/**
 * api.js
 * Thin wrapper around the n8n webhook call. Keeps fetch/network concerns
 * out of the UI and workflow-animation code.
 */

const Api = (() => {
  async function runPipeline(webhookUrl, payload) {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server responded ${res.status}`);
    }

    return res.json();
  }

  return { runPipeline };
})();
