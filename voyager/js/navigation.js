// Voyager Navigation & Routing

// Navigation items mapping
const navItems = {
  explore: { label: 'Explore', icon: 'explore', href: 'index.html' },
  trips: { label: 'My Trips', icon: 'map', href: 'trip-planner.html' },
  finance: { label: 'Finance', icon: 'payments', href: 'finance-planner.html' },
  profile: { label: 'Profile', icon: 'person', href: 'profile.html' }
};

// Theme Management
const ThemeManager = {
  LIGHT: 'light',
  DARK: 'dark',
  STORAGE_KEY: 'voyager_theme',

  /**
   * Initialize theme
   */
  init: function() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? this.DARK : this.LIGHT);
    this.setTheme(theme);
  },

  /**
   * Set the theme
   */
  setTheme: function(theme) {
    const html = document.documentElement;
    if (theme === this.DARK) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateToggleButtons();
  },

  /**
   * Toggle between light and dark
   */
  toggle: function() {
    const current = document.documentElement.classList.contains('dark') ? this.DARK : this.LIGHT;
    const newTheme = current === this.DARK ? this.LIGHT : this.DARK;
    this.setTheme(newTheme);
  },

  /**
   * Get current theme
   */
  getCurrent: function() {
    return document.documentElement.classList.contains('dark') ? this.DARK : this.LIGHT;
  },

  /**
   * Update toggle button icons/states
   */
  updateToggleButtons: function() {
    const isDark = this.getCurrent() === this.DARK;
    const buttons = document.querySelectorAll('[data-theme-toggle]');
    
    buttons.forEach(btn => {
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = isDark ? 'light_mode' : 'dark_mode';
      }
      btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  ThemeManager.init();
  updateActiveNav();
  setupNavigation();
});

// Update active navigation state
function updateActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Update bottom nav active state
  const navLinks = document.querySelectorAll('nav a, nav button[data-href]');
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || link.getAttribute('data-href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update header nav
  const headerLinks = document.querySelectorAll('header a');
  headerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(currentPage)) {
      link.classList.add('font-bold', 'text-primary');
    }
  });
}

// Setup navigation click handlers
function setupNavigation() {
  // Handle all navigation links
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('data-nav-link');
      if (href && !href.startsWith('#')) {
        window.location.href = href;
      }
    });
  });

  // Handle back buttons
  document.querySelectorAll('[data-back-btn]').forEach(btn => {
    btn.addEventListener('click', function() {
      window.history.back();
    });
  });
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Export for use in other scripts
window.VoyagerNav = {
  go: function(page) {
    window.location.href = page;
  },
  updateActive: updateActiveNav,
  navItems: navItems
};
