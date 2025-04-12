// Partikel Animation
function initParticles() {
    const particles = document.querySelector('.particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Zufällige Größe
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Zufällige Position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Zufällige Animation Verzögerung und Dauer
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 5;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
        
        // Zufällige Farbe
        const colors = ['var(--primary-color)', 'var(--accent-color)', 'var(--gradient-start)', 'var(--gradient-end)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.backgroundColor = color;
        particle.style.opacity = Math.random() * 0.6 + 0.1;
        
        particles.appendChild(particle);
    }
}
<script src="https://fengari.io/releases/fengari-web.js"></script>
// Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    
    // Füge Sound-Effekte hinzu
    playNotificationSound(type);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

// Sound-Effekte
function playNotificationSound(type) {
    // Benutzen von AudioContext API für moderne Sound-Effekte
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Verschiedene Töne für verschiedene Notification-Typen
    switch(type) {
        case 'success': 
            oscillator.frequency.value = 880;
            break;
        case 'error': 
            oscillator.frequency.value = 220;
            break;
        case 'warning': 
            oscillator.frequency.value = 440;
            break;
        case 'info': 
            oscillator.frequency.value = 660;
            break;
    }
    
    gainNode.gain.value = 0.05; // Leise Sound-Effekte
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 150);
}

// Code Formatting mit verbesserter Formatierung
function formatCode() {
    const editor = document.getElementById('editor');
    const code = editor.value;
    try {
        const formatted = formatCodeByLanguage(code, document.getElementById('languageSelect').value);
        editor.value = formatted;
        showToast('Code formatted successfully!', 'success');
        // Füge einen Animation-Effekt hinzu
        editor.classList.add('highlight-animation');
        setTimeout(() => {
            editor.classList.remove('highlight-animation');
        }, 1000);
    } catch (error) {
        showToast('Error formatting code: ' + error.message, 'error');
    }
}

function formatCodeByLanguage(code, language) {
    // Basic formatting for demonstration
    const lines = code.split('\n');
    let formatted = '';
    let indent = 0;
    
    for (let line of lines) {
        line = line.trim();
        if (line.includes('}') || line.includes(']') || line.includes(')')) indent = Math.max(0, indent - 1);
        formatted += '    '.repeat(indent) + line + '\n';
        if (line.includes('{') || line.includes('[') || line.includes('(') && !line.includes(')')) indent++;
    }
    
    return formatted;
}

// Auto Save Feature
let autoSaveInterval;
function toggleAutoSave() {
    const isAutoSave = document.getElementById('autoSaveSwitch').checked;
    if (isAutoSave) {
        autoSaveInterval = setInterval(saveCode, 30000); // Save every 30 seconds
        showToast('Auto save enabled', 'success');
    } else {
        clearInterval(autoSaveInterval);
        showToast('Auto save disabled', 'warning');
    }
    localStorage.setItem('autoSave', isAutoSave);
}

