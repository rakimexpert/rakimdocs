const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../index.html');

if (!fs.existsSync(htmlPath)) {
    console.error('❌ Erro: index.html não encontrado.');
    process.exit(1);
}

let html = fs.readFileSync(htmlPath, 'utf8');

const customCSS = `
<style>
/* --- RAKIM CUSTOM STYLES START --- */
:root {
    --rakim-primary: #6200ea;
    --rakim-dark-header: #0a0e14;
    --rakim-text: #ffffff;
    --table-header-bg: #f3f4f6;
    --table-border: #e5e7eb;
}

body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }

.rakim-header {
    background-color: var(--rakim-primary);
    color: var(--rakim-text);
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    position: fixed;
    top: 0; left: 0; width: 100%; height: 70px;
    z-index: 99999; /* Z-Index altíssimo */
    box-sizing: border-box;
}

body.dark-mode .rakim-header { background-color: var(--rakim-dark-header) !important; }

.rakim-brand { font-size: 24px; font-weight: 800; text-transform: uppercase; }
.rakim-nav { display: flex; align-items: center; gap: 20px; }
.rakim-nav a { color: rgba(255,255,255,0.9); text-decoration: none; font-weight: 500; font-size: 14px; }
.theme-toggle { background: rgba(255,255,255,0.2); border: none; cursor: pointer; font-size: 18px; padding: 8px; border-radius: 50%; width: 36px; height: 36px; }

/* FIX: Em vez de mexer na altura, apenas damos padding no topo do body */
body {
    padding-top: 70px !important; 
}

#opencollection-container {
    /* Removido height calc e padding conflituoso */
    width: 100%;
}

/* --- TABELAS PREMIUM --- */
#opencollection-container table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin: 20px 0 !important;
    font-size: 14px !important;
    border: 1px solid var(--table-border) !important;
    display: table !important; /* Força display table */
}

#opencollection-container th {
    background-color: var(--table-header-bg) !important;
    color: #111827 !important;
    font-weight: 600 !important;
    text-align: left !important;
    padding: 12px 16px !important;
    border-bottom: 2px solid var(--table-border) !important;
    white-space: nowrap !important;
}

#opencollection-container td {
    padding: 12px 16px !important;
    border-bottom: 1px solid var(--table-border) !important;
    text-align: left !important;
    vertical-align: top !important;
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    max-width: 400px !important;
    color: #374151 !important;
}

/* --- DARK MODE --- */
body.dark-mode { background-color: #000; }

/* Inversão mais segura */
body.dark-mode #opencollection-container { 
    filter: invert(1) hue-rotate(180deg);
}

body.dark-mode img, body.dark-mode video { 
    filter: invert(1) hue-rotate(180deg);
}

/* O header não precisa de filtro, pois já tem cor definida */
body.dark-mode .rakim-header { 
    filter: none !important;
}
</style>
`

const customHeader = `
<!-- RAKIM HEADER START -->
<header class="rakim-header">
    <div class="rakim-brand">
        RAKIM <span style="font-weight:300; opacity: 0.8">Expert</span>
    </div>
    <nav class="rakim-nav">
        <a href="https://rakim.com.br" target="_blank">Site Oficial</a>
        <a href="mailto:suporte@rakim.com.br">Suporte</a>
        <button class="theme-toggle" onclick="toggleTheme()">🌙</button>
    </nav>
</header>

<script>
    function toggleTheme() {
        const body = document.body;
        const btn = document.querySelector('.theme-toggle');
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        btn.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('rakim-theme', isDark ? 'dark' : 'light');
    }
    (function() {
        const savedTheme = localStorage.getItem('rakim-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            setTimeout(() => {
                const btn = document.querySelector('.theme-toggle');
                if(btn) btn.textContent = '☀️';
            }, 100);
        }
    })();
</script>
<!-- RAKIM HEADER END -->
`;

// --- LIMPEZA E INJEÇÃO ---
const cssStartMarker = '/* --- RAKIM CUSTOM STYLES START --- */';
if (html.includes(cssStartMarker)) {
    html = html.replace(/<style>[\s\S]*?--- RAKIM CUSTOM STYLES END ---[\s\S]*?<\/style>/, '');
}

if (html.includes('<!-- RAKIM HEADER START -->')) {
    html = html.replace(/<!-- RAKIM HEADER START -->[\s\S]*?<!-- RAKIM HEADER END -->/, '');
}

if (html.includes('</head>')) {
    html = html.replace('</head>', `${customCSS}\n</head>`);
}
if (html.includes('<body>')) {
    html = html.replace('<body>', `<body>\n${customHeader}`);
}

fs.writeFileSync(htmlPath, html);
console.log('✅ Sucesso! CSS Simplificado e Restaurado.');
