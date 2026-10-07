(function () {
  'use strict';

  const API_URL =
    document.currentScript?.dataset?.apiUrl ||
    'http://localhost:8000';

  let history = [];
  let isExpanded = false;
  let isLightMode = localStorage.getItem('truvad_copilot_theme') === 'light';

  const CHIPS = [
    'Latest regulations?',
    'How TRUVAD works?',
    'Summarize updates',
  ];

  // SVG Icons
  const ICONS = {
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    chat: `<svg class="fab-icon icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    close: `<svg class="fab-icon icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    bot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
    collapse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    scale: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M6 8l6-5 6 5"/><path d="M3 14l3-6 3 6a3 3 0 0 1-6 0z"/><path d="M15 14l3-6 3 6a3 3 0 0 1-6 0z"/></svg>`,
  };

  function buildWidget() {
    const fab = document.createElement('button');
    fab.id = 'truvad-fab';
    fab.setAttribute('aria-label', 'Open TRUVAD Regulatory Copilot');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `
      ${ICONS.chat}
      ${ICONS.close}
      <span class="fab-badge" aria-label="Agent online"></span>
    `;

    const panel = document.createElement('div');
    panel.id = 'truvad-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'TRUVAD Regulatory Assistant');
    if (isLightMode) panel.classList.add('theme-light');

    panel.innerHTML = `
      <div id="truvad-header">
        <div class="header-left">
          <span class="header-star">❄</span>
          <span class="header-title">GRIP AI Copilot</span>
        </div>

        <div class="header-actions">
          <button class="header-btn" id="truvad-theme-btn" data-tooltip="Toggle Light/Dark Theme" aria-label="Toggle theme">
            ${isLightMode ? ICONS.moon : ICONS.sun}
          </button>
          <button class="header-btn" id="truvad-expand-btn" data-tooltip="Expand / Restore" aria-label="Expand or restore window">
            ${ICONS.expand}
          </button>
          <button class="header-btn" id="truvad-clear-btn" data-tooltip="Reset Conversation" aria-label="Reset conversation">
            ${ICONS.trash}
          </button>
          <button class="header-btn" id="truvad-close-btn" data-tooltip="Close" aria-label="Close widget">
            ${ICONS.close.replace('fab-icon icon-close', '')}
          </button>
        </div>
      </div>

      <div id="truvad-messages" role="log" aria-live="polite">
        <div class="welcome-block" id="truvad-welcome">
          <p class="welcome-text">
            Hi! I'm GRIP AI, your regulatory copilot. Ask me about compliance updates, regulations, or how TRUVAD can help.
          </p>
          <div class="chips-row" id="truvad-chips"></div>
        </div>

        <div id="truvad-typing">
          <div class="msg-avatar">${ICONS.bot}</div>
          <div class="typing-bubble">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>

      <div id="truvad-inputbar">
        <div class="input-container">
          <textarea
            id="truvad-input"
            rows="1"
            placeholder="Ask GRIP AI..."
            aria-label="Ask GRIP AI"
            maxlength="3000"
          ></textarea>
          <button id="truvad-send" aria-label="Send message">${ICONS.send}</button>
        </div>
        <div class="input-hint">
          <span>Press Enter to send, Shift+Enter for newline</span>
        </div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    return { fab, panel };
  }

  function renderChips() {
    const container = document.getElementById('truvad-chips');
    if (!container) return;
    container.innerHTML = `
      <div class="chips-subrow">
        <button class="chip">Latest regulations?</button>
        <button class="chip">How TRUVAD works?</button>
      </div>
      <div class="chips-subrow">
        <button class="chip">Summarize updates</button>
      </div>
    `;
    container.querySelectorAll('.chip').forEach(btn => {
      btn.addEventListener('click', () => sendMessage(btn.textContent.trim()));
    });
  }

  // Enhanced Regulatory Markdown & Structured Cards Parser
  function parseRegulatoryMarkdown(text) {
    const isRegulatoryResponse =
      text.includes('**Answer:**') &&
      text.includes('**Exact Source Citations:**');

    if (!isRegulatoryResponse) {
      // General conversational markdown parsing
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^---$/gm, '<hr>')
        .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*?<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
        .split(/\n{2,}/)
        .map(b => b.trim())
        .filter(Boolean)
        .map(b => /^(<ul>|<hr>)/.test(b) ? b : `<p>${b.replace(/\n/g, '<br>')}</p>`)
        .join('');
    }

    // Split text into regulatory sections
    let html = '';

    // Extract Answer section
    const answerMatch = text.match(/\*\*Answer:\*\*([\s\S]*?)(?=\*\*Exact Source Citations:\*\*|$)/i);
    if (answerMatch) {
      const answerContent = answerMatch[1].trim()
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*?<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
        .split(/\n{2,}/)
        .map(b => b.trim())
        .filter(Boolean)
        .map(b => /^(<ul>)/.test(b) ? b : `<p>${b.replace(/\n/g, '<br>')}</p>`)
        .join('');

      html += `
        <div class="reg-section">
          <span class="reg-section-label label-answer">⚖️ Direct Answer</span>
          <div class="reg-answer-body">${answerContent}</div>
        </div>
      `;
    }

    // Extract Exact Source Citations section
    const citationMatch = text.match(/\*\*Exact Source Citations:\*\*([\s\S]*?)(?=\*\*Effective Date:\*\*|$)/i);
    if (citationMatch) {
      const rawCitations = citationMatch[1].trim();
      let citationsHtml = '';

      if (rawCitations.includes('No verified source available')) {
        citationsHtml = `<div class="citation-card"><em>No verified source available.</em></div>`;
      } else {
        const lines = rawCitations.split('\n')
          .map(l => l.replace(/^[-•]\s*/, '').trim())
          .filter(Boolean);

        citationsHtml = lines.map(line => {
          // Detect URLs
          const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) {
            const url = urlMatch[1];
            const cleanLine = line.replace(url, '').replace(/—\s*—/g, '—').trim();
            return `
              <div class="citation-card">
                <div>
                  <div>${cleanLine || 'Official Regulatory Documentation'}</div>
                  <a href="${url}" target="_blank" rel="noopener noreferrer" class="citation-link">
                    ${ICONS.link} View Official Reference
                  </a>
                </div>
              </div>
            `;
          }
          return `<div class="citation-card"><div>${line}</div></div>`;
        }).join('');
      }

      html += `
        <div class="reg-section">
          <span class="reg-section-label label-citations">🔗 Exact Source Citations</span>
          <div class="citations-cluster">${citationsHtml}</div>
        </div>
      `;
    }

    // Extract Effective Date section
    const dateMatch = text.match(/\*\*Effective Date:\*\*([\s\S]*?)(?=\*\*Impacted Teams:\*\*|$)/i);
    if (dateMatch) {
      const dateText = dateMatch[1].trim();
      const isNotSpecified = /Not specified/i.test(dateText);
      html += `
        <div class="reg-section">
          <span class="reg-section-label label-date">📅 Effective Enforcement Date</span>
          <div>
            <span class="date-badge ${isNotSpecified ? 'not-specified' : ''}">
              ${ICONS.calendar} ${dateText}
            </span>
          </div>
        </div>
      `;
    }

    // Extract Impacted Teams section
    const teamsMatch = text.match(/\*\*Impacted Teams:\*\*([\s\S]*?)$/i);
    if (teamsMatch) {
      const rawTeams = teamsMatch[1].trim();
      const teamLines = rawTeams.split('\n')
        .map(t => t.replace(/^[-•]\s*/, '').trim())
        .filter(Boolean);

      const tagsHtml = teamLines.map(team => `
        <span class="team-tag">
          <span class="team-tag-dot"></span>
          ${team}
        </span>
      `).join('');

      html += `
        <div class="reg-section">
          <span class="reg-section-label label-teams">👥 Impacted Teams</span>
          <div class="teams-cluster">${tagsHtml || `<span class="team-tag">None identified</span>`}</div>
        </div>
      `;
    }

    return html || text;
  }

  function formatTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit',
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br>');
  }

  function scrollToBottom() {
    const el = document.getElementById('truvad-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }

  function showTyping(show) {
    const el = document.getElementById('truvad-typing');
    if (el) {
      el.style.display = show ? 'flex' : 'none';
      if (show) scrollToBottom();
    }
  }

  function copyToClipboard(rawText, btnElement) {
    navigator.clipboard.writeText(rawText).then(() => {
      btnElement.innerHTML = `${ICONS.check} Copied!`;
      btnElement.style.color = '#10B981';
      setTimeout(() => {
        btnElement.innerHTML = `${ICONS.copy} Copy`;
        btnElement.style.color = '';
      }, 2000);
    }).catch(() => {
      btnElement.textContent = 'Failed to copy';
    });
  }

  function appendMessage(role, content, isError = false) {
    const messages = document.getElementById('truvad-messages');
    const typing = document.getElementById('truvad-typing');

    const row = document.createElement('div');
    row.className = `msg-row ${role}`;

    if (role === 'bot') {
      const html = isError ? escapeHtml(content) : parseRegulatoryMarkdown(content);
      const cls = isError ? 'bubble error-msg' : 'bubble';

      row.innerHTML = `
        <div class="msg-avatar">${ICONS.bot}</div>
        <div class="msg-body">
          <div class="${cls}">${html}</div>
          <div class="msg-footer">
            <span class="msg-time">${formatTime()}</span>
            <div class="msg-actions">
              <button class="copy-btn" aria-label="Copy response">
                ${ICONS.copy} Copy
              </button>
            </div>
          </div>
        </div>
      `;

      const copyBtn = row.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => copyToClipboard(content, copyBtn));
      }
    } else {
      row.innerHTML = `
        <div class="msg-body">
          <div class="bubble">${escapeHtml(content)}</div>
          <div class="msg-footer">
            <span class="msg-time">${formatTime()}</span>
          </div>
        </div>
      `;
    }

    messages.insertBefore(row, typing);
    scrollToBottom();
  }

  async function sendMessage(text) {
    const input = document.getElementById('truvad-input');
    const sendBtn = document.getElementById('truvad-send');

    const msg = (text || input.value).trim();
    if (!msg) return;

    input.value = '';
    input.style.height = '24px';
    input.style.overflowY = 'hidden';
    sendBtn.disabled = true;


    appendMessage('user', msg);
    history.push({ role: 'user', content: msg });

    showTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: history.slice(0, -1),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error (${res.status})`);
      }

      const data = await res.json();
      const reply = data.reply || 'No regulatory guidance returned.';

      showTyping(false);
      appendMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });

      if (history.length > 50) history = history.slice(-50);

    } catch (err) {
      showTyping(false);
      appendMessage('bot',
        `⚠️ ${err.message || 'Could not connect to TRUVAD API. Please ensure the backend server is running.'}`,
        true
      );
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function autoResize(el) {
    el.style.height = 'auto';
    const newHeight = Math.max(el.scrollHeight, 24);
    el.style.height = Math.min(newHeight, 120) + 'px';
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
  }

  function togglePanel() {
    const panel = document.getElementById('truvad-panel');
    const fab = document.getElementById('truvad-fab');
    const isOpen = panel.classList.toggle('is-visible');
    fab.classList.toggle('is-open', isOpen);
    fab.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      document.getElementById('truvad-input').focus();
    }
  }

  function toggleExpand() {
    const panel = document.getElementById('truvad-panel');
    const btn = document.getElementById('truvad-expand-btn');
    isExpanded = !isExpanded;
    panel.classList.toggle('is-expanded', isExpanded);
    btn.innerHTML = isExpanded ? ICONS.collapse : ICONS.expand;
    btn.setAttribute('data-tooltip', isExpanded ? 'Restore Size' : 'Expand View');
  }

  function toggleTheme() {
    const panel = document.getElementById('truvad-panel');
    const btn = document.getElementById('truvad-theme-btn');
    isLightMode = !isLightMode;
    panel.classList.toggle('theme-light', isLightMode);
    localStorage.setItem('truvad_copilot_theme', isLightMode ? 'light' : 'dark');
    btn.innerHTML = isLightMode ? ICONS.moon : ICONS.sun;
  }

  function clearChat() {
    if (history.length === 0) return;
    const confirmReset = window.confirm('Reset conversation and clear message history?');
    if (!confirmReset) return;

    history = [];
    const messages = document.getElementById('truvad-messages');
    const typing = document.getElementById('truvad-typing');

    // Remove all message rows
    const rows = messages.querySelectorAll('.msg-row');
    rows.forEach(r => r.remove());

    // Restore welcome card
    const welcome = document.getElementById('truvad-welcome');
    if (welcome) welcome.style.display = 'block';

    scrollToBottom();
  }

  function init() {
    buildWidget();
    renderChips();

    // Event listeners
    document.getElementById('truvad-fab')
      .addEventListener('click', togglePanel);

    document.getElementById('truvad-close-btn')
      .addEventListener('click', togglePanel);

    document.getElementById('truvad-expand-btn')
      .addEventListener('click', toggleExpand);

    document.getElementById('truvad-theme-btn')
      .addEventListener('click', toggleTheme);

    document.getElementById('truvad-clear-btn')
      .addEventListener('click', clearChat);

    document.getElementById('truvad-send')
      .addEventListener('click', () => sendMessage());

    const input = document.getElementById('truvad-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    input.addEventListener('input', function () {
      autoResize(this);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const panel = document.getElementById('truvad-panel');
        if (panel.classList.contains('is-visible')) togglePanel();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
