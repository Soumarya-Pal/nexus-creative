// ============================================
// NEXUS CREATIVE - SEARCH FUNCTIONALITY
// ============================================

// Search data - all searchable content
const searchData = [
    // Pages
    { title: 'Home', description: 'Welcome to Nexus Creative - Digital Marketing Agency', url: 'index.html', type: 'page' },
    { title: 'About Us', description: 'Learn about our story, mission, and the team behind Nexus Creative', url: 'about.html', type: 'page' },
    { title: 'Our Services', description: 'Explore our comprehensive digital marketing and creative services', url: 'services.html', type: 'page' },
    { title: 'Our Work', description: 'View our portfolio of successful projects and case studies', url: 'work.html', type: 'page' },
    { title: 'Contact Us', description: 'Get in touch with us for your next project', url: 'contact.html', type: 'page' },

    // Services
    { title: 'Brand Strategy', description: 'Build a powerful brand identity that resonates with your audience and drives business growth', url: 'services.html#brand-strategy', type: 'service' },
    { title: 'Web Design & Development', description: 'Create stunning, responsive websites that convert visitors into customers', url: 'services.html#web-design', type: 'service' },
    { title: 'Digital Marketing', description: 'Comprehensive digital marketing strategies including PPC, email marketing, and analytics', url: 'services.html#digital-marketing', type: 'service' },
    { title: 'Content Creation', description: 'Engaging content that tells your story and connects with your audience', url: 'services.html#content-creation', type: 'service' },
    { title: 'Social Media Management', description: 'Build and grow your social media presence across all platforms', url: 'services.html#social-media', type: 'service' },
    { title: 'SEO Optimization', description: 'Improve your search rankings and drive organic traffic to your website', url: 'services.html#seo', type: 'service' },

    // Team
    { title: 'Alex Morgan', description: 'CEO & Founder - Leading strategic vision and company growth', url: 'about.html#team', type: 'team' },
    { title: 'Sarah Chen', description: 'Creative Director - Overseeing all creative output and design direction', url: 'about.html#team', type: 'team' },
    { title: 'James Wilson', description: 'Head of Development - Leading technical implementation and web solutions', url: 'about.html#team', type: 'team' },
    { title: 'Emily Rodriguez', description: 'Marketing Director - Driving digital marketing strategies and campaigns', url: 'about.html#team', type: 'team' },

    // Portfolio
    { title: 'TechStart Rebrand', description: 'Complete brand identity redesign for a growing tech startup', url: 'work.html#techstart', type: 'project', category: 'branding' },
    { title: 'GreenLife E-commerce', description: 'Full e-commerce website design and development for sustainable products', url: 'work.html#greenlife', type: 'project', category: 'web' },
    { title: 'FinanceHub Campaign', description: 'Integrated digital marketing campaign for financial services', url: 'work.html#financehub', type: 'project', category: 'marketing' },
    { title: 'Artisan Coffee Branding', description: 'Brand identity and packaging design for artisan coffee roaster', url: 'work.html#artisan', type: 'project', category: 'branding' },
    { title: 'FitLife App Launch', description: 'Social media campaign for fitness app launch', url: 'work.html#fitlife', type: 'project', category: 'social' },
    { title: 'LuxuryStay Website', description: 'Luxury hotel booking platform design and development', url: 'work.html#luxurystay', type: 'project', category: 'web' }
];

// Initialize search
document.addEventListener('DOMContentLoaded', initSearch);

function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchModal = document.querySelector('.search-modal');
    const searchInput = document.querySelector('.search-input');
    const searchClose = document.querySelector('.search-close');
    const searchResults = document.querySelector('.search-results');

    if (!searchToggle || !searchModal) return;

    // Open search modal
    searchToggle.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.focus();
    });

    // Close search modal
    function closeSearch() {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    searchClose.addEventListener('click', closeSearch);

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) closeSearch();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + K to open search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchModal.classList.add('active');
            searchInput.focus();
        }

        // Escape to close
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search input handler
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(e.target.value);
        }, 200);
    });

    // Keyboard navigation in results
    let selectedIndex = -1;
    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-result-item');

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            items[selectedIndex].click();
        }
    });

    function updateSelection(items) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }
}

function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    query = query.toLowerCase().trim();

    if (!query) {
        searchResults.innerHTML = '<p class="search-empty">Start typing to search...</p>';
        return;
    }

    const results = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        return titleMatch || descMatch;
    });

    if (results.length === 0) {
        searchResults.innerHTML = '<p class="search-empty">No results found for "' + escapeHtml(query) + '"</p>';
        return;
    }

    searchResults.innerHTML = results.map(item => `
    <a href="${item.url}" class="search-result-item">
      <div class="search-result-icon">
        ${getTypeIcon(item.type)}
      </div>
      <div class="search-result-info">
        <h4>${highlightMatch(item.title, query)}</h4>
        <p>${highlightMatch(item.description, query)}</p>
      </div>
    </a>
  `).join('');
}

function getTypeIcon(type) {
    const icons = {
        page: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
        service: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        team: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        project: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'
    };
    return icons[type] || icons.page;
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