// Enhanced Code Running
function runCode() {
    const code = document.getElementById('editor').value;
    const language = document.getElementById('languageSelect').value;
    const outputArea = document.getElementById('output');
    const runButton = document.querySelector('.run-btn');

    // Füge Animation für das Output-Fenster hinzu
    outputArea.innerHTML = '';
    outputArea.classList.remove('fade-in');
    void outputArea.offsetWidth;
    outputArea.classList.add('fade-in');

    if (!code.trim()) {
        showToast('No code to run', 'warning');
        return;
    }

    runButton.disabled = true;
    runButton.innerHTML = '<div class="loading"></div> Running...';

    // Füge eine kleine Verzögerung hinzu, um bessere Benutzererfahrung zu bieten
    setTimeout(() => {
        try {
            if (language === 'lua') {
    const lua = fengari.lua;
    const L = lua.luaL_newstate();
    lua.luaL_openlibs(L);
    lua.luaL_loadstring(L, code);
    lua.lua_pcall(L, 0, lua.LUA_MULTRET, 0);
    const result = lua.lua_tostring(L, -1) || 'No output';
    lua.lua_close(L);
    outputArea.innerHTML = formatOutput(result);
    showToast('Lua executed successfully!', 'success');
            }
            else if (language === 'javascript') {
                // Sichere Ausführung im try-catch Block
                const result = executeJavaScript(code);
                outputArea.innerHTML = formatOutput(result);
                showToast('Code executed successfully!', 'success');
            } else if (language === 'html') {
                const iframe = document.createElement('iframe');
                iframe.srcdoc = code;
                iframe.style.width = "100%";
                iframe.style.height = "500px";
                iframe.style.border = "none";
                iframe.style.borderRadius = "8px";
                outputArea.appendChild(iframe);
                showToast('HTML rendered successfully!', 'success');
            } else if (language === 'css') {
                const iframe = document.createElement('iframe');
                iframe.srcdoc = `
                    <style>${code}</style>
                    <div class="test-container">
                        <h1>CSS Test</h1>
                        <p>This is a paragraph to test your CSS.</p>
                        <button>Test Button</button>
                        <div class="box">Test Box</div>
                    </div>
                `;
                iframe.style.width = "100%";
                iframe.style.height = "500px";
                iframe.style.border = "none";
                iframe.style.borderRadius = "8px";
                outputArea.appendChild(iframe);
                showToast('CSS applied successfully!', 'success');
            } else {
                outputArea.innerHTML = `<div class="code-output not-supported">
                    <i class="fas fa-info-circle"></i>
                    <p>Running code is only available for JavaScript, HTML, and CSS at the moment.</p>
                </div>`;
                showToast('Language not supported for running', 'warning');
            }
        } catch (error) {
            outputArea.innerHTML = `<div class="code-output error">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error: ${error.message}</p>
            </div>`;
            showToast('Error running code: ' + error.message, 'error');
        } finally {
            setTimeout(() => {
                runButton.disabled = false;
                runButton.innerHTML = '<i class="fas fa-play"></i> Run';
            }, 500);
        }
    }, 500);
}

// Sichere JavaScript-Ausführung
function executeJavaScript(code) {
    // Hier könnte man einen Sandbox-Mechanismus implementieren
    // Für diese Demo nutzen wir einfach eval mit try/catch
    return eval(code);
}

// Formatieren der Ausgabe für bessere Darstellung
function formatOutput(output) {
    if (output === undefined) return "<span class='output-undefined'>undefined</span>";
    if (output === null) return "<span class='output-null'>null</span>";
    
    if (typeof output === 'object') {
        try {
            return `<pre class="output-object">${JSON.stringify(output, null, 2)}</pre>`;
        } catch (e) {
            return String(output);
        }
    }
    
    return String(output);
}

// Code Export
function downloadCode() {
    const code = document.getElementById('editor').value;
    const language = document.getElementById('languageSelect').value;
    let fileExtension = '';

    switch (language) {
        case 'lua': fileExtension = '.lua'; break;
        case 'python': fileExtension = '.py'; break;
        case 'javascript': fileExtension = '.js'; break;
        case 'ruby': fileExtension = '.rb'; break;
        case 'php': fileExtension = '.php'; break;
        case 'java': fileExtension = '.java'; break;
        case 'cpp': fileExtension = '.cpp'; break;
        case 'html': fileExtension = '.html'; break;
        case 'css': fileExtension = '.css'; break;
        case 'bash': fileExtension = '.sh'; break;
        case 'swift': fileExtension = '.swift'; break;
        case 'typescript': fileExtension = '.ts'; break;
        case 'go': fileExtension = '.go'; break;
        case 'kotlin': fileExtension = '.kt'; break;
        default:
            showToast("Unknown language selected", "error");
            return;
    }

    if (code.trim() === "") {
        showToast("Please write some code before exporting", "warning");
        return;
    }

    // Füge ein visuelles Feedback hinzu
    const exportBtn = document.querySelector('.export-btn');
    exportBtn.classList.add('pulse');
    
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `code${fileExtension}`;
    link.click();
    showToast('Code exported successfully!', 'success');
    
    setTimeout(() => {
        exportBtn.classList.remove('pulse');
    }, 1000);
}

// Code Management
function clearEditor() {
    if (confirm('Are you sure you want to clear the editor?')) {
        document.getElementById('editor').value = '';
        updateLineCount();
        showToast('Editor cleared', 'info');
    }
}

// Settings Management
function openSettings() {
    const popup = document.getElementById('settingsPopup');
    popup.classList.remove('hide');
    popup.classList.add('show');
}

function closeSettings() {
    const popup = document.getElementById('settingsPopup');
    popup.classList.remove('show');
    popup.classList.add('hide');
    setTimeout(() => {
        popup.classList.remove('hide');
    }, 300);
}

