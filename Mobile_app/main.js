/**
Sawtak - Main JavaScript Module
Mobile App Interactions and Navigation
*/

document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    
    // ============================================
    // State Management
    // ============================================
    const AppState = {
        currentScreen: 'onboarding',
        currentUser: null,
        currentRole: 'citizen', // 'citizen' or 'employee'
        currentPage: 'home',
        onboardingComplete: false
    };
    
    // ============================================
    // DOM Elements
    // ============================================
    const onboardingScreens = document.getElementById('onboarding-screens');
    const authScreens = document.getElementById('auth-screens');
    const appContainer = document.getElementById('app-container');
    const appMain = document.getElementById('app-main');
    const overlay = document.getElementById('overlay');
    const sideMenu = document.getElementById('side-menu');
    const bottomNav = document.getElementById('bottom-nav');
    
    // Onboarding Elements
    const onboardingSlides = document.querySelectorAll('.onboarding-slide');
    const onboardingNextBtn = document.getElementById('onboarding-next');
    const onboardingSkipBtn = document.getElementById('onboarding-skip');
    const indicators = document.querySelectorAll('.indicator');
    
    // Auth Elements
    const loginScreen = document.getElementById('login-screen');
    const signupScreen = document.getElementById('signup-screen');
    const otpScreen = document.getElementById('otp-screen');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const otpForm = document.getElementById('otp-form');
    
    // ============================================
    // Initialize Lucide Icons
    // ============================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // ============================================
    // Onboarding Navigation
    // ============================================
    let currentSlide = 0;
    
    function showSlide(index) {
        onboardingSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
        
        // Update button text on last slide
        if (index === onboardingSlides.length - 1) {
            onboardingNextBtn.innerHTML = 'ابدأ الآن <i data-lucide="arrow-left"></i>';
        } else {
            onboardingNextBtn.innerHTML = 'التالي <i data-lucide="arrow-left"></i>';
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function nextSlide() {
        if (currentSlide < onboardingSlides.length - 1) {
            showSlide(currentSlide + 1);
        } else {
            completeOnboarding();
        }
    }
    
    function completeOnboarding() {
        AppState.onboardingComplete = true;
        localStorage.setItem('onboardingComplete', 'true');
        
        // Animate out
        onboardingScreens.style.opacity = '0';
        onboardingScreens.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            onboardingScreens.style.display = 'none';
            authScreens.style.display = 'block';
            AppState.currentScreen = 'auth';
        }, 300);
    }
    
    if (onboardingNextBtn) {
        onboardingNextBtn.addEventListener('click', nextSlide);
    }
    
    if (onboardingSkipBtn) {
        onboardingSkipBtn.addEventListener('click', completeOnboarding);
    }
    
    // Check if onboarding was completed before
    if (localStorage.getItem('onboardingComplete') === 'true') {
        onboardingScreens.style.display = 'none';
        authScreens.style.display = 'block';
        AppState.currentScreen = 'auth';
    }
    
    // ============================================
    // Auth Screen Navigation
    // ============================================
    function showAuthScreen(screenId) {
        loginScreen.style.display = 'none';
        signupScreen.style.display = 'none';
        otpScreen.style.display = 'none';
        
        document.getElementById(screenId).style.display = 'block';
    }
    
    document.getElementById('show-signup')?.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthScreen('signup-screen');
    });
    
    document.getElementById('show-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthScreen('login-screen');
    });
    
    document.getElementById('back-to-signup')?.addEventListener('click', () => {
        showAuthScreen('signup-screen');
    });
    
    // ============================================
    // Login Form
    // ============================================
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        
        // Show loading
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> جاري الدخول...';
        submitBtn.disabled = true;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock login success
        AppState.currentUser = {
            id: 'user-001',
            name: 'أحمد محمد',
            phone: phone,
            role: 'citizen'
        };
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show OTP screen for demo
        document.getElementById('otp-phone-display').textContent = phone;
        showAuthScreen('otp-screen');
        startOTPTimer();
    });
    
    // ============================================
    // Signup Form
    // ============================================
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        // Validation
        if (password !== confirmPassword) {
            UI.showToast('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        // Get selected role
        const role = document.querySelector('input[name="user-role"]:checked').value;
        
        // Show loading
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> جاري الإنشاء...';
        submitBtn.disabled = true;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock signup success
        AppState.currentUser = {
            id: 'user-001',
            name: name,
            phone: phone,
            role: role
        };
        
        AppState.currentRole = role;
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show OTP screen
        document.getElementById('otp-phone-display').textContent = phone;
        showAuthScreen('otp-screen');
        startOTPTimer();
    });
    
    // ============================================
    // OTP Verification
    // ============================================
    let otpTimer;
    let timeLeft = 60;
    
    function startOTPTimer() {
        timeLeft = 60;
        const timerCount = document.getElementById('timer-count');
        const resendBtn = document.getElementById('resend-otp');
        const timerText = document.getElementById('timer-text');
        
        resendBtn.disabled = true;
        
        otpTimer = setInterval(() => {
            timeLeft--;
            timerCount.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                timerText.style.display = 'none';
                resendBtn.disabled = false;
            }
        }, 1000);
    }
    
    document.getElementById('resend-otp')?.addEventListener('click', () => {
        UI.showToast('تم إعادة إرسال الرمز', 'success');
        startOTPTimer();
        document.getElementById('timer-text').style.display = 'block';
    });
    
    // OTP Input Auto-focus
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    otpForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        
        if (otp.length !== 4) {
            UI.showToast('أدخل الرمز الكامل', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = otpForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> جاري التحقق...';
        submitBtn.disabled = true;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Login successful - show app
        authScreens.style.display = 'none';
        appContainer.style.display = 'flex';
        AppState.currentScreen = 'app';
        
        // Update user info in side menu
        updateUserInfo();
        
        // Load home page
        loadPage('home');
        
        UI.showToast('تم تسجيل الدخول بنجاح', 'success');
    });
    
    // ============================================
    // Side Menu
    // ============================================
    const menuBtn = document.getElementById('menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    
    function openSideMenu() {
        sideMenu.classList.add('side-menu--open');
        overlay.classList.add('overlay--visible');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSideMenu() {
        sideMenu.classList.remove('side-menu--open');
        overlay.classList.remove('overlay--visible');
        document.body.style.overflow = '';
    }
    
    menuBtn?.addEventListener('click', openSideMenu);
    closeMenuBtn?.addEventListener('click', closeSideMenu);
    overlay?.addEventListener('click', closeSideMenu);
    
    // Side Menu Navigation
    document.querySelectorAll('.side-menu__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Update active state
            document.querySelectorAll('.side-menu__link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            closeSideMenu();
            loadPage(page);
        });
    });
    
    // ============================================
    // Bottom Navigation
    // ============================================
    document.querySelectorAll('.bottom-nav__item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            
            if (page === 'create-report') {
                loadPage('create-report');
                return;
            }
            
            // Update active state
            document.querySelectorAll('.bottom-nav__item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('i')?.setAttribute('data-lucide', 
                    i.querySelector('i')?.getAttribute('data-lucide').replace('-2', ''));
            });
            item.classList.add('active');
            
            // Update icon for active state
            const activeIcon = item.querySelector('i');
            if (activeIcon) {
                activeIcon.setAttribute('data-lucide', activeIcon.getAttribute('data-lucide') + '-2');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
            
            loadPage(page);
        });
    });
    
    // ============================================
    // Page Loading
    // ============================================
    async function loadPage(page) {
        AppState.currentPage = page;
        
        // Show loading
        appMain.innerHTML = `
            <div class="page-loading">
                <i data-lucide="loader" class="animate-spin" style="width: 40px; height: 40px; color: var(--color-accent);"></i>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Simulate page load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load page content based on role
        switch(page) {
            case 'home':
                loadHomePage();
                break;
            case 'reports':
                loadReportsPage();
                break;
            case 'map':
                loadMapPage();
                break;
            case 'notifications':
                loadNotificationsPage();
                break;
            case 'profile':
                loadProfilePage();
                break;
            case 'create-report':
                loadCreateReportPage();
                break;
            default:
                loadHomePage();
        }
    }
    
    function loadHomePage() {
        const isEmployee = AppState.currentRole === 'employee';
        
        if (isEmployee) {
            // Employee Home
            appMain.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="page-header">
                        <h1 class="page-title">لوحة التحكم</h1>
                        <p class="page-subtitle">مرحباً، ${AppState.currentUser?.name || 'مستخدم'}</p>
                    </div>
                    
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-card__header">
                                <span class="kpi-card__title">بلاغات جديدة</span>
                                <div class="kpi-card__icon kpi-card__icon--blue">
                                    <i data-lucide="inbox"></i>
                                </div>
                            </div>
                            <div class="kpi-card__value">24</div>
                            <div class="kpi-card__change kpi-card__change--positive">
                                <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
                                <span>+12% من الشهر الماضي</span>
                            </div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-card__header">
                                <span class="kpi-card__title">قيد المعالجة</span>
                                <div class="kpi-card__icon kpi-card__icon--yellow">
                                    <i data-lucide="clock"></i>
                                </div>
                            </div>
                            <div class="kpi-card__value">18</div>
                            <div class="kpi-card__change kpi-card__change--negative">
                                <i data-lucide="trending-down" style="width: 14px; height: 14px;"></i>
                                <span>-5% من الشهر الماضي</span>
                            </div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-card__header">
                                <span class="kpi-card__title">تم الحل</span>
                                <div class="kpi-card__icon kpi-card__icon--green">
                                    <i data-lucide="check-circle"></i>
                                </div>
                            </div>
                            <div class="kpi-card__value">156</div>
                            <div class="kpi-card__change kpi-card__change--positive">
                                <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
                                <span>+23% من الشهر الماضي</span>
                            </div>
                        </div>
                        
                        <div class="kpi-card">
                            <div class="kpi-card__header">
                                <span class="kpi-card__title">هذا الشهر</span>
                                <div class="kpi-card__icon kpi-card__icon--purple">
                                    <i data-lucide="calendar"></i>
                                </div>
                            </div>
                            <div class="kpi-card__value">89</div>
                            <div class="kpi-card__change kpi-card__change--positive">
                                <i data-lucide="trending-up" style="width: 14px; height: 14px;"></i>
                                <span>+8% من الشهر الماضي</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card__header">
                            <h3 class="card__title">آخر البلاغات</h3>
                            <a href="#" class="auth__link" onclick="loadPage('reports')">عرض الكل</a>
                        </div>
                        <div class="card__body" id="recent-reports">
                            <!-- Reports will be loaded here -->
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Citizen Home
            appMain.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="page-header">
                        <h1 class="page-title">مرحباً، ${AppState.currentUser?.name || 'مستخدم'} 👋</h1>
                        <p class="page-subtitle">شارك في تحسين مدينتك</p>
                    </div>
                    
                    <div class="quick-action-card">
                        <button class="btn btn--accent btn--lg btn--full" onclick="loadPage('create-report')">
                            <i data-lucide="plus-circle"></i>
                            <span>إبلاغ جديد</span>
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card__header">
                            <h3 class="card__title">آخر بلاغاتي</h3>
                            <a href="#" class="auth__link" onclick="loadPage('reports')">عرض الكل</a>
                        </div>
                        <div class="card__body" id="my-reports">
                            <!-- Reports will be loaded here -->
                        </div>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-card__icon">
                                <i data-lucide="file-text"></i>
                            </div>
                            <div class="stat-card__value">5</div>
                            <div class="stat-card__label">بلاغاتي</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card__icon">
                                <i data-lucide="check-circle"></i>
                            </div>
                            <div class="stat-card__value">3</div>
                            <div class="stat-card__label">تم حلها</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card__icon">
                                <i data-lucide="clock"></i>
                            </div>
                            <div class="stat-card__value">2</div>
                            <div class="stat-card__label">قيد المعالجة</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Load reports
        loadRecentReports();
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function loadReportsPage() {
        appMain.innerHTML = `
            <div class="page-content animate-fade-in">
                <div class="page-header">
                    <h1 class="page-title">بلاغاتي</h1>
                </div>
                
                <div class="filters-bar">
                    <select class="form-select" id="status-filter">
                        <option value="all">جميع الحالات</option>
                        <option value="new">جديد</option>
                        <option value="acknowledged">تم الاستلام</option>
                        <option value="in-progress">قيد المعالجة</option>
                        <option value="resolved">تم الحل</option>
                        <option value="closed">مغلق</option>
                    </select>
                </div>
                
                <div id="reports-list">
                    <!-- Reports will be loaded here -->
                </div>
            </div>
        `;
        
        loadAllReports();
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function loadMapPage() {
        appMain.innerHTML = `
            <div class="page-content animate-fade-in">
                <div class="page-header">
                    <h1 class="page-title">خريطة البلاغات</h1>
                    <p class="page-subtitle">عرض جميع البلاغات القريبة</p>
                </div>
                
                <div class="map-container">
                    <div class="map-placeholder">
                        <i data-lucide="map-pin" style="width: 48px; height: 48px; color: var(--color-accent);"></i>
                        <p>سيتم عرض الخريطة هنا</p>
                        <p class="text-muted">تتطلب تكامل مع Google Maps أو Mapbox</p>
                    </div>
                </div>
                
                <div class="map-filters">
                    <button class="btn btn--outline btn--sm active">كل البلاغات</button>
                    <button class="btn btn--outline btn--sm">بلاغاتي</button>
                    <button class="btn btn--outline btn--sm">جديد</button>
                    <button class="btn btn--outline btn--sm">قيد المعالجة</button>
                </div>
            </div>
        `;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function loadNotificationsPage() {
        appMain.innerHTML = `
            <div class="page-content animate-fade-in">
                <div class="page-header">
                    <h1 class="page-title">الإشعارات</h1>
                    <button class="btn btn--ghost btn--sm" id="mark-all-read">
                        تحديد الكل كمقروء
                    </button>
                </div>
                
                <div class="notifications-list" id="notifications-list">
                    <!-- Notifications will be loaded here -->
                </div>
            </div>
        `;
        
        loadNotifications();
        
        document.getElementById('mark-all-read')?.addEventListener('click', () => {
            UI.showToast('تم تحديد جميع الإشعارات كمقروءة', 'success');
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function loadProfilePage() {
        appMain.innerHTML = `
            <div class="page-content animate-fade-in">
                <div class="page-header">
                    <h1 class="page-title">الملف الشخصي</h1>
                </div>
                
                <div class="profile-header">
                    <div class="profile-avatar">
                        <span>${AppState.currentUser?.name?.charAt(0) || 'م'}</span>
                    </div>
                    <h2 class="profile-name">${AppState.currentUser?.name || 'مستخدم'}</h2>
                    <p class="profile-role">${AppState.currentRole === 'employee' ? 'موظف جهة حكومية' : 'مواطن'}</p>
                </div>
                
                <div class="card">
                    <div class="card__body">
                        <div class="form-group">
                            <label class="form-label">الاسم الكامل</label>
                            <input type="text" class="form-input" value="${AppState.currentUser?.name || ''}" id="profile-name">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">رقم الهاتف</label>
                            <input type="tel" class="form-input" value="${AppState.currentUser?.phone || ''}" id="profile-phone">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">البريد الإلكتروني</label>
                            <input type="email" class="form-input" placeholder="example@email.com" id="profile-email">
                        </div>
                        
                        <button class="btn btn--primary btn--full" id="save-profile">
                            <i data-lucide="save"></i>
                            <span>حفظ التعديلات</span>
                        </button>
                    </div>
                </div>
                
                <div class="card" style="margin-top: var(--spacing-lg);">
                    <div class="card__body">
                        <div class="profile-stats">
                            <div class="profile-stat">
                                <div class="profile-stat__value">5</div>
                                <div class="profile-stat__label">عدد البلاغات</div>
                            </div>
                            <div class="profile-stat">
                                <div class="profile-stat__value">3</div>
                                <div class="profile-stat__label">تم حلها</div>
                            </div>
                            <div class="profile-stat">
                                <div class="profile-stat__value">60%</div>
                                <div class="profile-stat__label">نسبة القبول</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('save-profile')?.addEventListener('click', () => {
            const name = document.getElementById('profile-name').value;
            AppState.currentUser.name = name;
            updateUserInfo();
            UI.showToast('تم حفظ التعديلات بنجاح', 'success');
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function loadCreateReportPage() {
        appMain.innerHTML = `
            <div class="page-content animate-fade-in">
                <div class="page-header">
                    <h1 class="page-title">إبلاغ جديد</h1>
                </div>
                
                <form class="create-report-form" id="create-report-form">
                    <div class="card">
                        <div class="card__body">
                            <div class="form-group">
                                <label class="form-label">صورة المشكلة</label>
                                <div class="image-upload">
                                    <div class="image-upload__placeholder">
                                        <i data-lucide="camera"></i>
                                        <span>التقط صورة أو اختر من المعرض</span>
                                    </div>
                                    <input type="file" accept="image/*" class="image-upload__input" id="report-image">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">تصنيف البلاغ</label>
                                <select class="form-select" id="report-category" required>
                                    <option value="">اختر التصنيف</option>
                                    <option value="إنارة">إنارة</option>
                                    <option value="طرق">طرق</option>
                                    <option value="نظافة">نظافة</option>
                                    <option value="مرور">مرور</option>
                                    <option value="مياه">مياه</option>
                                    <option value="أرصفة">أرصفة</option>
                                    <option value="إعلانات">إعلانات</option>
                                    <option value="حدائق">حدائق</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">العنوان</label>
                                <input type="text" class="form-input" placeholder="أدخل عنوان المشكلة" id="report-title" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">الموقع</label>
                                <div class="location-input">
                                    <i data-lucide="map-pin"></i>
                                    <input type="text" class="form-input" placeholder="حدد الموقع على الخريطة" id="report-location" readonly>
                                    <button type="button" class="btn btn--outline btn--sm" id="select-location">
                                        <i data-lucide="navigation"></i>
                                        <span>تحديد</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">الوصف</label>
                                <textarea class="form-textarea" placeholder="وصف تفصيلي للمشكلة" id="report-description" rows="4"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">الأولوية</label>
                                <select class="form-select" id="report-priority">
                                    <option value="low">منخفضة</option>
                                    <option value="medium" selected>متوسطة</option>
                                    <option value="high">عالية</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn--accent btn--lg btn--full" style="margin-top: var(--spacing-lg);">
                        <i data-lucide="send"></i>
                        <span>إرسال البلاغ</span>
                    </button>
                </form>
            </div>
        `;
        
        document.getElementById('select-location')?.addEventListener('click', () => {
            UI.showToast('سيتم فتح الخريطة لتحديد الموقع', 'info');
        });
        
        document.getElementById('create-report-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> جاري الإرسال...';
            submitBtn.disabled = true;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            UI.showToast('تم إرسال البلاغ بنجاح', 'success');
            loadPage('reports');
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // ============================================
    // Helper Functions
    // ============================================
    function updateUserInfo() {
        const userName = document.querySelector('.side-menu__user-name');
        const userRole = document.querySelector('.side-menu__user-role');
        const userAvatar = document.querySelector('.side-menu__avatar span');
        
        if (userName) userName.textContent = AppState.currentUser?.name || 'مستخدم';
        if (userRole) userRole.textContent = AppState.currentRole === 'employee' ? 'موظف جهة' : 'مواطن';
        if (userAvatar) userAvatar.textContent = AppState.currentUser?.name?.charAt(0) || 'م';
    }
    
    async function loadRecentReports() {
        const container = document.getElementById('recent-reports') || document.getElementById('my-reports');
        if (!container) return;
        
        try {
            const reports = await API.getReports({ limit: 3 });
            container.innerHTML = reports.slice(0, 3).map(report => `
                <div class="report-card" onclick="showReportDetails('${report.id}')">
                    <img src="${report.image}" alt="${report.title}" class="report-card__image">
                    <div class="report-card__content">
                        <h4 class="report-card__title">${report.title}</h4>
                        <div class="report-card__meta">
                            <i data-lucide="tag" style="width: 14px; height: 14px;"></i>
                            <span>${report.category}</span>
                        </div>
                        <div class="report-card__footer">
                            <span class="pill pill--${report.status}">${UI.getStatusLabel(report.status)}</span>
                            <span class="text-muted" style="font-size: 12px;">${report.date}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            container.innerHTML = '<p class="text-muted">فشل تحميل البلاغات</p>';
        }
    }
    
    async function loadAllReports() {
        const container = document.getElementById('reports-list');
        if (!container) return;
        
        try {
            const reports = await API.getReports();
            container.innerHTML = reports.map(report => `
                <div class="report-card" onclick="showReportDetails('${report.id}')">
                    <img src="${report.image}" alt="${report.title}" class="report-card__image">
                    <div class="report-card__content">
                        <h4 class="report-card__title">${report.title}</h4>
                        <div class="report-card__meta">
                            <i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>
                            <span>${report.location}</span>
                        </div>
                        <div class="report-card__footer">
                            <span class="pill pill--${report.status}">${UI.getStatusLabel(report.status)}</span>
                            <span class="text-muted" style="font-size: 12px;">${report.date}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            container.innerHTML = '<p class="text-muted">فشل تحميل البلاغات</p>';
        }
    }
    
    async function loadNotifications() {
        const container = document.getElementById('notifications-list');
        if (!container) return;
        
        const notifications = [
            { id: 1, title: 'تم استلام بلاغك', message: 'بلاغ #R-2024-001 تم استلامه من قبل الجهة المختصة', time: 'منذ ساعة', read: false, type: 'info' },
            { id: 2, title: 'تحديث حالة البلاغ', message: 'بلاغ #R-2024-002 قيد المعالجة الآن', time: 'منذ 3 ساعات', read: false, type: 'warning' },
            { id: 3, title: 'تم حل المشكلة', message: 'بلاغ #R-2024-003 تم حله بنجاح', time: 'أمس', read: true, type: 'success' },
        ];
        
        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read ? 'notification-item--read' : ''}">
                <div class="notification-item__icon notification-item__icon--${notif.type}">
                    <i data-lucide="${notif.type === 'success' ? 'check-circle' : notif.type === 'warning' ? 'alert-circle' : 'info'}"></i>
                </div>
                <div class="notification-item__content">
                    <h4 class="notification-item__title">${notif.title}</h4>
                    <p class="notification-item__message">${notif.message}</p>
                    <span class="notification-item__time">${notif.time}</span>
                </div>
            </div>
        `).join('');
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    function showReportDetails(reportId) {
        // This will be implemented in ui.js
        console.log('Show report details:', reportId);
    }
    
    // ============================================
    // Logout
    // ============================================
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            appContainer.style.display = 'none';
            authScreens.style.display = 'block';
            showAuthScreen('login-screen');
            AppState.currentUser = null;
            UI.showToast('تم تسجيل الخروج بنجاح', 'success');
        }
    });
    
    // ============================================
    // Password Toggle
    // ============================================
    document.getElementById('toggle-password')?.addEventListener('click', function() {
        const passwordInput = document.getElementById('login-password');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.setAttribute('data-lucide', 'eye-off');
        } else {
            passwordInput.type = 'password';
            icon.setAttribute('data-lucide', 'eye');
        }
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
    
    // ============================================
    // Role Selector
    // ============================================
    document.querySelectorAll('.role-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.role-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input').checked = true;
        });
    });
    
    // ============================================
    // CSS for Additional Components
    // ============================================
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .page-content {
            padding: var(--spacing-lg);
            padding-bottom: calc(var(--spacing-lg) + var(--bottom-nav-height));
        }
        
        .page-header {
            margin-bottom: var(--spacing-xl);
        }
        
        .page-title {
            font-size: var(--font-size-2xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-gray-800);
            margin-bottom: var(--spacing-xs);
        }
        
        .page-subtitle {
            font-size: var(--font-size-sm);
            color: var(--color-gray-500);
        }
        
        .quick-action-card {
            margin-bottom: var(--spacing-xl);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--spacing-md);
            margin-top: var(--spacing-xl);
        }
        
        .stat-card {
            background-color: var(--color-white);
            padding: var(--spacing-lg);
            border-radius: var(--border-radius-lg);
            text-align: center;
            box-shadow: var(--shadow-sm);
        }
        
        .stat-card__icon {
            width: 40px;
            height: 40px;
            background-color: rgba(26, 188, 156, 0.1);
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--spacing-sm);
            color: var(--color-accent);
        }
        
        .stat-card__value {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-gray-800);
        }
        
        .stat-card__label {
            font-size: var(--font-size-xs);
            color: var(--color-gray-500);
        }
        
        .profile-header {
            text-align: center;
            padding: var(--spacing-xl);
            background-color: var(--color-white);
            border-radius: var(--border-radius-lg);
            margin-bottom: var(--spacing-lg);
            box-shadow: var(--shadow-sm);
        }
        
        .profile-avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            border-radius: var(--border-radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto var(--spacing-md);
            color: var(--color-white);
            font-size: var(--font-size-2xl);
            font-weight: var(--font-weight-bold);
        }
        
        .profile-name {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-gray-800);
            margin-bottom: var(--spacing-xs);
        }
        
        .profile-role {
            font-size: var(--font-size-sm);
            color: var(--color-gray-500);
        }
        
        .profile-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--spacing-md);
            text-align: center;
        }
        
        .profile-stat__value {
            font-size: var(--font-size-xl);
            font-weight: var(--font-weight-bold);
            color: var(--color-primary);
        }
        
        .profile-stat__label {
            font-size: var(--font-size-xs);
            color: var(--color-gray-500);
            margin-top: var(--spacing-xs);
        }
        
        .image-upload {
            position: relative;
            border: 2px dashed var(--color-gray-300);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-xl);
            text-align: center;
            cursor: pointer;
            transition: border-color var(--transition-fast);
        }
        
        .image-upload:hover {
            border-color: var(--color-accent);
        }
        
        .image-upload__placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-sm);
            color: var(--color-gray-500);
        }
        
        .image-upload__placeholder i {
            width: 40px;
            height: 40px;
            color: var(--color-gray-400);
        }
        
        .image-upload__input {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
        }
        
        .location-input {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }
        
        .location-input i {
            position: absolute;
            right: var(--spacing-md);
            color: var(--color-gray-400);
        }
        
        .location-input .form-input {
            padding-right: calc(var(--spacing-md) + 28px);
            flex: 1;
        }
        
        .map-container {
            background-color: var(--color-gray-200);
            border-radius: var(--border-radius-lg);
            height: 300px;
            margin-bottom: var(--spacing-lg);
            overflow: hidden;
        }
        
        .map-placeholder {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-sm);
            color: var(--color-gray-500);
        }
        
        .map-filters {
            display: flex;
            gap: var(--spacing-sm);
            flex-wrap: wrap;
        }
        
        .map-filters .btn {
            flex: 1;
            min-width: auto;
        }
        
        .notification-item {
            display: flex;
            gap: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: var(--color-white);
            border-radius: var(--border-radius-lg);
            margin-bottom: var(--spacing-sm);
            box-shadow: var(--shadow-sm);
            transition: background-color var(--transition-fast);
        }
        
        .notification-item--read {
            opacity: 0.7;
        }
        
        .notification-item__icon {
            width: 40px;
            height: 40px;
            border-radius: var(--border-radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .notification-item__icon--success {
            background-color: rgba(39, 174, 96, 0.1);
            color: var(--color-success);
        }
        
        .notification-item__icon--warning {
            background-color: rgba(243, 156, 18, 0.1);
            color: var(--color-warning);
        }
        
        .notification-item__icon--info {
            background-color: rgba(52, 152, 219, 0.1);
            color: var(--color-info);
        }
        
        .notification-item__content {
            flex: 1;
            min-width: 0;
        }
        
        .notification-item__title {
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-semibold);
            color: var(--color-gray-800);
            margin-bottom: var(--spacing-xs);
        }
        
        .notification-item__message {
            font-size: var(--font-size-sm);
            color: var(--color-gray-600);
            margin-bottom: var(--spacing-xs);
        }
        
        .notification-item__time {
            font-size: var(--font-size-xs);
            color: var(--color-gray-400);
        }
        
        .page-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 200px;
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .filters-bar {
            display: flex;
            gap: var(--spacing-md);
            margin-bottom: var(--spacing-lg);
        }
        
        .filters-bar .form-select {
            flex: 1;
        }
        
        .text-muted {
            color: var(--color-gray-500);
        }
    `;
    document.head.appendChild(additionalStyles);
});