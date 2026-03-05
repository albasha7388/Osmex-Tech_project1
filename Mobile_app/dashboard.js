/**
Sawtak - Dashboard JavaScript Module
Mobile-Optimized Dashboard Functionality
*/

const Dashboard = (function() {
    'use strict';
    
    // ============================================
    // DOM Elements
    // ============================================
    let sidebar;
    let sidebarToggle;
    let mainContent;
    let kpiContainer;
    let tableContainer;
    let statusFilter;
    let searchInput;
    let mobileMenuToggle;
    let refreshBtn;
    
    // State
    let currentFilters = {
        status: 'all',
        search: ''
    };
    let currentReports = [];
    let currentUser = {
        name: 'محمد أحمد',
        role: 'admin',
        avatar: 'م'
    };
    
    // ============================================
    // Initialization
    // ============================================
    function init() {
        // Cache DOM elements
        sidebar = document.querySelector('.dashboard__sidebar');
        sidebarToggle = document.querySelector('.dashboard__sidebar-toggle');
        mainContent = document.querySelector('.dashboard__main');
        kpiContainer = document.getElementById('kpi-container');
        tableContainer = document.getElementById('data-table-container');
        statusFilter = document.getElementById('status-filter');
        searchInput = document.getElementById('search-input');
        mobileMenuToggle = document.querySelector('.dashboard__sidebar-toggle--mobile');
        refreshBtn = document.getElementById('refresh-btn');
        
        // Initialize dashboard
        initDashboard();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // ============================================
    // Initialize Dashboard
    // ============================================
    async function initDashboard() {
        try {
            // Show loading states
            UI.showLoading(kpiContainer);
            UI.showLoading(tableContainer);
            
            // Fetch initial data
            const [stats, reports] = await Promise.all([
                API.getStats(),
                API.getReports(currentFilters)
            ]);
            
            // Store reports
            currentReports = reports;
            
            // Render components
            UI.renderKpiCards(stats, kpiContainer);
            renderMobileFriendlyTable(reports, tableContainer);
            
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            UI.showError(kpiContainer, 'فشل تحميل البيانات. يرجى المحاولة مرة أخرى.');
            UI.showError(tableContainer, 'فشل تحميل البيانات. يرجى المحاولة مرة أخرى.');
        }
    }
    
    // ============================================
    // Setup Event Listeners
    // ============================================
    function setupEventListeners() {
        // Sidebar toggle (desktop)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        // Mobile menu toggle
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
        }
        
        // Status filter
        if (statusFilter) {
            statusFilter.addEventListener('change', handleStatusFilter);
        }
        
        // Search input
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }
        
        // Refresh button
        if (refreshBtn) {
            refreshBtn.addEventListener('click', handleRefresh);
        }
        
        // Table row click (event delegation)
        if (tableContainer) {
            tableContainer.addEventListener('click', handleTableClick);
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboard);
        
        // Close sidebar on overlay click
        document.addEventListener('click', (e) => {
            const overlay = document.querySelector('.dashboard__sidebar-overlay');
            if (overlay && e.target === overlay) {
                toggleMobileSidebar();
            }
        });
    }
    
    // ============================================
    // Sidebar Functions
    // ============================================
    function toggleSidebar() {
        sidebar.classList.toggle('dashboard__sidebar--collapsed');
        
        // Update toggle icon
        const isCollapsed = sidebar.classList.contains('dashboard__sidebar--collapsed');
        const icon = sidebarToggle.querySelector('[data-lucide]');
        if (icon) {
            icon.setAttribute('data-lucide', isCollapsed ? 'chevron-left' : 'chevron-right');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    function toggleMobileSidebar() {
        sidebar.classList.toggle('dashboard__sidebar--open');
        
        // Add overlay
        let overlay = document.querySelector('.dashboard__sidebar-overlay');
        
        if (sidebar.classList.contains('dashboard__sidebar--open')) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'dashboard__sidebar-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 199;
                `;
                overlay.addEventListener('click', toggleMobileSidebar);
                document.body.appendChild(overlay);
            }
        } else if (overlay) {
            overlay.remove();
        }
    }
    
    // ============================================
    // Mobile-Friendly Table Rendering
    // ============================================
    function renderMobileFriendlyTable(reports, container) {
        if (!container) return;
        
        if (reports.length === 0) {
            UI.showEmpty(container, 'لا توجد بلاغات');
            return;
        }
        
        // Check if mobile view
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Mobile card view
            container.innerHTML = `
                <div class="reports-grid">
                    ${reports.map(report => `
                        <div class="report-card-mobile" data-report-id="${report.id}">
                            <div class="report-card-mobile__header">
                                <span class="report-card-mobile__id">${report.id}</span>
                                ${UI.createStatusPill(report.status)}
                            </div>
                            <div class="report-card-mobile__body">
                                <h4 class="report-card-mobile__title">${report.title}</h4>
                                <div class="report-card-mobile__meta">
                                    <span><i data-lucide="tag" style="width: 14px; height: 14px;"></i> ${report.category}</span>
                                    <span><i data-lucide="map-pin" style="width: 14px; height: 14px;"></i> ${report.location}</span>
                                </div>
                                <div class="report-card-mobile__footer">
                                    <span class="report-card-mobile__date">${report.date}</span>
                                    <span class="report-card-mobile__reporter">${report.reporter}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            // Desktop table view
            container.innerHTML = `
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>رقم البلاغ</th>
                            <th>العنوان</th>
                            <th>التصنيف</th>
                            <th>الموقع</th>
                            <th>الحالة</th>
                            <th>التاريخ</th>
                            <th>المرسل</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reports.map(report => `
                            <tr data-report-id="${report.id}">
                                <td>${report.id}</td>
                                <td>${report.title}</td>
                                <td>${report.category}</td>
                                <td>${report.location}</td>
                                <td>${UI.createStatusPill(report.status)}</td>
                                <td>${report.date}</td>
                                <td>${report.reporter}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        // Re-initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // ============================================
    // Filter Functions
    // ============================================
    async function handleStatusFilter(e) {
        currentFilters.status = e.target.value;
        await refreshTable();
    }
    
    async function handleSearch(e) {
        currentFilters.search = e.target.value;
        await refreshTable();
    }
    
    async function handleRefresh() {
        const originalContent = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> <span>جاري التحديث...</span>';
        refreshBtn.disabled = true;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        await refreshTable();
        
        refreshBtn.innerHTML = originalContent;
        refreshBtn.disabled = false;
    }
    
    async function refreshTable() {
        try {
            UI.showLoading(tableContainer);
            const reports = await API.getReports(currentFilters);
            currentReports = reports;
            renderMobileFriendlyTable(reports, tableContainer);
            
            // Re-initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error refreshing table:', error);
            UI.showError(tableContainer, 'فشل تحديث البيانات');
        }
    }
    
    // ============================================
    // Table Click Handler (Event Delegation)
    // ============================================
    function handleTableClick(e) {
        // Find the closest row or card
        const row = e.target.closest('tr[data-report-id]');
        const card = e.target.closest('.report-card-mobile[data-report-id]');
        
        if (row || card) {
            const reportId = (row || card).getAttribute('data-report-id');
            openReportDetails(reportId);
        }
    }
    
    // ============================================
    // Report Details
    // ============================================
    async function openReportDetails(reportId) {
        try {
            const report = await API.getReportById(reportId);
            
            if (report) {
                UI.showReportDetailsPanel(report);
            } else {
                UI.showToast('البلاغ غير موجود', 'error');
            }
        } catch (error) {
            console.error('Error fetching report details:', error);
            UI.showToast('فشل تحميل تفاصيل البلاغ', 'error');
        }
    }
    
    // ============================================
    // Report Actions
    // ============================================
    async function acknowledgeReport(reportId) {
        try {
            await API.acknowledgeReport(reportId);
            UI.closeReportDetailsPanel();
            UI.showToast('تم استلام البلاغ بنجاح', 'success');
            await refreshTable();
            await refreshStats();
        } catch (error) {
            console.error('Error acknowledging report:', error);
            UI.showToast('فشل استلام البلاغ', 'error');
        }
    }
    
    async function assignReport(reportId) {
        try {
            await API.assignReport(reportId, 'team-a');
            UI.closeReportDetailsPanel();
            UI.showToast('تم إسناد البلاغ للفريق بنجاح', 'success');
            await refreshTable();
            await refreshStats();
        } catch (error) {
            console.error('Error assigning report:', error);
            UI.showToast('فشل إسناد البلاغ', 'error');
        }
    }
    
    async function resolveReport(reportId) {
        try {
            await API.resolveReport(reportId);
            UI.closeReportDetailsPanel();
            UI.showToast('تم تحديد البلاغ كمحلول', 'success');
            await refreshTable();
            await refreshStats();
        } catch (error) {
            console.error('Error resolving report:', error);
            UI.showToast('فشل تحديث حالة البلاغ', 'error');
        }
    }
    
    async function closeReport(reportId) {
        try {
            await API.closeReport(reportId);
            UI.closeReportDetailsPanel();
            UI.showToast('تم إغلاق البلاغ بنجاح', 'success');
            await refreshTable();
            await refreshStats();
        } catch (error) {
            console.error('Error closing report:', error);
            UI.showToast('فشل إغلاق البلاغ', 'error');
        }
    }
    
    // ============================================
    // Refresh Stats
    // ============================================
    async function refreshStats() {
        try {
            const stats = await API.getStats();
            UI.renderKpiCards(stats, kpiContainer);
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error refreshing stats:', error);
        }
    }
    
    // ============================================
    // Keyboard Shortcuts
    // ============================================
    function handleKeyboard(e) {
        // Escape closes slide panel
        if (e.key === 'Escape') {
            UI.closeReportDetailsPanel();
            
            // Close mobile sidebar
            if (sidebar && sidebar.classList.contains('dashboard__sidebar--open')) {
                toggleMobileSidebar();
            }
        }
        
        // Ctrl/Cmd + K focuses search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // R refreshes table
        if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                handleRefresh();
            }
        }
    }
    
    // ============================================
    // Debounce Utility
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ============================================
    // Handle Window Resize
    // ============================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            renderMobileFriendlyTable(currentReports, tableContainer);
        }, 250);
    });
    
    // ============================================
    // Public API
    // ============================================
    return {
        init,
        acknowledgeReport,
        assignReport,
        resolveReport,
        closeReport
    };
})();

// Initialize dashboard on DOM ready
document.addEventListener('DOMContentLoaded', Dashboard.init);