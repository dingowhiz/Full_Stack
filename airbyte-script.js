// Tab Navigation
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab
        tab.classList.add('active');

        // Show corresponding content
        const tabId = tab.getAttribute('data-tab');
        const content = document.getElementById(tabId);
        if (content) {
            content.classList.add('active');
        }
    });
});

// Search Functionality for Streams
const searchInput = document.getElementById('streamSearch');
const streamsTableBody = document.getElementById('streamsTableBody');

if (searchInput && streamsTableBody) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = streamsTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const streamName = row.querySelector('.stream-name');
            if (streamName) {
                const text = streamName.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    });
}

// Simulate real-time data updates
function updateFreshDates() {
    const freshDates = document.querySelectorAll('.fresh-date');
    const timestamps = [
        '17 hours ago',
        '2 hours ago',
        '5 hours ago'
    ];

    freshDates.forEach((element, index) => {
        if (timestamps[index]) {
            element.textContent = timestamps[index];
        }
    });
}

// Sync Now Button Handler
const syncNowBtn = document.querySelector('.connection-actions .btn-secondary:nth-child(2)');
if (syncNowBtn) {
    syncNowBtn.addEventListener('click', () => {
        // Show syncing state
        const originalText = syncNowBtn.innerHTML;
        syncNowBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="animation: spin 1s linear infinite;">
                <path d="M13.5 8a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
            </svg>
            Syncing...
        `;
        syncNowBtn.disabled = true;

        // Simulate sync completion after 2 seconds
        setTimeout(() => {
            syncNowBtn.innerHTML = originalText;
            syncNowBtn.disabled = false;
            showNotification('Sync completed successfully!', 'success');
        }, 2000);
    });
}

// Enable/Disable Toggle
const enabledBtn = document.querySelector('.btn-enabled');
if (enabledBtn) {
    let isEnabled = true;

    enabledBtn.addEventListener('click', () => {
        isEnabled = !isEnabled;

        if (isEnabled) {
            enabledBtn.textContent = 'ENABLED';
            enabledBtn.style.backgroundColor = 'var(--success-color)';
            enabledBtn.style.borderColor = 'var(--success-color)';
            showNotification('Connection enabled', 'success');
        } else {
            enabledBtn.textContent = 'DISABLED';
            enabledBtn.style.backgroundColor = 'var(--text-secondary)';
            enabledBtn.style.borderColor = 'var(--text-secondary)';
            showNotification('Connection disabled', 'info');
        }
    });
}

// Menu Button Handlers
const menuButtons = document.querySelectorAll('.btn-menu');
menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showContextMenu(e.target, [
            { label: 'View Details', action: () => console.log('View Details') },
            { label: 'Reset Stream', action: () => console.log('Reset Stream') },
            { label: 'Disable Stream', action: () => console.log('Disable Stream') }
        ]);
    });
});

// Context Menu
function showContextMenu(target, items) {
    // Remove existing context menu if any
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        box-shadow: var(--shadow-lg);
        padding: 0.5rem 0;
        z-index: 1000;
        min-width: 150px;
    `;

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.label;
        menuItem.style.cssText = `
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-size: 0.875rem;
            transition: background-color 0.2s;
        `;

        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.backgroundColor = 'var(--bg-secondary)';
        });

        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.backgroundColor = 'transparent';
        });

        menuItem.addEventListener('click', () => {
            item.action();
            menu.remove();
        });

        menu.appendChild(menuItem);
    });

    // Position menu near the button
    const rect = target.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left - 100}px`;

    document.body.appendChild(menu);

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', () => {
            menu.remove();
        }, { once: true });
    }, 0);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';

    const bgColors = {
        success: 'var(--success-color)',
        error: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        info: 'var(--primary-color)'
    };

    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${bgColors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        font-size: 0.875rem;
        font-weight: 500;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile Sidebar Toggle
function createMobileMenu() {
    if (window.innerWidth <= 768) {
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.style.cssText = `
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1001;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 1.5rem;
            cursor: pointer;
            display: none;
        `;

        if (window.innerWidth <= 768) {
            menuBtn.style.display = 'block';
        }

        menuBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');
        });

        document.body.appendChild(menuBtn);

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar.contains(e.target) && e.target !== menuBtn) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Simulate Data Loading
function simulateDataLoading() {
    const statValues = document.querySelectorAll('.stat-value');

    // Animate numbers counting up
    statValues.forEach(stat => {
        const finalValue = stat.textContent;
        if (finalValue.match(/\d+/)) {
            const num = parseInt(finalValue.replace(/,/g, ''));
            let current = 0;
            const increment = num / 20;

            const timer = setInterval(() => {
                current += increment;
                if (current >= num) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, 50);
        }
    });
}

// Run on page load
window.addEventListener('load', () => {
    console.log('Airbyte Pipeline Manager initialized');
    updateFreshDates();

    // Simulate initial data load
    setTimeout(simulateDataLoading, 100);
});

// Auto-refresh fresh dates every minute
setInterval(updateFreshDates, 60000);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
    }

    // Ctrl/Cmd + S for sync
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        syncNowBtn?.click();
    }

    // Tab navigation with number keys (1-5)
    if (e.key >= '1' && e.key <= '5') {
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            tabs[tabIndex].click();
        }
    }
});

// Add tooltip to buttons
const buttons = document.querySelectorAll('button');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
        const text = e.target.textContent.trim();
        if (text) {
            e.target.title = text;
        }
    });
});

console.log('Keyboard shortcuts: Ctrl+K (Search), Ctrl+S (Sync), 1-5 (Tab Navigation)');