function toggleDarkMode() {
    const isDarkMode = document.getElementById('darkModeSwitch').checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
}

function changeThemeColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--primary-hover', color);
    document.documentElement.style.setProperty('--gradient-start', color);
    document.documentElement.style.setProperty('--gradient-end', color);
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    event.target.classList.add('active');
    localStorage.setItem('themeColor', color);
}

function changeFontSize(size) {
    document.getElementById('editor').style.fontSize = `${size}px`;
    localStorage.setItem('fontSize', size);
}

// Utility Functions
function updateLineCount() {
    const editor = document.getElementById('editor');
    const text = editor.value;
    const lines = text.split('\n');
    const currentLine = lines.length;
    const currentColumn = text.length - text.lastIndexOf('\n');
    document.getElementById('lineCount').textContent = `Line: ${currentLine}, Column: ${currentColumn}`;
}

function updateLanguageInfo() {
    const language = document.getElementById('languageSelect').value;
    document.getElementById('languageInfo').textContent = `Language: ${language.charAt(0).toUpperCase() + language.slice(1)}`;
}

// Füge Tab-Handling hinzu
function handleTabKey(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const editor = document.getElementById('editor');
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        
        // Füge vier Leerzeichen anstelle eines Tabs ein
        editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd = start + 4;
    }
}

// Keyboard Shortcuts Management
let shortcuts = {
    run: { key: 'r', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
    export: { key: 's', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
    format: { key: 'f', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
    tab: { key: 'Tab', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false }
};

// Tastenkombinationen aus dem lokalen Speicher laden
function loadShortcuts() {
    const savedShortcuts = localStorage.getItem('shortcuts');
    if (savedShortcuts) {
        shortcuts = JSON.parse(savedShortcuts);
    }
}

// Tastenkombinationen im lokalen Speicher speichern
function saveShortcuts() {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

// Tastenkombinationen zurücksetzen
function resetShortcuts() {
    shortcuts = {
        run: { key: 'r', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
        export: { key: 's', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
        format: { key: 'f', ctrlKey: true, metaKey: false, shiftKey: false, altKey: false },
        tab: { key: 'Tab', ctrlKey: false, metaKey: false, shiftKey: false, altKey: false }
    };
    saveShortcuts();
    updateShortcutDisplay();
    showToast('Shortcuts reset to default', 'info');
}

// Tastenkombinationen Popup anzeigen/ausblenden
function toggleShortcutsPopup() {
    const popup = document.getElementById('shortcutsPopup');
    popup.classList.toggle('active');
    
    if (popup.classList.contains('active')) {
        updateShortcutDisplay();
    }
}

// Tastenkombinationen im Popup aktualisieren
function updateShortcutDisplay() {
    const shortcutItems = document.querySelectorAll('.shortcut-item');
    
    shortcutItems.forEach(item => {
        const editBtn = item.querySelector('.shortcut-edit');
        const shortcutName = editBtn.dataset.shortcut;
        const shortcutConfig = shortcuts[shortcutName];
        
        if (shortcutConfig) {
            const keysDiv = item.querySelector('.shortcut-keys');
            keysDiv.innerHTML = '';
            
            if (shortcutConfig.ctrlKey) {
                keysDiv.appendChild(createKeySpan('Ctrl'));
                keysDiv.appendChild(document.createTextNode(' + '));
            }
            
            if (shortcutConfig.shiftKey) {
                keysDiv.appendChild(createKeySpan('Shift'));
                keysDiv.appendChild(document.createTextNode(' + '));
            }
            
            if (shortcutConfig.altKey) {
                keysDiv.appendChild(createKeySpan('Alt'));
                keysDiv.appendChild(document.createTextNode(' + '));
            }
            
            if (shortcutConfig.metaKey) {
                keysDiv.appendChild(createKeySpan('Meta'));
                keysDiv.appendChild(document.createTextNode(' + '));
            }
            
            keysDiv.appendChild(createKeySpan(shortcutConfig.key.toUpperCase()));
        }
    });
}

// Helper-Funktion zum Erstellen von Tastenelementen
function createKeySpan(text) {
    const span = document.createElement('span');
    span.className = 'key';
    span.textContent = text;
    return span;
}

// Tastenkombination bearbeiten
let currentEditingShortcut = null;

function setupShortcutEditing() {
    const editButtons = document.querySelectorAll('.shortcut-edit');
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const shortcutName = this.dataset.shortcut;
            const shortcutItem = this.closest('.shortcut-item');
            
            // Bearbeitung abbrechen, wenn dieselbe Tastenkombination erneut geklickt wird
            if (currentEditingShortcut === shortcutName) {
                stopShortcutEditing();
                return;
            }
            
            // Vorherige Bearbeitung stoppen, falls vorhanden
            stopShortcutEditing();
            
            // Neue Bearbeitung beginnen
            currentEditingShortcut = shortcutName;
            shortcutItem.classList.add('editing');
            
            const keysDiv = shortcutItem.querySelector('.shortcut-keys');
            keysDiv.innerHTML = '<span class="key recording">Press a key...</span>';
            
            this.innerHTML = '<i class="fas fa-times"></i>';
            
            showToast('Press a key combination now...', 'info');
        });
    });
}

function stopShortcutEditing() {
    if (!currentEditingShortcut) return;
    
    const editButtons = document.querySelectorAll('.shortcut-edit');
    editButtons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-edit"></i>';
    });
    
    const editingItems = document.querySelectorAll('.shortcut-item.editing');
    editingItems.forEach(item => {
        item.classList.remove('editing');
    });
    
    updateShortcutDisplay();
    currentEditingShortcut = null;
}

