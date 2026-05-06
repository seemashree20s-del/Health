// ====== GLOBAL DISTRIBUTED STATE SYNCHRONIZATION ======
// This logic guarantees unified system functionality across deployed clients
(function initGlobalState() {
    try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/get_global_state", false); // Synchronous block ensures script environment is hydrated before rendering
        xhr.send();
        if (xhr.status === 200) {
            const serverData = JSON.parse(xhr.responseText);
            // Preserve local authentication session, but overwrite global system registries
            const currentUser = localStorage.getItem('hs_currentUser');
            const adminSession = localStorage.getItem('hs_adminLoggedIn');
            
            // Clear current state and replace with server master state
            localStorage.clear();
            for (let key in serverData) {
                localStorage.setItem(key, serverData[key]);
            }
            
            // Restore authentication identity
            if (currentUser) localStorage.setItem('hs_currentUser', currentUser);
            if (adminSession) localStorage.setItem('hs_adminLoggedIn', adminSession);
        }
    } catch(e) {
        console.warn("Could not connect to Global State manager, using isolated local mode.");
    }

    // Intercept Storage mutations to continuously push data back
    const originalSetItem = window.localStorage.setItem;
    window.localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key.startsWith('hs_') && key !== 'hs_currentUser' && key !== 'hs_adminLoggedIn' && key !== 'hs_global_theme') {
            triggerServerSync();
        }
    };

    const originalRemoveItem = window.localStorage.removeItem;
    window.localStorage.removeItem = function(key) {
        originalRemoveItem.apply(this, arguments);
        if (key.startsWith('hs_') && key !== 'hs_currentUser' && key !== 'hs_adminLoggedIn' && key !== 'hs_global_theme') {
            triggerServerSync();
        }
    };

    const originalClear = window.localStorage.clear;
    window.localStorage.clear = function() {
        const currentUser = window.localStorage.getItem('hs_currentUser');
        const adminSession = window.localStorage.getItem('hs_adminLoggedIn');
        originalClear.apply(this, arguments);
        if (currentUser) originalSetItem.call(window.localStorage, 'hs_currentUser', currentUser);
        if (adminSession) originalSetItem.call(window.localStorage, 'hs_adminLoggedIn', adminSession);
        triggerServerSync(); // Clears server
    };

    let syncTimeout = null;
    function triggerServerSync() {
        // Debounce network requests
        if(syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
            const payload = {};
            for (let i = 0; i < window.localStorage.length; i++) {
                let k = window.localStorage.key(i);
                if (k && k.startsWith('hs_') && k !== 'hs_currentUser' && k !== 'hs_adminLoggedIn' && k !== 'hs_global_theme') {
                    payload[k] = window.localStorage.getItem(k);
                }
            }
            fetch('/api/set_global_state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(e => console.warn("Background sync failed."));
        }, 300); // 300ms debounce
    }
})();
// =======================================================


document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme from storage or default to 'dark'
    const savedTheme = localStorage.getItem('hs_global_theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // 2. Build Universal Toggle DOM mapping to UI requirement
    const pickerWrap = document.createElement('div');
    pickerWrap.className = 'theme-picker-overlay';
    
    // Dropdown container
    const menuWrap = document.createElement('div');
    menuWrap.className = 'theme-picker-menu';
    menuWrap.id = 'theme-sys-menu';
    
    const themes = [
        { id: 'dark', icon: 'fa-moon', label: 'Dark Mode' },
        { id: 'light', icon: 'fa-sun', label: 'Light Mode' },
        { id: 'neon', icon: 'fa-bolt', label: 'Cyber Neon' },
        { id: 'pastel', icon: 'fa-heart', label: 'Soft Pastel' },
        { id: 'minimal', icon: 'fa-leaf', label: 'Zen Minimal' }
    ];
    
    themes.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'theme-option';
        btn.innerHTML = `<i class="fa-solid ${t.icon}"></i> ${t.label}`;
        btn.onclick = () => {
            document.body.setAttribute('data-theme', t.id);
            localStorage.setItem('hs_global_theme', t.id);
            updateMainIcon(t.id);
            toggleMenu();
        };
        menuWrap.appendChild(btn);
    });

    // Main Toggle Button
    const mainBtn = document.createElement('button');
    mainBtn.className = 'theme-picker-btn';
    mainBtn.innerHTML = `<i class="fa-solid fa-palette" id="theme-sys-icon"></i>`;
    
    function toggleMenu() {
        menuWrap.classList.toggle('show');
    }
    
    mainBtn.onclick = toggleMenu;
    
    function updateMainIcon(currentThemeId) {
        const iconData = themes.find(x => x.id === currentThemeId);
        if(iconData) {
            document.getElementById('theme-sys-icon').className = `fa-solid ${iconData.icon}`;
        }
    }
    
    pickerWrap.appendChild(menuWrap);
    pickerWrap.appendChild(mainBtn);
    document.body.appendChild(pickerWrap);
    
    updateMainIcon(savedTheme);
});
