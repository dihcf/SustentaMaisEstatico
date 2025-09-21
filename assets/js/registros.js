  // Elementos do DOM
        const filterTabs = document.querySelectorAll('.filter-tab');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const searchInput = document.querySelector('.search-input');
        const galleryGrid = document.getElementById('galleryGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const modal = document.getElementById('galleryModal');
        const modalClose = document.getElementById('modalClose');

        // Estado da aplicação
        let currentFilter = 'all';
        let currentSearch = '';
        let visibleItems = 9;

        // Filtros
        function filterItems() {
            const items = Array.from(galleryItems);
            let filteredItems = items;

            // Filtro por categoria
            if (currentFilter !== 'all') {
                filteredItems = filteredItems.filter(item => {
                    return item.dataset.category === currentFilter;
                });
            }

            // Filtro por busca
            if (currentSearch) {
                filteredItems = filteredItems.filter(item => {
                    const title = item.querySelector('.item-title').textContent.toLowerCase();
                    const description = item.querySelector('.item-description').textContent.toLowerCase();
                    const category = item.querySelector('.item-category').textContent.toLowerCase();
                    
                    return title.includes(currentSearch) || 
                           description.includes(currentSearch) || 
                           category.includes(currentSearch);
                });
            }

            // Mostrar/ocultar itens
            items.forEach((item, index) => {
                if (filteredItems.includes(item) && index < visibleItems) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Mostrar/ocultar botão "Carregar Mais"
            if (filteredItems.length <= visibleItems) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }

            // Mostrar estado vazio se necessário
            showEmptyState(filteredItems.length === 0);
        }

        // Estado vazio
        function showEmptyState(show) {
            const existingEmptyState = document.querySelector('.empty-state');
            
            if (show && !existingEmptyState) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <div class="empty-icon">🔍</div>
                    <h3 class="empty-title">Nenhum resultado encontrado</h3>
                    <p class="empty-description">Tente ajustar os filtros ou termos de busca</p>
                `;
                galleryGrid.appendChild(emptyState);
            } else if (!show && existingEmptyState) {
                existingEmptyState.remove();
            }
        }

        // Event Listeners para filtros
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Atualizar tabs ativas
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Atualizar filtro atual
                currentFilter = tab.dataset.filter;
                visibleItems = 9; // Reset para mostrar primeiros itens
                
                filterItems();
            });
        });

        // Event Listener para busca
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            visibleItems = 9; // Reset para mostrar primeiros itens
            filterItems();
        });

        // Event Listener para carregar mais
        loadMoreBtn.addEventListener('click', () => {
            visibleItems += 6;
            filterItems();
        });

        // Modal - Função para abrir modal com diferentes tipos de conteúdo
        function openModal(item) {
            const title = item.querySelector('.item-title').textContent;
            const description = item.querySelector('.item-description').textContent;
            const category = item.querySelector('.item-category').textContent;
            const date = item.querySelector('.item-date').textContent.trim();
            
            // Verificar tipo de conteúdo
            const slideContainer = item.querySelector('.slide-container');
            const singleImage = item.querySelector('.item-media img');
            const mediaPlaceholder = item.querySelector('.media-placeholder');
            const videoUrl = item.dataset.videoUrl;
            
            let modalMediaContent = '';
            
            if (slideContainer) {
                // SLIDES - Clonar container completo para o modal
                const clonedSlideContainer = slideContainer.cloneNode(true);
                modalMediaContent = clonedSlideContainer.outerHTML;
            } else if (videoUrl) {
                // VÍDEOS - Criar iframe para reprodução
                modalMediaContent = `
                    <iframe 
                        src="${videoUrl}" 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        style="border-radius: 12px;">
                    </iframe>
                `;
            } else if (singleImage) {
                // FOTOS ÚNICAS - Mostrar imagem em tamanho maior
                modalMediaContent = `<img src="${singleImage.src}" alt="${singleImage.alt}" onerror="this.src=''; this.style.display='none';">`;
            } else if (mediaPlaceholder) {
                // PLACEHOLDER - Para vídeos sem URL definida
                modalMediaContent = `
                    <div class="video-placeholder">
                        <div class="video-placeholder-icon">${mediaPlaceholder.textContent}</div>
                        <div class="video-placeholder-text">Vídeo será carregado em breve</div>
                    </div>
                `;
            }

            // Atualizar conteúdo do modal
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('modalMedia').innerHTML = modalMediaContent;
            document.getElementById('modalMeta').innerHTML = `
                <span>📅 ${date}</span>
                <span>📂 ${category}</span>
            `;

            // Mostrar modal
            modal.style.display = 'flex';
            
            // Inicializar funcionalidade específica para slides
            if (slideContainer) {
                initializeModalSlide();
            }
        }

        // Funcionalidade específica para slides no modal
        function initializeModalSlide() {
            const modalSlideContainer = modal.querySelector('.slide-container');
            if (!modalSlideContainer) return;
            
            const slides = modalSlideContainer.querySelectorAll('.slide');
            const prevBtn = modalSlideContainer.querySelector('.prev-btn');
            const nextBtn = modalSlideContainer.querySelector('.next-btn');
            const indicators = modalSlideContainer.querySelectorAll('.indicator');
            let currentSlide = 0;
            let modalAutoPlay;

            // Função para mostrar slide específico
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });
            }

            // Navegação para próximo slide
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }

            // Navegação para slide anterior
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            }

            // Iniciar auto-play no modal
            function startModalAutoPlay() {
                modalAutoPlay = setInterval(nextSlide, 3000); // 3 segundos
            }

            // Parar auto-play no modal
            function stopModalAutoPlay() {
                if (modalAutoPlay) {
                    clearInterval(modalAutoPlay);
                    modalAutoPlay = null;
                }
            }

            // Event listeners para botões de navegação
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    stopModalAutoPlay();
                    nextSlide();
                    startModalAutoPlay(); // Reiniciar auto-play após interação
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    stopModalAutoPlay();
                    prevSlide();
                    startModalAutoPlay(); // Reiniciar auto-play após interação
                });
            }

            // Event listeners para indicadores
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', (e) => {
                    e.stopPropagation();
                    stopModalAutoPlay();
                    currentSlide = index;
                    showSlide(currentSlide);
                    startModalAutoPlay(); // Reiniciar auto-play após interação
                });
            });

            // Navegação por teclado (setas)
            function handleKeyNavigation(e) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    stopModalAutoPlay();
                    nextSlide();
                    startModalAutoPlay();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    stopModalAutoPlay();
                    prevSlide();
                    startModalAutoPlay();
                }
            }

            // Pausar auto-play quando mouse estiver sobre o modal
            modalSlideContainer.addEventListener('mouseenter', stopModalAutoPlay);
            modalSlideContainer.addEventListener('mouseleave', startModalAutoPlay);

            // Adicionar listener de teclado quando modal estiver aberto
            document.addEventListener('keydown', handleKeyNavigation);

            // Iniciar auto-play
            startModalAutoPlay();

            // Remover listener e parar auto-play quando modal fechar
            const originalCloseModal = closeModal;
            closeModal = function() {
                document.removeEventListener('keydown', handleKeyNavigation);
                stopModalAutoPlay();
                originalCloseModal();
            };
        }

        function closeModal() {
            modal.style.display = 'none';
        }

        // Event Listeners para modal
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Verificar se o clique não foi em um botão de slide
                if (!e.target.closest('.slide-btn') && !e.target.closest('.indicator')) {
                    openModal(item);
                }
            });
        });

        modalClose.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });

        // Animação de números no hero
        function animateNumbers() {
            const numbers = document.querySelectorAll('.stat-number');
            numbers.forEach(number => {
                const target = parseInt(number.textContent.replace('+', ''));
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        number.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        number.textContent = Math.floor(current) + '+';
                    }
                }, 50);
            });
        }

        // Observador para animações
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        });

        // Funcionalidade dos slides
        function initializeSlides() {
            const slideItems = document.querySelectorAll('.slide-item');
            
            slideItems.forEach(item => {
                const slides = item.querySelectorAll('.slide');
                const prevBtn = item.querySelector('.prev-btn');
                const nextBtn = item.querySelector('.next-btn');
                const indicators = item.querySelectorAll('.indicator');
                let currentSlide = 0;
                let autoPlay;

                function showSlide(index) {
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === index);
                    });
                    indicators.forEach((indicator, i) => {
                        indicator.classList.toggle('active', i === index);
                    });
                }

                function nextSlide() {
                    currentSlide = (currentSlide + 1) % slides.length;
                    showSlide(currentSlide);
                }

                function prevSlide() {
                    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                    showSlide(currentSlide);
                }

                // Iniciar auto-play
                function startAutoPlay() {
                    autoPlay = setInterval(nextSlide, 4000); // 4 segundos nos cards
                }

                // Parar auto-play
                function stopAutoPlay() {
                    if (autoPlay) {
                        clearInterval(autoPlay);
                        autoPlay = null;
                    }
                }

                // Event listeners para botões
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    stopAutoPlay();
                    nextSlide();
                    startAutoPlay(); // Reiniciar após interação
                });

                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    stopAutoPlay();
                    prevSlide();
                    startAutoPlay(); // Reiniciar após interação
                });

                // Event listeners para indicadores
                indicators.forEach((indicator, index) => {
                    indicator.addEventListener('click', (e) => {
                        e.stopPropagation();
                        stopAutoPlay();
                        currentSlide = index;
                        showSlide(currentSlide);
                        startAutoPlay(); // Reiniciar após interação
                    });
                });

                // Pausar quando mouse estiver sobre o card
                item.addEventListener('mouseenter', stopAutoPlay);
                item.addEventListener('mouseleave', startAutoPlay);

                // Iniciar auto-play
                startAutoPlay();

                // Pausar quando item não estiver visível (otimização)
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            startAutoPlay();
                        } else {
                            stopAutoPlay();
                        }
                    });
                }, { threshold: 0.1 });

                observer.observe(item);
            });
        }

        // Inicialização
        document.addEventListener('DOMContentLoaded', function() {
            // Observar seção hero para animação
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                observer.observe(heroSection);
            }

            // Aplicar filtros iniciais
            filterItems();

            // Inicializar slides
            initializeSlides();

            // Smooth scroll para links âncora
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });