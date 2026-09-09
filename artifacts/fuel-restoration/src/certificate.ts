type CertificateDetails = {
  name: string;
  quantity: string;
  date: string;
};

const STYLE_ID = 'fuel-certificate-styles';
const MODAL_ID = 'fuel-certificate-modal';

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes fuel-confetti-fall {
      0% { transform: translate3d(0,-20px,0) rotate(0deg); opacity: 1; }
      100% { transform: translate3d(var(--x),72vh,0) rotate(720deg); opacity: 0; }
    }
    @keyframes fuel-pop-in {
      0% { transform: scale(.75) translateY(20px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }
    @keyframes fuel-pop-burst {
      0% { transform: scale(.3); opacity: 0; }
      45% { transform: scale(1.08); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .fuel-cert-overlay {
      position: fixed; inset: 0; z-index: 100;
      display: grid; place-items: center; padding: 20px;
      background: rgba(7,18,13,.82); backdrop-filter: blur(8px);
    }
    .fuel-cert-confetti { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
    .fuel-confetti-piece {
      position: absolute; top: 5vh; left: 50%; width: 9px; height: 16px;
      animation: fuel-confetti-fall 2.7s cubic-bezier(.2,.7,.3,1) forwards;
    }
    .fuel-cert-card {
      position: relative; width: min(620px, 100%); max-height: 92vh; overflow: auto;
      background: #e8dfc5; color: #16251d; border: 2px solid #8da98e;
      box-shadow: 0 24px 90px rgba(0,0,0,.45); padding: 12px;
      animation: fuel-pop-in .45s cubic-bezier(.2,.9,.2,1) both;
    }
    .fuel-cert-inner { border: 1px solid rgba(22,37,29,.35); padding: 30px; }
    .fuel-party-icon { animation: fuel-pop-burst .55s .12s both; }
    .fuel-cert-title { font: 800 38px/1.05 Inter,system-ui,sans-serif; letter-spacing:-.05em; }
    .fuel-cert-name { font: 700 34px/1.1 Inter,system-ui,sans-serif; margin: 12px 0; }
    .fuel-cert-actions { display:flex; gap:10px; flex-wrap:wrap; margin-top:24px; }
    .fuel-cert-button { border:0; cursor:pointer; padding:13px 18px; font:700 11px/1 Inter,system-ui,sans-serif; letter-spacing:.12em; text-transform:uppercase; }
    .fuel-cert-primary { background:#1e7b55; color:white; }
    .fuel-cert-secondary { background:transparent; color:#16251d; border:1px solid rgba(22,37,29,.45); }
    @media (max-width:640px) { .fuel-cert-inner { padding:22px; } .fuel-cert-title { font-size:30px; } .fuel-cert-name { font-size:27px; } }
    @media print {
      body > *:not(#fuel-certificate-modal) { display:none !important; }
      .fuel-cert-overlay { position:static; background:white; padding:0; }
      .fuel-cert-card { width:100%; max-height:none; box-shadow:none; border:0; }
      .fuel-cert-actions, .fuel-cert-confetti { display:none !important; }
    }
  `;
  document.head.appendChild(style);
}

function escapeXml(value: string) {
  const replacements: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  };
  return value.replace(/[<>&'"]/g, (character) => replacements[character] ?? character);
}

function createCertificateSvg(details: CertificateDetails) {
  const issued = details.date
    ? new Date(`${details.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const name = escapeXml(details.name);
  const quantity = escapeXml(details.quantity || '0');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <rect width="1600" height="1100" fill="#e8dfc5"/>
  <rect x="34" y="34" width="1532" height="1032" fill="none" stroke="#16251d" stroke-opacity=".45" stroke-width="3"/>
  <rect x="60" y="60" width="1480" height="980" fill="none" stroke="#1e7b55" stroke-width="8"/>
  <text x="110" y="145" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="7" fill="#16251d">FUEL RESTORATION</text>
  <text x="1490" y="145" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="22" letter-spacing="5" fill="#8a5e1c">CERTIFICATE / 01</text>
  <line x1="110" y1="190" x2="1490" y2="190" stroke="#16251d" stroke-opacity=".25"/>
  <text x="800" y="330" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="72" font-weight="800" fill="#16251d">Certificate of Appreciation</text>
  <text x="800" y="405" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="25" letter-spacing="5" fill="#16251d" opacity=".65">THIS CERTIFIES THAT</text>
  <text x="800" y="520" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="68" font-weight="700" fill="#1e7b55">${name}</text>
  <text x="800" y="590" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="26" fill="#16251d" opacity=".78">helped keep used cooking oil in circulation and out of local drains.</text>
  <line x1="250" y1="670" x2="1350" y2="670" stroke="#16251d" stroke-opacity=".25"/>
  <text x="360" y="750" font-family="Inter,Arial,sans-serif" font-size="20" letter-spacing="3" fill="#16251d" opacity=".6">CONTRIBUTION</text>
  <text x="360" y="800" font-family="Inter,Arial,sans-serif" font-size="38" font-weight="700" fill="#16251d">${quantity} litres</text>
  <text x="1240" y="750" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="20" letter-spacing="3" fill="#16251d" opacity=".6">ISSUED</text>
  <text x="1240" y="800" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="700" fill="#16251d">${escapeXml(issued)}</text>
  <text x="800" y="930" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" letter-spacing="3" fill="#16251d" opacity=".65">A CLEANER FUEL FUTURE, LOCALLY ROUTED.</text>
  <circle cx="800" cy="985" r="22" fill="none" stroke="#8a5e1c" stroke-width="5"/>
  <path d="M788 985l9 9 17-21" fill="none" stroke="#8a5e1c" stroke-width="5"/>
</svg>`;
}

function downloadCertificate(details: CertificateDetails) {
  const svg = createCertificateSvg(details);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = details.name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'contributor';
  link.href = url;
  link.download = `fuel-restoration-certificate-${safeName}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function closeCertificate() {
  document.getElementById(MODAL_ID)?.remove();
}

function showCertificate(details: CertificateDetails) {
  closeCertificate();
  ensureStyles();

  const overlay = document.createElement('div');
  overlay.id = MODAL_ID;
  overlay.className = 'fuel-cert-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Certificate of appreciation');

  const confetti = document.createElement('div');
  confetti.className = 'fuel-cert-confetti';
  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'fuel-confetti-piece';
    piece.style.setProperty('--x', `${Math.round((Math.random() - 0.5) * 95)}vw`);
    piece.style.left = `${Math.round(5 + Math.random() * 90)}%`;
    piece.style.animationDelay = `${Math.random() * .55}s`;
    piece.style.background = ['#1e7b55', '#e0a33a', '#d65b4a', '#4f8fbe', '#f0d15a'][index % 5];
    piece.style.transform = `rotate(${Math.round(Math.random() * 180)}deg)`;
    confetti.appendChild(piece);
  }

  const card = document.createElement('div');
  card.className = 'fuel-cert-card';
  card.innerHTML = `
    <div class="fuel-cert-inner">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
        <div><div style="font:700 10px/1 Inter,system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;opacity:.65">FUEL RESTORATION</div><div class="fuel-cert-title">You did it!</div></div>
        <div class="fuel-party-icon" style="font-size:42px" aria-hidden="true">🎉</div>
      </div>
      <div style="height:1px;background:rgba(22,37,29,.25);margin:22px 0"></div>
      <div style="font:700 10px/1 Inter,system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;opacity:.6">Certificate of Appreciation</div>
      <div class="fuel-cert-name">${escapeXml(details.name)}</div>
      <div style="font:400 14px/1.6 Inter,system-ui,sans-serif;opacity:.75">Thank you for keeping used cooking oil out of drains and helping move waste toward a better use.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;border-top:1px solid rgba(22,37,29,.25);margin-top:24px;padding-top:18px">
        <div><div style="font:700 9px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;opacity:.55">CONTRIBUTION</div><strong>${escapeXml(details.quantity || '0')} litres</strong></div>
        <div><div style="font:700 9px/1 Inter,system-ui,sans-serif;letter-spacing:.14em;opacity:.55">PICKUP DATE</div><strong>${escapeXml(details.date || 'Route day')}</strong></div>
      </div>
      <div class="fuel-cert-actions">
        <button class="fuel-cert-button fuel-cert-primary" data-action="download">Get your certificate</button>
        <button class="fuel-cert-button fuel-cert-secondary" data-action="print">Print / Save PDF</button>
        <button class="fuel-cert-button fuel-cert-secondary" data-action="close">Close</button>
      </div>
    </div>`;

  overlay.append(confetti, card);
  document.body.appendChild(overlay);

  card.querySelector('[data-action="download"]')?.addEventListener('click', () => downloadCertificate(details));
  card.querySelector('[data-action="print"]')?.addEventListener('click', () => window.print());
  card.querySelector('[data-action="close"]')?.addEventListener('click', closeCertificate);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeCertificate();
  });
}

export function initCertificateFlow() {
  if (typeof document === 'undefined') return;
  ensureStyles();

  document.addEventListener('submit', (event) => {
    const form = event.target instanceof HTMLFormElement ? event.target : null;
    if (!form || !form.querySelector('[data-testid="input-name"]')) return;

    const nameInput = form.querySelector<HTMLInputElement>('[data-testid="input-name"]');
    const quantityInput = form.querySelector<HTMLInputElement>('[data-testid="input-quantity"]');
    const dateInput = form.querySelector<HTMLInputElement>('[data-testid="input-date"]');
    const details: CertificateDetails = {
      name: nameInput?.value.trim() ?? '',
      quantity: quantityInput?.value.trim() ?? '',
      date: dateInput?.value ?? '',
    };

    if (!details.name) return;
    window.setTimeout(() => {
      if (document.getElementById('registration-success')) {
        showCertificate(details);
      }
    }, 120);
  }, true);
}
