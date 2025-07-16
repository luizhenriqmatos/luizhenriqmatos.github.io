// O evento DOMContentLoaded garante que todo o HTML foi carregado antes de o JavaScript ser executado.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO TEMA CLARO/ESCURO ---

    // Pega os elementos do DOM que vamos manipular para o tema.
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Função para verificar e aplicar o tema na carga inicial da página.
    const applyInitialTheme = () => {
        // Verifica 1: Se o usuário JÁ escolheu um tema e está salvo no localStorage.
        // Verifica 2: Se não há tema salvo, verifica a preferência do SISTEMA OPERACIONAL do usuário.
        if (localStorage.getItem('color-theme') === 'dark' || 
           (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            // Se uma das condições for verdadeira, aplica o tema escuro.
            document.documentElement.classList.add('dark');
            if (themeToggleLightIcon) themeToggleLightIcon.classList.remove('hidden'); // Mostra o ícone do sol
        } else {
            // Caso contrário, aplica o tema claro (ou mantém o padrão).
            document.documentElement.classList.remove('dark');
            if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove('hidden'); // Mostra o ícone da lua
        }
    };

    // Adiciona um "ouvinte" para o evento de clique no botão de tema.
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Alterna a visibilidade dos ícones de sol e lua.
            themeToggleDarkIcon.classList.toggle('hidden');
            themeToggleLightIcon.classList.toggle('hidden');

            // Verifica e troca o tema, salvando a preferência no localStorage.
            if (localStorage.getItem('color-theme')) {
                if (localStorage.getItem('color-theme') === 'light') {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                }
            } else {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('color-theme', 'light');
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('color-theme', 'dark');
                }
            }
        });
    }

    // --- LÓGICA ORIGINAL DO SITE ---

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling e active link para navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if (mobileMenu) mobileMenu.classList.add('hidden');
            
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Atualiza o link ativo durante o scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // LOGICA DO FORMULARIO DE CONTATO
      const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento da página

            const form = e.target;
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Feedback visual enquanto envia
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            formStatus.innerHTML = '<p class="text-gray-500">Aguarde um momento.</p>';

            const data = new FormData(form);

            try {
                // A MÁGICA ACONTECE AQUI!
                const response = await fetch("https://formspree.io/f/xpwlzdzn", { // ⚠️ COLE SUA URL DO FORMSPREE AQUI
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Sucesso!
                    formStatus.innerHTML = '<p class="text-green-500 font-bold">Mensagem enviada com sucesso! Obrigado por entrar em contato.</p>';
                    form.reset(); // Limpa o formulário
                } else {
                    // Erro na resposta do servidor
                    const responseData = await response.json();
                    if (responseData.errors) {
                        const errorMessages = responseData.errors.map(error => error.message).join(', ');
                        throw new Error(`Erro nos dados: ${errorMessages}`);
                    }
                    throw new Error('Ocorreu um erro no servidor.');
                }
            } catch (error) {
                // Erro de rede ou outro problema
                formStatus.innerHTML = `<p class="text-red-500 font-bold">Oops! Algo deu errado. Tente novamente mais tarde.</p><p class="text-red-400 text-sm">${error.message}</p>`;
            } finally {
                // Restaura o botão
                submitButton.disabled = false;
                submitButton.textContent = 'Enviar Mensagem';
            }
        });
    }

    // Chama a função para aplicar o tema assim que a página é carregada.
    applyInitialTheme();

});