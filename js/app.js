/**
 * Big Bang Theory V2 - SPA & Data Logic
 */

class TBBTApp {
    constructor() {
        this.apiBase = 'https://api.tvmaze.com/shows/66';
        this.episodes = [];
        this.cast = [];
        this.showData = null;
        
        this.init();
    }

    async init() {
        this.setupRouter();
        await this.fetchData();
        this.renderHome();
        this.setupEpisodeControls();
    }

    setupRouter() {
        const links = document.querySelectorAll('.nav-link, .brand');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.currentTarget.getAttribute('data-target');
                if(target) this.navigate(target);
            });
        });

        // Theme Toggle Setup
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';

            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const newTheme = isDark ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
            });
        }
    }

    navigate(viewId) {
        // Update Nav Active State
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-target="${viewId}"]`);
        if(activeLink) activeLink.classList.add('active');

        // Update Views
        document.querySelectorAll('.view-container').forEach(v => {
            v.classList.remove('active');
        });
        document.getElementById(`view-${viewId}`).classList.add('active');
        
        window.scrollTo(0, 0);

        // Render View specific data if needed
        if(viewId === 'episodes') this.renderEpisodes();
        if(viewId === 'cast') this.renderCast();
        if(viewId === 'moments') this.renderMoments();
        if(viewId === 'bts') this.renderBts();
    }

    async fetchData() {
        try {
            // Fetch Show Metadata (Images for backgrounds)
            const imagesRes = await fetch(`${this.apiBase}/images`);
            const imagesData = await imagesRes.json();
            
            // Find a background image (horizontal, cinematic)
            const bgImage = imagesData.find(img => img.type === 'background');
            if(bgImage && bgImage.resolutions.original) {
                const hero = document.getElementById('home-hero');
                hero.style.backgroundImage = `url('${bgImage.resolutions.original.url}')`;
                hero.style.backgroundPosition = 'center 15%';
            } else {
                // Fallback to show endpoint
                const showRes = await fetch(this.apiBase);
                const showData = await showRes.json();
                if(showData.image && showData.image.original) {
                    document.getElementById('home-hero').style.backgroundImage = `url('${showData.image.original}')`;
                }
            }

            // Fetch Episodes
            const epRes = await fetch(`${this.apiBase}/episodes`);
            const tvmazeEps = await epRes.json();
            
            // Merge TVMaze episodes with local data.js (from V1) for rich trivia and IMDb ratings
            this.episodes = tvmazeEps.map(apiEp => {
                let localEp = null;
                if(typeof EPISODES !== 'undefined' && EPISODES[apiEp.season]) {
                    localEp = EPISODES[apiEp.season].find(e => e.ep === apiEp.number);
                }
                return {
                    ...apiEp,
                    imdbRating: localEp ? parseFloat(localEp.rating) : (apiEp.rating ? apiEp.rating.average : 0),
                    trivia: localEp ? localEp.trivia : null,
                    customDesc: localEp ? localEp.desc : null
                };
            });

            // Populate Season Filter
            const seasons = [...new Set(this.episodes.map(e => e.season))];
            const filterSelect = document.getElementById('ep-season-filter');
            seasons.forEach(s => {
                filterSelect.insertAdjacentHTML('beforeend', `<option value="${s}">Season ${s}</option>`);
            });

            // Fetch Cast
            const castRes = await fetch(`${this.apiBase}/cast`);
            this.cast = await castRes.json();

        } catch(err) {
            console.error("Error fetching data:", err);
        }
    }

    renderHome() {
        const carousel = document.getElementById('home-cast-carousel');
        carousel.innerHTML = '';
        
        // Render top cast members in carousel
        const mainCast = this.cast.slice(0, 10);
        mainCast.forEach(c => {
            const imgUrl = c.person.image ? (c.person.image.original || c.person.image.medium) : '';
            const html = `
                <div class="media-card" style="flex: 0 0 250px;">
                    <div class="media-img-wrapper" style="aspect-ratio: 2/3;">
                        <img src="${imgUrl}" class="media-img" alt="${c.person.name}">
                    </div>
                    <div class="media-content">
                        <h3 class="media-title" style="color: var(--text-primary);">${c.character.name}</h3>
                        <p class="text-muted" style="font-size: 0.8rem;">${c.person.name}</p>
                    </div>
                </div>
            `;
            carousel.insertAdjacentHTML('beforeend', html);
        });
    }

    setupEpisodeControls() {
        const search = document.getElementById('ep-search');
        const filter = document.getElementById('ep-season-filter');
        const sort = document.getElementById('ep-sort');

        const updateFn = () => this.renderEpisodes();

        search.addEventListener('input', updateFn);
        filter.addEventListener('change', updateFn);
        sort.addEventListener('change', updateFn);
    }

    renderEpisodes() {
        const grid = document.getElementById('episodes-grid');
        const searchVal = document.getElementById('ep-search').value.toLowerCase();
        const seasonVal = document.getElementById('ep-season-filter').value;
        const sortVal = document.getElementById('ep-sort').value;

        // Filter
        let filtered = this.episodes.filter(ep => {
            const matchSearch = ep.name.toLowerCase().includes(searchVal) || 
                              (ep.summary && ep.summary.toLowerCase().includes(searchVal)) ||
                              (ep.trivia && ep.trivia.toLowerCase().includes(searchVal));
            const matchSeason = seasonVal === 'all' || ep.season.toString() === seasonVal;
            return matchSearch && matchSeason;
        });

        // Sort
        if (sortVal === 'imdb-desc') {
            filtered.sort((a, b) => b.imdbRating - a.imdbRating);
        } else if (sortVal === 'imdb-asc') {
            filtered.sort((a, b) => a.imdbRating - b.imdbRating);
        } else {
            // default num-asc
            filtered.sort((a, b) => {
                if(a.season !== b.season) return a.season - b.season;
                return a.number - b.number;
            });
        }

        // Render
        grid.innerHTML = '';
        if(filtered.length === 0) {
            grid.innerHTML = '<p class="text-muted">No episodes found matching your criteria.</p>';
            return;
        }

        filtered.forEach(ep => {
            const imgUrl = ep.image ? (ep.image.original || ep.image.medium) : '';
            const desc = ep.customDesc || (ep.summary ? ep.summary.replace(/<[^>]*>?/gm, '') : 'No description available.');
            
            const html = `
                <div class="media-card" style="display: flex; flex-direction: column;">
                    <div class="media-img-wrapper">
                        <img src="${imgUrl}" class="media-img" alt="${ep.name}" loading="lazy">
                        <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.8); color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">
                            S${ep.season} E${ep.number}
                        </div>
                    </div>
                    <div class="media-content" style="flex: 1; display: flex; flex-direction: column;">
                        <h3 class="media-title" style="font-size: 1.1rem; white-space: normal;">${ep.name}</h3>
                        <div class="media-meta" style="margin-bottom: 10px;">
                            <span>${ep.airdate || ''}</span>
                            <span class="rating-badge">⭐ ${ep.imdbRating || 'N/A'}</span>
                        </div>
                        <p class="text-secondary" style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 10px; flex: 1;">${desc.substring(0, 150)}...</p>
                        ${ep.trivia ? `<div style="font-size: 0.8rem; color: var(--accent-blue); padding-top: 10px; border-top: 1px solid var(--border-subtle);"><i>Trivia: ${ep.trivia}</i></div>` : ''}
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', html);
        });
    }

    renderCast() {
        const grid = document.getElementById('cast-grid');
        if(grid.innerHTML !== '') return; // Already rendered

        // Create a map from TVMaze cast data
        const tvmazeImages = {};
        this.cast.forEach(c => {
            if(c.person.image) tvmazeImages[c.person.name] = c.person.image.original || c.person.image.medium;
        });

        if (typeof MAIN_CAST !== 'undefined') {
            MAIN_CAST.forEach(c => {
                const imgUrl = tvmazeImages[c.actor] || '';
                const html = `
                    <div class="media-card" style="background: transparent; cursor: pointer;" onclick="app.openModal('${c.id}')">
                        <div class="media-img-wrapper" style="aspect-ratio: 2/3; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1rem; border: 2px solid ${c.color || 'var(--glass-border)'}">
                            <img src="${imgUrl}" class="media-img" alt="${c.actor}">
                        </div>
                        <div style="text-align: center;">
                            <h3 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 0.2rem; color: ${c.color || 'var(--text-primary)'}">${c.character}</h3>
                            <p class="text-secondary">${c.actor}</p>
                        </div>
                    </div>
                `;
                grid.insertAdjacentHTML('beforeend', html);
            });
        }
    }

    openModal(charId) {
        if (typeof MAIN_CAST === 'undefined') return;
        const char = MAIN_CAST.find(c => c.id === charId);
        if (!char) return;

        // Find TVMaze image
        const tvmazeChar = this.cast.find(c => c.person.name === char.actor);
        const imgUrl = (tvmazeChar && tvmazeChar.person.image) ? (tvmazeChar.person.image.original || tvmazeChar.person.image.medium) : '';

        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <div style="display: flex; gap: 2rem; align-items: flex-start; flex-wrap: wrap;">
                <div style="flex: 0 0 200px; border-radius: var(--radius-lg); overflow: hidden; border: 3px solid ${char.color};">
                    <img src="${imgUrl}" style="width: 100%; height: auto; display: block;" alt="${char.character}">
                </div>
                <div style="flex: 1; min-width: 250px;">
                    <h2 style="font-family: var(--font-display); font-size: 2.5rem; color: ${char.color}; margin-bottom: 0.5rem;">${char.character}</h2>
                    <p style="font-size: 1.2rem; color: var(--text-secondary); margin-bottom: 1rem;">Played by ${char.actor}</p>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Role</div>
                            <div style="font-weight: bold;">${char.role}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted);">Seasons</div>
                            <div style="font-weight: bold;">${char.seasons}</div>
                        </div>
                    </div>
                    
                    <p style="line-height: 1.6; margin-bottom: 1.5rem; color: var(--text-secondary);">${char.bio}</p>
                    
                    <div style="background: rgba(255,215,0,0.1); border-left: 4px solid var(--accent-yellow); padding: 1rem; border-radius: 4px;">
                        <strong style="color: var(--accent-yellow);">Fun Fact:</strong> ${char.funFact}
                    </div>
                </div>
            </div>
        `;
        const modalOverlay = document.getElementById('character-modal');
        modalOverlay.style.display = 'flex';
    }

    closeModal() {
        document.getElementById('character-modal').style.display = 'none';
    }

    renderMoments() {
        const grid = document.getElementById('moments-grid');
        if(grid.innerHTML !== '' || typeof MOMENTS === 'undefined') return;

        MOMENTS.forEach(m => {
            const html = `
                <div class="media-card" style="padding: 0; background: var(--bg-elevated);">
                    <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
                        <iframe src="https://www.youtube.com/embed/${m.youtubeId}?modestbranding=1" 
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                                allowfullscreen></iframe>
                    </div>
                    <div class="media-content">
                        <span style="display: inline-block; padding: 2px 8px; background: rgba(225, 29, 72, 0.2); color: var(--accent-red); border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">
                            ${m.category}
                        </span>
                        <h3 class="media-title" style="white-space: normal; margin-bottom: 8px;">${m.title}</h3>
                        <p class="text-secondary" style="font-size: 0.9rem; line-height: 1.5; margin-bottom: 1rem;">${m.description}</p>
                        <p style="font-style: italic; font-size: 0.85rem; color: var(--text-muted); border-left: 2px solid var(--accent-yellow); padding-left: 10px;">
                            "${m.quote}"
                        </p>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', html);
        });
    }

    renderBts() {
        const crewGrid = document.getElementById('crew-grid');
        const triviaGrid = document.getElementById('trivia-grid');
        
        // Render Crew if not done
        if(crewGrid.innerHTML === '' && typeof CREW !== 'undefined') {
            CREW.forEach(c => {
                const html = `
                    <div style="display: flex; align-items: center; gap: 1rem; background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--accent-blue);">
                        <div>
                            <h3 style="font-size: 1.1rem; margin-bottom: 0.2rem;">${c.name}</h3>
                            <p style="color: var(--accent-blue); font-weight: bold; font-size: 0.9rem;">${c.role}</p>
                            ${c.note ? `<p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">${c.note}</p>` : ''}
                        </div>
                    </div>
                `;
                crewGrid.insertAdjacentHTML('beforeend', html);
            });
        }

        // Render Trivia if not done
        if(triviaGrid.innerHTML === '' && typeof FUN_FACTS !== 'undefined') {
            FUN_FACTS.forEach(cat => {
                cat.facts.forEach(f => {
                    const html = `
                        <div class="media-card" style="padding: 1.5rem; background: var(--bg-elevated); display: flex; flex-direction: column;">
                            <span style="display: inline-block; padding: 2px 8px; background: rgba(59, 130, 246, 0.2); color: var(--accent-blue); border-radius: 4px; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; margin-bottom: 1rem; align-self: flex-start;">
                                ${cat.icon} ${cat.category}
                            </span>
                            <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${f.title}</h3>
                            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${f.text}</p>
                        </div>
                    `;
                    triviaGrid.insertAdjacentHTML('beforeend', html);
                });
            });
        }
    }
}

// Initialize Application
window.app = new TBBTApp();
