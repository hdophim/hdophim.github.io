        (function() {
            const API_BASE = 'https://phimapi.com';
            const IMG_DOMAIN = 'https://phimimg.com';
            const HISTORY_KEY = 'hdo_history_v1';

            // Phát hiện iOS để chặn autoplay
            const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

            let categoriesCache = [];
            let countriesCache = [];
            let homeSwiper = null;
            let cachedMovieData = null;

            function updatePageTitle(title) {
                document.title = title || 'HDOphim • Xem Phim HD Online';
            }

            function renderContent(html) {
                const container = document.getElementById('app-content');
                container.classList.add('opacity-0');
                container.innerHTML = html;
                void container.offsetHeight;
                container.classList.remove('opacity-0');
                setTimeout(() => lucide.createIcons(), 50);
            }

            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('./service-worker.js')
                        .then(reg => console.log('Service Worker đã sẵn sàng:', reg.scope))
                        .catch(err => console.error('Lỗi đăng ký Service Worker:', err));
                });
            }

            function getWatchHistory() {
                try {
                    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {};
                } catch (e) {
                    return {};
                }
            }

            function saveWatchProgress(movieInfo) {
                if (!movieInfo || !movieInfo.slug) return;
                const history = getWatchHistory();
                history[movieInfo.slug] = {
                    slug: movieInfo.slug,
                    name: movieInfo.name,
                    origin_name: movieInfo.origin_name || '',
                    poster_url: movieInfo.poster_url || '',
                    thumb_url: movieInfo.thumb_url || '',
                    ep_slug: movieInfo.ep_slug,
                    ep_name: movieInfo.ep_name,
                    server_idx: movieInfo.server_idx,
                    server_name: movieInfo.server_name,
                    currentTime: movieInfo.currentTime || 0,
                    duration: movieInfo.duration || 0,
                    updatedAt: Date.now()
                };
                try {
                    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
                } catch (e) { console.error('Lỗi lưu lịch sử:', e); }
            }

            function removeHistoryItem(slug) {
                const history = getWatchHistory();
                delete history[slug];
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            }

            function clearAllHistory() {
                localStorage.removeItem(HISTORY_KEY);
            }

            function formatTime(seconds) {
                if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
                const m = Math.floor(seconds / 60);
                const s = Math.floor(seconds % 60);
                return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
            }

            const getImageUrl = (path) => {
                if (!path) return 'https://via.placeholder.com/300x450?text=No+Cover';
                if (path.startsWith('http')) return path;
                return `${IMG_DOMAIN}/${path.replace(/^\//, '')}`;
            };

            const parseHash = () => {
                const hash = window.location.hash.slice(1) || '/';
                const [pathAndQuery, queryString] = hash.split('?');
                const parts = pathAndQuery.split('/').filter(Boolean);
                const params = new URLSearchParams(queryString || '');
                return {
                    route: parts[0] || 'home',
                    subRoute: parts[1] || '',
                    param: parts[2] || '',
                    queryParams: Object.fromEntries(params.entries())
                };
            };

            const extractArray = (res) => {
                if (!res) return [];
                if (Array.isArray(res)) return res;
                if (Array.isArray(res.data)) return res.data;
                if (Array.isArray(res.data?.items)) return res.data.items;
                if (Array.isArray(res.items)) return res.items;
                return [];
            };

            function closeMobileMenu() {
                const mobileMenu = document.getElementById('mobile-menu');
                const menuBtnIcon = document.getElementById('mobile-menu-btn')?.querySelector('i');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (menuBtnIcon) {
                        menuBtnIcon.setAttribute('data-lucide', 'menu');
                        lucide.createIcons();
                    }
                }
            }

            function skeletonPosterGrid(count) {
                return `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                            ${Array(count || 12).fill('<div class="aspect-[2/3] skeleton rounded-xl"></div>').join('')}
                        </div>`;
            }

            function showSkeleton(kind = 'home') {
                const grid = skeletonPosterGrid(12);
                const pagination = `
                        <div class="flex justify-center gap-2 mt-8 md:mt-10 animate-pulse">
                            ${'<div class="skeleton w-20 h-9 rounded-lg"></div>'.repeat(4)}
                        </div>`;
                const breadcrumb = `
                        <div class="flex items-center gap-2 animate-pulse">
                            <div class="skeleton w-5 h-5 rounded-md"></div>
                            <div class="skeleton w-3 h-3 rounded-full"></div>
                            <div class="skeleton w-28 h-5 rounded-md"></div>
                        </div>`;

                let html;
                if (kind === 'home') {
                    html = `
                        <div class="space-y-8 animate-pulse">
                            <div class="skeleton h-56 md:h-80 lg:h-96 rounded-2xl"></div>
                            <div class="flex items-center justify-between animate-pulse">
                                <div class="skeleton h-6 md:h-7 w-48 rounded-lg"></div>
                                <div class="skeleton h-5 w-24 rounded-md"></div>
                            </div>
                            ${grid}
                        </div>`;
                } else if (kind === 'detail') {
                    html = `
                        <div class="space-y-4 md:space-y-8 animate-pulse">
                            ${breadcrumb}
                            <div class="skeleton aspect-video w-full rounded-xl md:rounded-2xl"></div>
                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                                <div class="lg:col-span-2 space-y-4 md:space-y-6">
                                    <div class="skeleton h-8 w-32 md:w-40 rounded-lg"></div>
                                    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2">
                                        ${Array(16).fill('<div class="skeleton h-9 rounded-lg" style="height:34px"></div>').join('')}
                                    </div>
                                    <div class="space-y-2">
                                        ${Array(4).fill('<div class="skeleton rounded-md"></div>').join('')}
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    ${Array(3).fill(`
                                        <div class="flex gap-3 animate-pulse">
                                            <div class="skeleton w-16 sm:w-20 aspect-[2/3] rounded-lg shrink-0"></div>
                                            <div class="flex-1 space-y-2 py-1">
                                                <div class="skeleton h-4 w-3/4 rounded-md"></div>
                                                <div class="skeleton h-3 w-1/2 rounded-md"></div>
                                            </div>
                                        </div>`).join('')}
                                </div>
                            </div>
                        </div>`;
                } else {
                    const heading = kind === 'search'
                        ? `<div class="skeleton h-6 sm:h-7 w-52 md:w-64 rounded-lg"></div>`
                        : breadcrumb + `<div class="skeleton h-7 w-40 md:w-48 rounded-lg"></div>`;
                    html = `
                        <div class="space-y-4 md:space-y-6 animate-pulse">
                            ${heading}
                            ${grid}
                            ${pagination}
                        </div>`;
                }
                renderContent(html);
            }

            function renderPagination(pagination, hashPrefix) {
                if (!pagination || pagination.totalPages <= 1) return '';
                const current = pagination.currentPage;
                const total = pagination.totalPages;
                let html = '<div class="flex items-center justify-center gap-2 sm:gap-3 mt-8 md:mt-10 flex-wrap">';
                if (current > 1) {
                    html +=
                        `<a href="${hashPrefix}page=${current-1}" class="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-sm sm:text-base font-semibold rounded-lg border border-gray-300 dark:border-slate-700 transition flex items-center gap-1"><i data-lucide="chevron-left" class="w-4 h-4"></i> <span class="hidden sm:inline">Trước</span></a>`;
                }
                html +=
                    `<span class="px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-sm sm:text-base rounded-lg text-gray-500 dark:text-slate-400 pagination-text">Trang <strong class="text-gray-900 dark:text-white">${current}</strong> / ${total}</span>`;
                if (current < total) {
                    html +=
                        `<a href="${hashPrefix}page=${current+1}" class="px-3 py-1.5 sm:px-4 sm:py-2 bg-brand hover:bg-brand-dark text-sm sm:text-base font-semibold rounded-lg transition flex items-center gap-1"><span class="hidden sm:inline">Sau</span> <i data-lucide="chevron-right" class="w-4 h-4"></i></a>`;
                }
                html += '</div>';
                return html;
            }

            function renderMovieCard(movie) {
                const title = movie.name || '';
                const origin = movie.origin_name || '';
                const year = movie.year || '';
                const quality = movie.quality || movie.episode_current || 'HD';
                const poster = getImageUrl(movie.poster_url || movie.thumb_url);
                const slug = movie.slug;

                return `
                        <a href="#/phim/${slug}" class="movie-card group relative flex flex-col bg-white dark:bg-slate-900/80 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800/60 hover:border-brand/40 transition-all duration-300 hover:-translate-y-1.5 md:hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10">
                            <div class="aspect-[2/3] w-full overflow-hidden bg-gray-100 dark:bg-slate-800 relative">
                                <img src="${poster}" alt="${title}" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 dark:from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <span class="bg-brand/90 text-white text-sm font-bold px-2.5 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1"><i data-lucide="play" class="w-3 h-3 fill-white"></i> Xem ngay</span>
                                </div>
                                <span class="absolute top-2 left-2 px-2 py-0.5 bg-brand text-xs font-bold text-white rounded-md shadow-md z-10">${quality}</span>
                            </div>
                            <div class="p-2.5 md:p-3 flex flex-col flex-1">
                                <h3 class="font-bold movie-card-title text-gray-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand transition-colors">${title}</h3>
                                <p class="movie-card-origin text-gray-500 dark:text-slate-400 line-clamp-1 mt-0.5">${origin}</p>
                                ${year ? `<span class="movie-card-year text-gray-400 dark:text-slate-500 mt-auto pt-1.5 font-medium">📅 ${year}</span>` : ''}
                            </div>
                        </a>`;
            }

            async function loadHeaderMenus() {
                try {
                    const [catRes, counRes] = await Promise.all([
                        fetch(`${API_BASE}/the-loai`).then(r => r.json()).catch(() => []),
                        fetch(`${API_BASE}/quoc-gia`).then(r => r.json()).catch(() => [])
                    ]);

                    categoriesCache = extractArray(catRes);
                    countriesCache = extractArray(counRes);

                    const dropdownItemClass = "px-2 py-1.5 rounded-lg dropdown-item text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-brand transition-colors";

                    if (categoriesCache.length > 0) {
                        const html = categoriesCache.map(c => {
                            const name = typeof c === 'object' ? (c.name || c.title || '') : c;
                            const slug = typeof c === 'object' ? (c.slug || c.name || '') : c;
                            if (!name) return '';
                            return `<a href="#/the-loai/${slug}" class="${dropdownItemClass}">${name}</a>`;
                        }).filter(Boolean).join('');
                        document.getElementById('dropdown-theloai').innerHTML = html;
                        document.querySelector('.mobile-theloai-content').innerHTML = html;
                    }

                    if (countriesCache.length > 0) {
                        const html = countriesCache.map(c => {
                            const name = typeof c === 'object' ? (c.name || c.title || '') : c;
                            const slug = typeof c === 'object' ? (c.slug || c.name || '') : c;
                            if (!name) return '';
                            return `<a href="#/quoc-gia/${slug}" class="${dropdownItemClass}">${name}</a>`;
                        }).filter(Boolean).join('');
                        document.getElementById('dropdown-quocgia').innerHTML = html;
                        document.querySelector('.mobile-quocgia-content').innerHTML = html;
                    }

                    document.querySelectorAll('.accordion-toggle').forEach(btn => {
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const content = this.nextElementSibling;
                            content.classList.toggle('hidden');
                            this.classList.toggle('open');
                            lucide.createIcons();
                        });
                    });

                } catch (e) {
                    console.error('Lỗi nạp menu:', e);
                }
            }

            async function viewHome() {
                showSkeleton("home");
                updatePageTitle('Trang chủ - HDOphim');
                try {
                    const res = await fetch(`${API_BASE}/v1/api/home`).then(r => r.json());
                    const items = res?.data?.items || [];
                    if (!items.length) {
                        renderContent('<p class="text-center py-20 text-gray-500 dark:text-slate-400">Không có dữ liệu phim.</p>');
                        return;
                    }

                    const heroMovies = items.slice(0, 5);
                    const heroSlides = heroMovies.map((m) => `
                            <div class="swiper-slide relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] border border-gray-200 dark:border-slate-800 shadow-2xl">
                                <img src="${getImageUrl(m.thumb_url || m.poster_url)}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-slate-950 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-10">
                                    <span class="text-brand font-bold uppercase tracking-widest text-sm sm:text-base mb-1.5 drop-shadow">🔥 Nổi bật</span>
                                    <h1 class="hero-title font-extrabold text-white dark:text-white mb-1 line-clamp-1 drop-shadow-lg">${m.name}</h1>
                                    <p class="hero-desc text-gray-200 dark:text-slate-200 line-clamp-2 max-w-xl mb-3 drop-shadow">${m.origin_name || ''}</p>
                                    <a href="#/phim/${m.slug}" class="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition shadow-xl shadow-brand/20 w-fit">
                                        <i data-lucide="play" class="w-4 h-4 fill-white"></i> Xem ngay
                                    </a>
                                </div>
                            </div>
                        `).join('');

                    const html = `
                            <div class="space-y-6 md:space-y-10">
                                <div class="swiper hero-swiper rounded-2xl md:rounded-3xl overflow-hidden">
                                    <div class="swiper-wrapper">${heroSlides}</div>
                                    <div class="swiper-pagination !bottom-2 md:!bottom-4"></div>
                                </div>

                                <div>
                                    <div class="flex items-center justify-between mb-4 md:mb-6">
                                        <h2 class="section-title font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <i data-lucide="sparkles" class="w-5 h-5 md:w-6 md:h-6 text-brand"></i> Phim Mới Cập Nhật
                                        </h2>
                                        <a href="#/danh-sach/phim-le" class="text-sm sm:text-base text-brand hover:underline font-medium flex items-center gap-1">Xem tất cả <i data-lucide="arrow-right" class="w-3 h-3 sm:w-4 sm:h-4"></i></a>
                                    </div>
                                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                                        ${items.map(renderMovieCard).join('')}
                                    </div>
                                </div>
                            </div>`;

                    renderContent(html);
                    lucide.createIcons();

                    if (homeSwiper) homeSwiper.destroy();
                    homeSwiper = new Swiper('.hero-swiper', {
                        loop: true,
                        autoplay: { delay: 5000, disableOnInteraction: false },
                        pagination: { el: '.swiper-pagination', clickable: true },
                        effect: 'fade',
                        fadeEffect: { crossFade: true },
                        speed: 800
                    });

                } catch (err) {
                    renderContent('<p class="text-center py-20 text-red-400">⚠️ Lỗi tải trang chủ.</p>');
                }
            }

            async function viewCatalog(endpointUrl, fallbackTitle, hashPrefix) {
                showSkeleton("list");
                updatePageTitle(fallbackTitle + ' - HDOphim');
                try {
                    const res = await fetch(endpointUrl).then(r => r.json());
                    const data = res?.data || res;
                    const items = data.items || [];
                    const pagination = data.params?.pagination || data.pagination;
                    const title = data.titlePage || res?.titlePage || fallbackTitle;

                    const html = `
                            <div class="space-y-4 md:space-y-6 animate-fade-in">
                                <div class="flex items-center gap-2 text-sm sm:text-base text-gray-500 dark:text-slate-400">
                                    <a href="#/" class="hover:text-brand transition"><i data-lucide="home" class="w-4 h-4"></i></a>
                                    <i data-lucide="chevron-right" class="w-3 h-3 text-gray-400 dark:text-slate-600"></i>
                                    <h1 class="section-title font-bold text-gray-900 dark:text-white">${title}</h1>
                                </div>
                                ${items.length === 0 ? '<p class="text-gray-500 dark:text-slate-400 py-20 text-center">Không tìm thấy phim nào.</p>' : `
                                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                                        ${items.map(renderMovieCard).join('')}
                                    </div>
                                    ${renderPagination(pagination, hashPrefix)}
                                `}
                            </div>`;
                    renderContent(html);
                    lucide.createIcons();
                } catch (err) {
                    renderContent('<p class="text-center py-20 text-red-400">⚠️ Lỗi tải danh sách phim.</p>');
                }
            }

            async function viewSearch(keyword, page = 1) {
                showSkeleton("search");
                updatePageTitle('Tìm kiếm: ' + keyword + ' - HDOphim');
                try {
                    const res = await fetch(
                        `${API_BASE}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`).then(r => r.json());
                    const data = res?.data || {};
                    const items = data.items || [];
                    const pagination = data.params?.pagination;

                    const html = `
                            <div class="space-y-4 md:space-y-6 animate-fade-in">
                                <h1 class="text-lg sm:text-xl font-medium text-gray-700 dark:text-slate-300">
                                    🔍 Kết quả cho: <strong class="text-brand">"${keyword}"</strong>
                                </h1>
                                ${items.length === 0 ? '<p class="text-gray-500 dark:text-slate-400 py-20 text-center">Không tìm thấy phim phù hợp.</p>' : `
                                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                                        ${items.map(renderMovieCard).join('')}
                                    </div>
                                    ${renderPagination(pagination, `#/tim-kiem?keyword=${encodeURIComponent(keyword)}&`)}
                                `}
                            </div>`;
                    renderContent(html);
                    lucide.createIcons();
                } catch (err) {
                    renderContent('<p class="text-center py-20 text-red-400">⚠️ Lỗi tìm kiếm.</p>');
                }
            }

            async function viewHistory() {
                updatePageTitle('Lịch sử xem phim - HDOphim');
                const historyMap = getWatchHistory();
                const items = Object.values(historyMap).sort((a, b) => b.updatedAt - a.updatedAt);

                let html = `
                        <div class="space-y-4 md:space-y-6 animate-fade-in">
                            <div class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800 pb-3 md:pb-4">
                                <div>
                                    <h1 class="section-title font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <i data-lucide="history" class="w-6 h-6 md:w-7 md:h-7 text-amber-500 dark:text-amber-400"></i> Lịch Sử Xem Phim
                                    </h1>
                                    <p class="text-sm sm:text-base text-gray-500 dark:text-slate-400 mt-0.5">Đã lưu ${items.length} phim bạn đang xem dở</p>
                                </div>
                                ${items.length > 0 ? `
                                    <button id="btn-clear-all-history" class="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 dark:bg-red-600/20 hover:bg-red-200 dark:hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-white rounded-xl text-sm font-bold transition flex items-center gap-1.5 border border-red-200 dark:border-red-500/30">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> <span class="hidden sm:inline">Xóa tất cả</span>
                                    </button>
                                ` : ''}
                            </div>`;

                if (items.length === 0) {
                    html += `
                            <div class="text-center py-16 md:py-20 space-y-4">
                                <div class="inline-flex p-4 bg-gray-100 dark:bg-slate-900 text-gray-400 dark:text-slate-500 rounded-full">
                                    <i data-lucide="film" class="w-10 h-10 md:w-12 md:h-12"></i>
                                </div>
                                <p class="text-gray-500 dark:text-slate-400 text-base">Bạn chưa có lịch sử xem phim nào.</p>
                                <a href="#/" class="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition">
                                    <i data-lucide="sparkles" class="w-4 h-4"></i> Khám phá phim ngay
                                </a>
                            </div>`;
                } else {
                    html += `
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                ${items.map(item => {
                                    const percent = item.duration > 0 ? Math.min(100, Math.round((item.currentTime / item.duration) * 100)) : 0;
                                    const targetUrl = `#/phim/${item.slug}?ep=${item.ep_slug}&sv=${item.server_idx}&t=${Math.floor(item.currentTime)}`;
                                    
                                    return `
                                    <div class="flex gap-3 bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 p-2.5 md:p-3 rounded-xl md:rounded-2xl relative group hover:border-gray-300 dark:hover:border-slate-700 transition">
                                        <a href="${targetUrl}" class="shrink-0 w-20 sm:w-24 aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800 relative">
                                            <img src="${getImageUrl(item.poster_url || item.thumb_url)}" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <i data-lucide="play-circle" class="w-6 h-6 md:w-8 md:h-8 text-white fill-brand"></i>
                                            </div>
                                        </a>

                                        <div class="flex flex-col justify-between flex-1 min-w-0">
                                            <div>
                                                <h3 class="font-bold movie-card-title text-gray-900 dark:text-slate-100 line-clamp-1 group-hover:text-brand transition">${item.name}</h3>
                                                <p class="movie-card-origin text-gray-500 dark:text-slate-400 line-clamp-1 mt-0.5">${item.origin_name}</p>
                                                
                                                <div class="mt-1.5 md:mt-2 space-y-1">
                                                    <div class="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                                                        📺 ${item.ep_name || 'Tập phim'} (${item.server_name || 'Server'})
                                                    </div>
                                                    <div class="text-xs text-gray-500 dark:text-slate-400">
                                                        ⏱️ Vị trí: ${formatTime(item.currentTime)} / ${formatTime(item.duration)} (${percent}%)
                                                    </div>
                                                    
                                                    <div class="w-full h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                                                        <div class="h-full bg-brand rounded-full" style="width: ${percent}%"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-slate-800/60">
                                                <a href="${targetUrl}" class="px-2.5 py-1 sm:px-3 sm:py-1 bg-brand/10 dark:bg-brand/20 hover:bg-brand/20 dark:hover:bg-brand text-brand dark:text-brand hover:text-white dark:hover:text-white rounded-lg text-sm font-bold transition flex items-center gap-1">
                                                    <i data-lucide="play" class="w-3 h-3 fill-current"></i> Xem tiếp
                                                </a>
                                                <button data-remove-slug="${item.slug}" class="btn-remove-history p-1 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition" title="Xóa khỏi lịch sử">
                                                    <i data-lucide="trash" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>`;
                                }).join('')}
                            </div>`;
                }

                html += `</div>`;
                renderContent(html);
                lucide.createIcons();

                document.querySelectorAll('.btn-remove-history').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const slug = btn.getAttribute('data-remove-slug');
                        if (slug) {
                            removeHistoryItem(slug);
                            viewHistory();
                        }
                    });
                });

                const btnClearAll = document.getElementById('btn-clear-all-history');
                if (btnClearAll) {
                    btnClearAll.addEventListener('click', () => {
                        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem phim không?')) {
                            clearAllHistory();
                            viewHistory();
                        }
                    });
                }
            }

            async function viewMovieDetail(slug, queryParams) {
                if (!cachedMovieData || cachedMovieData.movie?.slug !== slug) {
                    showSkeleton("detail");
                    updatePageTitle('Đang tải phim... - HDOphim');
                    try {
                        const res = await fetch(`${API_BASE}/phim/${slug}`).then(r => r.json());
                        if (!res.status) {
                            renderContent('<p class="text-center py-20 text-red-400">Phim không tồn tại.</p>');
                            updatePageTitle('Phim không tồn tại - HDOphim');
                            return;
                        }
                        cachedMovieData = res;
                    } catch (err) {
                        renderContent('<p class="text-center py-20 text-red-400">⚠️ Lỗi tải chi tiết phim.</p>');
                        updatePageTitle('Lỗi - HDOphim');
                        return;
                    }
                }

                const movie = cachedMovieData.movie;
                const episodes = cachedMovieData.episodes || [];
                const activeEpSlug = queryParams.ep || '';
                const activeServerIdx = parseInt(queryParams.sv || '0', 10);
                const startTime = parseFloat(queryParams.t || '0');

                if (movie && movie.name) {
                    updatePageTitle(movie.name + ' - HDOphim');
                }

                const savedHistory = getWatchHistory()[slug];

                const serverData = episodes[activeServerIdx]?.server_data || [];
                const currentEpIndex = serverData.findIndex(ep => ep.slug === activeEpSlug);
                const currentPlayingEp = currentEpIndex >= 0 ? serverData[currentEpIndex] : null;
                const prevEp = currentEpIndex > 0 ? serverData[currentEpIndex - 1] : null;
                const nextEp = currentEpIndex < serverData.length - 1 ? serverData[currentEpIndex + 1] : null;
                const showPrevNext = serverData.length > 1 && currentEpIndex >= 0;

                let continueBanner = '';
                if (savedHistory && !currentPlayingEp) {
                    const targetUrl =
                        `#/phim/${movie.slug}?ep=${savedHistory.ep_slug}&sv=${savedHistory.server_idx}&t=${Math.floor(savedHistory.currentTime)}`;
                    continueBanner = `
                            <div class="mb-3 md:mb-4 p-3 md:p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl md:rounded-2xl flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                                <div class="flex items-center gap-2 md:gap-3">
                                    <div class="p-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg md:rounded-xl">
                                        <i data-lucide="history" class="w-4 h-4 md:w-5 md:h-5"></i>
                                    </div>
                                    <div>
                                        <p class="text-sm text-amber-800 dark:text-amber-300 font-bold">Lịch Sử Xem Phim</p>
                                        <p class="text-sm text-amber-700 dark:text-slate-300">
                                            Bạn đã xem đến <strong class="text-amber-900 dark:text-white">${savedHistory.ep_name}</strong> (${savedHistory.server_name}) lúc <strong class="text-amber-900 dark:text-white">${formatTime(savedHistory.currentTime)}</strong>
                                        </p>
                                    </div>
                                </div>
                                <a href="${targetUrl}" class="px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg md:rounded-xl text-sm transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                                    <i data-lucide="play" class="w-3.5 h-3.5 md:w-4 md:h-4 fill-current"></i> Tiếp tục xem
                                </a>
                            </div>`;
                }

                const mediaPlayerHtml = currentPlayingEp ? `
                            <div class="aspect-video w-full bg-black relative">
                                <div id="hdo-player" class="w-full h-full"></div>
                            </div>
                        ` : `
                            <div class="relative aspect-[16/9] md:aspect-[21/9] w-full">
                                <img src="${getImageUrl(movie.thumb_url || movie.poster_url)}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-slate-950 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-10">
                                    <h1 class="hero-title font-extrabold text-white mb-1 drop-shadow-lg">${movie.name}</h1>
                                    <p class="hero-desc text-gray-200 dark:text-slate-200 mb-3">${movie.origin_name} (${movie.year})</p>
                                    ${episodes.length > 0 && serverData.length > 0 ? `
                                        <a href="#/phim/${movie.slug}?ep=${serverData[0].slug}&sv=${activeServerIdx}" class="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition shadow-xl shadow-brand/20 w-fit">
                                            <i data-lucide="play" class="w-4 h-4 md:w-5 md:h-5 fill-white"></i> Xem phim
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        `;

                const html = `
                        <div class="space-y-4 md:space-y-8 animate-fade-in">
                            <div class="flex items-center gap-1.5 text-sm sm:text-base text-gray-500 dark:text-slate-400 flex-wrap">
                                <a href="#/" class="hover:text-brand transition">Trang chủ</a>
                                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                                <span class="text-gray-700 dark:text-slate-300 font-medium">${movie.name}</span>
                            </div>

                            ${continueBanner}

                            <div id="media-container" class="w-full rounded-xl md:rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-slate-800 shadow-2xl">
                                ${mediaPlayerHtml}
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                                <div class="lg:col-span-2 space-y-4 md:space-y-6">
                                    ${episodes.length > 0 ? `
                                        <div class="bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl p-3 md:p-5 space-y-3 md:space-y-4">
                                            <div class="flex items-center gap-1.5 border-b border-gray-200 dark:border-slate-800 pb-2.5 overflow-x-auto">
                                                <span class="text-sm font-bold uppercase text-gray-500 dark:text-slate-400 mr-1 shrink-0">📡 Server:</span>
                                                ${episodes.map((s, i) => {
                                                    const epParam = activeEpSlug ? `&ep=${activeEpSlug}` : '';
                                                    return `<a href="#/phim/${movie.slug}?sv=${i}${epParam}" class="server-btn px-2.5 py-1 font-semibold rounded-lg transition shrink-0 ${i===activeServerIdx?'bg-brand text-white':'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'}">${s.server_name}</a>`;
                                                }).join('')}
                                            </div>

                                            <div>
                                                <div class="flex items-center justify-between mb-2">
                                                    <h3 class="text-sm font-bold text-gray-700 dark:text-slate-300">📂 Danh sách tập</h3>
                                                    ${showPrevNext ? `
                                                    <div class="flex gap-2">
                                                        ${prevEp ? `<a href="#/phim/${movie.slug}?ep=${prevEp.slug}&sv=${activeServerIdx}" class="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center gap-1"><i data-lucide="chevron-left" class="w-3 h-3"></i> Tập trước</a>` : ''}
                                                        ${nextEp ? `<a href="#/phim/${movie.slug}?ep=${nextEp.slug}&sv=${activeServerIdx}" class="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center gap-1">Tập sau <i data-lucide="chevron-right" class="w-3 h-3"></i></a>` : ''}
                                                    </div>
                                                    ` : ''}
                                                </div>
                                                <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2 max-h-48 md:max-h-60 overflow-y-auto pr-1">
                                                    ${serverData.map(ep => {
                                                        const isActive = ep.slug === activeEpSlug;
                                                        return `<a href="#/phim/${movie.slug}?ep=${ep.slug}&sv=${activeServerIdx}" class="episode-btn px-1.5 py-1.5 sm:px-2 sm:py-2 text-center font-bold rounded-lg transition border ${isActive?'bg-brand text-white border-brand shadow-lg shadow-brand/20':'bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700/50 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'}">${ep.name}</a>`;
                                                    }).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    ` : '<p class="text-gray-500 dark:text-slate-400 italic text-sm">⏳ Chưa có tập phát sóng.</p>'}

                                    <div class="bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl p-3 md:p-5 space-y-2 md:space-y-3">
                                        <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><i data-lucide="file-text" class="w-4 h-4 md:w-5 md:h-5 text-brand"></i> 📖 Nội dung phim</h3>
                                        <div class="text-sm sm:text-base text-gray-700 dark:text-slate-300 leading-relaxed">${movie.content || 'Đang cập nhật...'}</div>
                                    </div>
                                </div>

                                <div class="space-y-4 md:space-y-6">
                                    <div class="bg-white dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-xl md:rounded-2xl p-3 md:p-5 space-y-3 md:space-y-4 sticky top-20">
                                        <div class="flex gap-3 md:gap-4">
                                            <img src="${getImageUrl(movie.poster_url)}" class="w-20 sm:w-24 h-28 sm:h-36 object-cover rounded-lg md:rounded-xl border border-gray-200 dark:border-slate-800 shadow-lg">
                                            <div>
                                                <h2 class="font-bold text-base sm:text-lg text-gray-900 dark:text-white">${movie.name}</h2>
                                                <p class="text-sm text-gray-500 dark:text-slate-400">${movie.origin_name}</p>
                                                <div class="flex flex-wrap gap-1 mt-1.5">
                                                    <span class="px-1.5 py-0.5 bg-brand/10 dark:bg-brand/20 text-brand font-bold text-xs rounded border border-brand/20 dark:border-brand/30">${movie.quality||'HD'}</span>
                                                    <span class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-bold text-xs rounded">${movie.lang||'Vietsub'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <hr class="border-gray-200 dark:border-slate-800">
                                        <ul class="space-y-1.5 text-sm text-gray-700 dark:text-slate-300">
                                            <li class="flex justify-between"><span class="text-gray-500 dark:text-slate-500">Trạng thái</span> <span class="font-medium text-brand">${movie.episode_current}</span></li>
                                            <li class="flex justify-between"><span class="text-gray-500 dark:text-slate-500">Thời lượng</span> <span>${movie.time||'N/A'}</span></li>
                                            <li class="flex justify-between"><span class="text-gray-500 dark:text-slate-500">Năm</span> <span>${movie.year}</span></li>
                                            <li class="flex justify-between"><span class="text-gray-500 dark:text-slate-500">Quốc gia</span> <span>${(movie.country||[]).map(c=>c.name).join(', ')}</span></li>
                                            <li><span class="text-gray-500 dark:text-slate-500 block mb-0.5">Thể loại</span><div class="flex flex-wrap gap-1">${(movie.category||[]).map(c=>`<span class="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded text-xs text-gray-700 dark:text-slate-300">${c.name}</span>`).join('')}</div></li>
                                            <li class="flex justify-between"><span class="text-gray-500 dark:text-slate-500">Đạo diễn</span> <span>${(movie.director||[]).join(', ')||'N/A'}</span></li>
                                            <li class="flex justify-between"><span class="text-gray-500 dark:text-slate-500">Diễn viên</span> <span class="text-right">${(movie.actor||[]).join(', ')||'N/A'}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                renderContent(html);
                lucide.createIcons();

                if (currentPlayingEp && currentPlayingEp.link_m3u8) {
                    const currentServerName = episodes[activeServerIdx]?.server_name || 'Server HD';
                    const currentEpName = currentPlayingEp.name || 'Tập phim';

                    initHdoPlayer(currentPlayingEp.link_m3u8, startTime, {
                        slug: movie.slug,
                        name: movie.name,
                        origin_name: movie.origin_name,
                        poster_url: movie.poster_url,
                        thumb_url: movie.thumb_url,
                        ep_slug: activeEpSlug,
                        ep_name: currentEpName,
                        server_idx: activeServerIdx,
                        server_name: currentServerName
                    });

                    setTimeout(() => {
                        document.getElementById('media-container')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }

            function initHdoPlayer(url, startTime = 0, movieMeta = null) {
                const container = document.getElementById('hdo-player');
                if (!container || !window.HdoPlayer) return;

                const poster = getImageUrl(movieMeta?.thumb_url || movieMeta?.poster_url || '');

                new window.HdoPlayer(container, {
                    autoplay: true,
                    poster,
                    proxyPrefix: './proxy-stream',
                    startTime,
                    history: movieMeta ? {
                        onProgress: (info) => saveWatchProgress({
                            ...movieMeta,
                            currentTime: info.currentTime,
                            duration: info.duration
                        })
                    } : null
                }).load(url, startTime, poster);
            }

            async function router() {
                closeMobileMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });

                const { route, subRoute, queryParams } = parseHash();
                const page = queryParams.page || 1;

                if (route !== 'phim') {
                    cachedMovieData = null;
                }

                if (route === 'home' || route === '') {
                    await viewHome();
                } else if (route === 'lich-su') {
                    await viewHistory();
                } else if (route === 'danh-sach') {
                    const titles = {
                        'phim-bo': 'Phim Bộ',
                        'phim-le': 'Phim Lẻ',
                        'phim-chieu-rap': 'Phim Chiếu Rạp',
                        'hoat-hinh': 'Hoạt Hình',
                        'tv-shows': 'TV Shows'
                    };
                    await viewCatalog(`${API_BASE}/v1/api/danh-sach/${subRoute}?page=${page}`, titles[subRoute] ||
                        'Danh Sách', `#/danh-sach/${subRoute}?`);

                } else if (route === 'the-loai') {
                    await viewCatalog(`${API_BASE}/v1/api/the-loai/${subRoute}?page=${page}`, `Thể loại: ${subRoute}`,
                        `#/the-loai/${subRoute}?`);

                } else if (route === 'quoc-gia') {
                    await viewCatalog(`${API_BASE}/v1/api/quoc-gia/${subRoute}?page=${page}`, `Quốc gia: ${subRoute}`,
                        `#/quoc-gia/${subRoute}?`);

                } else if (route === 'nam') {
                    await viewCatalog(`${API_BASE}/v1/api/nam/${subRoute}?page=${page}`, `Phim năm ${subRoute}`,
                        `#/nam/${subRoute}?`);

                } else if (route === 'tim-kiem') {
                    await viewSearch(queryParams.keyword || '', page);
                } else if (route === 'phim') {
                    await viewMovieDetail(subRoute, queryParams);
                } else {
                    await viewHome();
                }
            }

            window.addEventListener('hashchange', router);
            window.addEventListener('DOMContentLoaded', () => {
                loadHeaderMenus();
                router();

                const searchForms = [
                    { formId: 'search-form-mobile-menu', inputId: 'search-input-mobile-menu' },
                    { formId: 'search-form-desktop', inputId: 'search-input-desktop' }
                ];
                searchForms.forEach(({ formId, inputId }) => {
                    const form = document.getElementById(formId);
                    if (!form) return;
                    const input = document.getElementById(inputId);
                    const chip = form.querySelector('.search-mode-chip');
                    const label = form.querySelector('.search-mode-label');
                    let mode = 'phim';
                    try {
                        mode = localStorage.getItem('hdo_search_mode') === 'nam' ? 'nam' : 'phim';
                    } catch (e) { }
                    const curYear = new Date().getFullYear();
                    const setMode = (m) => {
                        mode = m;
                        if (label) label.textContent = m === 'nam' ? 'Năm' : 'Phim';
                        input.placeholder = m === 'nam' ? 'Nhập năm (vd 2000)' : 'Tìm phim...';
                        try { localStorage.setItem('hdo_search_mode', m); } catch (e) { }
                    };
                    setMode(mode);
                    if (chip) chip.addEventListener('click', () => setMode(mode === 'phim' ? 'nam' : 'phim'));
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const kw = input.value.trim();
                        if (!kw) return;
                        const isYear = /^\d{4}$/.test(kw) && parseInt(kw, 10) >= 1900 && parseInt(kw, 10) <= curYear;
                        if (mode === 'nam' && isYear) {
                            window.location.hash = `#/nam/${kw}`;
                        } else {
                            window.location.hash = `#/tim-kiem?keyword=${encodeURIComponent(kw)}`;
                        }
                        closeMobileMenu();
                    });
                });

                const menuBtn = document.getElementById('mobile-menu-btn');
                const mobileMenu = document.getElementById('mobile-menu');
                menuBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('hidden');
                    const icon = menuBtn.querySelector('i');
                    if (mobileMenu.classList.contains('hidden')) {
                        icon.setAttribute('data-lucide', 'menu');
                    } else {
                        icon.setAttribute('data-lucide', 'x');
                    }
                    lucide.createIcons();
                });

                mobileMenu.addEventListener('click', (e) => {
                    if (e.target.closest('a')) {
                        closeMobileMenu();
                    }
                });

                const backBtn = document.getElementById('back-to-top');
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 400) {
                        backBtn.classList.remove('opacity-0', 'invisible', 'translate-y-2');
                    } else {
                        backBtn.classList.add('opacity-0', 'invisible', 'translate-y-2');
                    }
                });
                backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            });
        })();