// Tastenkombination aufzeichnen
function listenForShortcut(e) {
    if (!currentEditingShortcut) return;
    
    if (e.key === 'Escape') {
        stopShortcutEditing();
        return;
    }
    
    if (e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Shift') {
        return; // Modifikatoren ignorieren, wenn sie allein gedrückt werden
    }
    
    e.preventDefault();
    
    shortcuts[currentEditingShortcut] = {
        key: e.key,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey
    };
    
    saveShortcuts();
    showToast(`Shortcut for ${currentEditingShortcut} updated`, 'success');
    stopShortcutEditing();
}

// Tastenkombination auslösen
function handleKeyboardShortcuts(e) {
    // Keine Shortcuts auslösen, wenn ein Tastenkürzel bearbeitet wird
    if (currentEditingShortcut) return;
    
    // Keine Shortcuts auslösen, wenn in Formularfeldern
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' && e.key !== 'Tab') return;
    
    // Shortcuts prüfen
    Object.keys(shortcuts).forEach(action => {
        const shortcut = shortcuts[action];
        
        if (e.key.toLowerCase() === shortcut.key.toLowerCase() &&
            e.ctrlKey === shortcut.ctrlKey &&
            e.metaKey === shortcut.metaKey &&
            e.shiftKey === shortcut.shiftKey &&
            e.altKey === shortcut.altKey) {
            
            e.preventDefault();
            
            switch(action) {
                case 'run':
                    runCode();
                    break;
                case 'export':
                    downloadCode();
                    break;
                case 'format':
                    formatCode();
                    break;
                case 'tab':
                    if (document.activeElement === document.getElementById('editor')) {
                        handleTabKey(e);
                    }
                    break;
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Partikel-Animation initialisieren
    initParticles();
    
    // Tastenkombinationen laden
    loadShortcuts();
    
    // Tastenkombinationen-Bearbeitung einrichten
    setupShortcutEditing();
    
    updateLineCount();
    updateLanguageInfo();

    // Add event listeners
    const editor = document.getElementById('editor');
    editor.addEventListener('input', updateLineCount);
    editor.addEventListener('keydown', handleTabKey);
    document.getElementById('languageSelect').addEventListener('change', updateLanguageInfo);

    // Globalen Tastaturkürzel-Listener hinzufügen
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Keydown-Listener für Shortcut-Bearbeitung
    document.addEventListener('keydown', listenForShortcut);
    
    // Schließen von Popups beim Klicken außerhalb
    document.addEventListener('click', function(e) {
        const shortcutsPopup = document.getElementById('shortcutsPopup');
        if (e.target === shortcutsPopup) {
            toggleShortcutsPopup();
        }
    });
    
    // Füge Tastenkombination-Hilfe über Toast an
    setTimeout(() => {
        showToast('Press the Shortcuts button to view and customize keyboard shortcuts', 'info');
    }, 1500);
}); 
