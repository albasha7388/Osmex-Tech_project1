/**
Sawtak - UI Module
Mobile-Optimized DOM manipulation and component rendering
*/

const UI = (function() {
    'use strict';
    
    // Status configuration
    const STATUS_CONFIG = {
        'new': { label: 'جديد', class: 'pill--new', icon: 'circle', color: 'info' },
        'acknowledged': { label: 'تم الاستلام', class: 'pill--acknowledged', icon: 'check', color: 'warning' },
        'in-progress': { label: 'قيد المعالجة', class: 'pill--in-progress', icon: 'loader', color: 'purple' },
        'resolved': { label: 'تم الحل', class: 'pill--resolved', icon: 'check-circle', color: 'success' },
        'closed': { label: 'مغلق', class: 'pill--closed', icon: 'x-circle', color: 'gray' }
    };
    
    /**
     * Get status label
     */
    function getStatusLabel(status) {
        return STATUS_CONFIG[status]?.label || 'جديد';
    }
    
    /**
     * Create a status pill element
     */
    function createStatusPill(status) {
        const config = STATUS_CONFIG[status] || STATUS_CONFIG['new'];
        return `<span class="pill ${config.class}">${config.label}</span>`;
    }
    
    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            toast.style.transition = 'all 0.3s ease';
            
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    /**
     * Show loading state
     */
    function showLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="page-loading">
                <i data-lucide="loader" class="animate-spin" style="width: 40px; height: 40px; color: var(--color-accent);"></i>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Show error message
     */
    function showError(container, message) {
        if (!container) return;
        container.innerHTML = `
            <div class="error-state" style="text-align: center; padding: var(--spacing-xl);">
                <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--color-danger); margin-bottom: var(--spacing-md);"></i>
                <p style="color: var(--color-gray-600);">${message}</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Show empty state
     */
    function showEmpty(container, message = 'لا توجد بيانات') {
        if (!container) return;
        container.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: var(--spacing-xl);">
                <i data-lucide="inbox" style="width: 48px; height: 48px; color: var(--color-gray-400); margin-bottom: var(--spacing-md);"></i>
                <p style="color: var(--color-gray-600);">${message}</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Create report card
     */
    function createReportCard(report) {
        return `
            <div class="report-card" onclick="showReportDetails('${report.id}')">
                <img src="${report.image}" alt="${report.title}" class="report-card__image">
                <div class="report-card__content">
                    <h4 class="report-card__title">${report.title}</h4>
                    <div class="report-card__meta">
                        <i data-lucide="tag" style="width: 14px; height: 14px;"></i>
                        <span>${report.category}</span>
                    </div>
                    <div class="report-card__footer">
                        ${createStatusPill(report.status)}
                        <span class="text-muted" style="font-size: 12px;">${report.date}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render reports list
     */
    function renderReportsList(reports, container) {
        if (!container) return;
        
        if (reports.length === 0) {
            showEmpty(container);
            return;
        }
        
        container.innerHTML = reports.map(createReportCard).join('');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    /**
     * Create KPI card
     */
    function createKpiCard(kpi) {
        const changeClass = kpi.change.startsWith('+') ? 'kpi-card__change--positive' : 'kpi-card__change--negative';
        const changeIcon = kpi.change.startsWith('+') ? 'trending-up' : 'trending-down';
        
        return `
            <div class="kpi-card">
                <div class="kpi-card__header">
                    <span class="kpi-card__title">${kpi.title}</span>
                    <div class="kpi-card__icon kpi-card__icon--${kpi.color}">
                        <i data-lucide="${kpi.icon}"></i>
                    </div>
                </div>
                <div class="kpi-card__value">${kpi.value.toLocaleString('ar-SA')}</div>
                <div class="kpi-card__change ${changeClass}">
                    <i data-lucide="${changeIcon}" style="width: 14px; height: 14px;"></i>
                    <span>${kpi.change} من الشهر الماضي</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Render KPI cards grid
     */
    function renderKpiCards(stats, container) {
        if (!container) return;
        
        const kpis = [
            { title: 'بلاغات جديدة', value: stats.newReports, change: stats.changes.newReports, icon: 'inbox', color: 'blue' },
            { title: 'قيد المعالجة', value: stats.inProgress, change: stats.changes.inProgress, icon: 'clock', color: 'yellow' },
            { title: 'تم الحل', value: stats.resolved, change: stats.changes.resolved, icon: 'check-circle', color: 'green' },
            { title: 'هذا الشهر', value: stats.thisMonth, change: stats.changes.thisMonth, icon: 'calendar', color: 'purple' }
        ];
        
        container.innerHTML = kpis.map(createKpiCard).join('');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Public API
    return {
        getStatusLabel,
        createStatusPill,
        showToast,
        showLoading,
        showError,
        showEmpty,
        createReportCard,
        renderReportsList,
        createKpiCard,
        renderKpiCards
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}