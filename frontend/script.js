const history = [];

async function sendRequest() {
  const prompt = document.getElementById('prompt').value.trim();
  const endpoint = document.getElementById('endpoint').value.trim();

  if (!prompt || !endpoint) return;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    showResponse(res.status, data);
    addHistory(prompt);

  } catch (err) {
    showError(err.message);
  }
}

function showResponse(status, data) {
  document.getElementById('responseSection').classList.remove('hidden');

  document.getElementById('status').textContent = `Status: ${status}`;

  let text = '';
  if (data.choices?.[0]?.message?.content) {
    text = data.choices[0].message.content;
  } else if (data.response) {
    text = data.response;
  } else {
    text = JSON.stringify(data, null, 2);
  }

  document.getElementById('output').textContent = text;
  document.getElementById('model').textContent = `Model: ${data.model || '—'}`;
}

function showError(msg) {
  document.getElementById('responseSection').classList.remove('hidden');
  document.getElementById('status').textContent = 'Error';
  document.getElementById('output').textContent = msg;
}

function addHistory(prompt) {
  history.unshift(prompt);
  if (history.length > 5) history.pop();
  renderHistory();
}

function renderHistory() {
  const section = document.getElementById('historySection');
  const container = document.getElementById('history');

  section.classList.remove('hidden');

  container.innerHTML = history.map((p, i) => `
    <div class="history-item" onclick="loadHistory(${i})">
      ${p}
    </div>
  `).join('');
}

function loadHistory(i) {
  document.getElementById('prompt').value = history[i];
}