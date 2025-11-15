// CÓDIGO PARA js/auth-completo.js

// =================================================================
// FUNÇÕES AUXILIARES
// =================================================================

/**
 * Função auxiliar para exibir mensagens de erro ou sucesso dentro do modal
 * @param {string} modalId - O ID do modal ('login-modal1' ou 'register-form1')
 * @param {string} message - A mensagem a ser exibida
 * @param {string} type - 'success' ou 'error'
 */
function displayModalMessage(modalId, message, type) {
    // O ID do elemento de mensagem é o ID do modal + '-message'
    const messageElement = document.getElementById(`${modalId}-message`);
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `alert alert-${type}`;
    messageElement.style.display = 'block';

    // Esconde a mensagem após 5 segundos
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Validação de CPF (Simplificada)
function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;
    return true;
}

// Máscaras

// =================================================================
// FUNÇÕES DE PERFIL (NOVO)
// =================================================================

/**
 * Função para carregar os dados do usuário na página de perfil
 */
async function loadUserProfile(userId) {
    try {
        const response = await fetch(`/api/users/profile/${userId}`);
        const data = await response.json();

        if (data.success) {
            const user = data.data;
            document.getElementById('user-id').value = user.id;
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('cpf').value = user.cpf ? maskCPF(user.cpf) : '';
            document.getElementById('phone').value = user.phone ? maskPhone(user.phone) : '';
            document.getElementById('cep').value = user.cep || '';
            document.getElementById('street').value = user.street || '';
            document.getElementById('neighborhood').value = user.neighborhood || '';
            document.getElementById('city').value = user.city || '';
            document.getElementById('state').value = user.state || '';
        } else {
            alert('Erro ao carregar perfil: ' + data.error);
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro de conexão ao carregar perfil.');
    }
}

/**
 * Função para atualizar os dados do perfil
 */
async function handleProfileUpdate(event) {
    event.preventDefault();
    const form = event.target;
    const userId = document.getElementById('user-id').value;

    const userData = {
        name: form.name.value,
        phone: form.phone.value.replace(/[^\d]/g, ''),
        cep: form.cep.value.replace(/[^\d]/g, ''),
        street: form.street.value,
        neighborhood: form.neighborhood.value,
        city: form.city.value,
        state: form.state.value,
    };

    try {
        const response = await fetch(`/api/users/profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
            // Atualiza o localStorage e a navbar
            const user = JSON.parse(localStorage.getItem('user'));
            user.name = userData.name;
            localStorage.setItem('user', JSON.stringify(user));
            updateNavbar();
            
            displayProfileMessage('profile-message', 'Perfil atualizado com sucesso!', 'success');
        } else {
            displayProfileMessage('profile-message', data.error || 'Erro ao atualizar perfil.', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        displayProfileMessage('profile-message', 'Erro de conexão ao atualizar perfil.', 'error');
    }
}

/**
 * Função para alterar a senha
 */
async function handlePasswordUpdate(event) {
    event.preventDefault();
    const form = event.target;
    const userId = document.getElementById('user-id').value;
    const currentPassword = form['current-password'].value;
    const newPassword = form['new-password'].value;
    const confirmPassword = form['confirm-password'].value;

    if (newPassword !== confirmPassword) {
        displayProfileMessage('password-message', 'A nova senha e a confirmação não coincidem.', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/users/password/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const data = await response.json();

        if (data.success) {
            displayProfileMessage('password-message', 'Senha alterada com sucesso! Você será desconectado.', 'success');
            setTimeout(logout, 2000);
        } else {
            displayProfileMessage('password-message', data.error || 'Erro ao alterar senha. Verifique a senha atual.', 'error');
        }
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        displayProfileMessage('password-message', 'Erro de conexão ao alterar senha.', 'error');
    }
}

function displayProfileMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `alert alert-${type}`;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Máscaras
function maskCPF(value) {
    return value.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function maskPhone(value) {
    return value.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
}

// Busca de CEP
async function searchCEP(cep, inputIds) {
    const loader = document.getElementById('cep-loader');
    const streetInput = document.getElementById('register-street');
    const neighborhoodInput = document.getElementById('register-neighborhood');
    const cityInput = document.getElementById('register-city');
    const stateInput = document.getElementById('register-state');

    cep = cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    if (loader) loader.style.display = 'block';

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/` );
        const data = await response.json();

        if (!data.erro) {
            document.getElementById(inputIds?.street || 'register-street').value = data.logradouro;
            document.getElementById(inputIds?.neighborhood || 'register-neighborhood').value = data.bairro;
            document.getElementById(inputIds?.city || 'register-city').value = data.localidade;
            document.getElementById(inputIds?.state || 'register-state').value = data.uf;
        } else {
            displayModalMessage('register-form1', 'CEP não encontrado.', 'error');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        displayModalMessage('register-form1', 'Erro de conexão ao buscar CEP.', 'error');
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

// =================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// =================================================================

/**
 * Lida com o envio do formulário de Login
 */
async function login1() {
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            displayModalMessage('login-modal1', 'Login realizado com sucesso! Redirecionando...', 'success');
            // NOVO: Armazenar informações do usuário (id, nome, email)
            localStorage.setItem('user', JSON.stringify(data.data));
            
            // Fechar o modal e recarregar a página para atualizar o cabeçalho
            setTimeout(() => {
                window.location.reload(); 
            }, 1000);
        } else {
            displayModalMessage('login-modal1', data.error || 'Erro ao fazer login. Verifique suas credenciais.', 'error');
        }
    } catch (error) {
        console.error('Erro de rede/servidor:', error);
        displayModalMessage('login-modal1', 'Erro de conexão com o servidor. Tente novamente.', 'error');
    }
}

/**
 * Lida com o envio do formulário de Cadastro
 */
async function register1() {
    // Coleta de dados dos campos
    const name = document.getElementById('register-name')?.value || '';
    const email = document.getElementById('register-username')?.value || '';
    const password = document.getElementById('register-password')?.value || '';
    const cpf = document.getElementById('register-cpf')?.value || '';
    const phone = document.getElementById('register-phone')?.value || '';
    const cep = document.getElementById('register-cep')?.value || '';
    const street = document.getElementById('register-street')?.value || '';
    const neighborhood = document.getElementById('register-neighborhood')?.value || '';
    const city = document.getElementById('register-city')?.value || '';
    const state = document.getElementById('register-state')?.value || '';

    // Validação de CPF
    if (!isValidCPF(cpf)) {
        displayModalMessage('register-form1', 'CPF inválido. Verifique o formato.', 'error');
        return;
    }

    const userData = {
        name,
        email,
        password,
        cpf: cpf.replace(/[^\d]/g, ''),
        phone: phone.replace(/[^\d]/g, ''),
        cep: cep.replace(/[^\d]/g, ''),
        street,
        neighborhood,
        city,
        state,
    };

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (data.success) {
            displayModalMessage('register-form1', 'Cadastro realizado com sucesso! Faça login.', 'success');
            // Limpar o formulário
            // document.getElementById('register-form1').reset(); // Removido pois o reset não funciona bem com todos os campos
        } else {
            displayModalMessage('register-form1', data.error || 'Erro ao realizar cadastro. Tente outro email/CPF.', 'error');
        }
    } catch (error) {
        console.error('Erro de rede/servidor:', error);
        displayModalMessage('register-form1', 'Erro de conexão com o servidor. Tente novamente.', 'error');
    }
}

// =================================================================
// FUNÇÕES DE NAVBAR E PERFIL
// =================================================================

/**
 * Função para exibir o nome do usuário na navbar e configurar o link de perfil
 */
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginButton = document.getElementById('login-button'); // ID do botão de login (produtostela.html, produto.html)
    const loginButtonLink = document.getElementById('login-btn-link'); // ID do botão de login (carrinho.html)
    const userNameSpan = document.getElementById('user-name'); // Span para o nome do usuário
    const logoutButton = document.getElementById('logout-btn'); // Botão de logout

    if (user && user.name) {
        // Usuário logado
        if (loginButton) loginButton.style.display = 'none';
        if (loginButtonLink) loginButtonLink.style.display = 'none';
        
        userNameSpan.textContent = `Olá, ${user.name.split(' ')[0]}`;
        userNameSpan.style.display = 'inline';
        
        if (logoutButton) logoutButton.style.display = 'inline';
        
        // Adicionar link para a página de perfil
        userNameSpan.onclick = () => {
            window.location.href = `/perfil`; // Não precisa de ID, a página de perfil buscará do localStorage
        };

    } else {
        // Usuário deslogado
        if (loginButton) loginButton.style.display = 'inline';
        if (loginButtonLink) loginButtonLink.style.display = 'inline';
        userNameSpan.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

/**
 * Função de Logout
 */
async function logout() {
    try {
        // Chama o endpoint de logout do backend para destruir a sessão
        await fetch('/api/users/logout', {
            method: 'POST'
        });
    } catch (error) {
        console.error('Erro ao fazer logout no servidor:', error);
        // Continua o logout no frontend mesmo que o backend falhe
    }

    localStorage.removeItem('user');
    window.location.reload();
}

// =================================================================
// LISTENERS E INICIALIZAÇÃO
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Expor funções para a página de perfil
    window.loadUserProfile = loadUserProfile;
    window.handleProfileUpdate = handleProfileUpdate;
    window.handlePasswordUpdate = handlePasswordUpdate;
    window.searchCEP = searchCEP; // Re-expor a função de CEP para o perfil


    // Adiciona máscaras
    const cpfInput = document.getElementById('register-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = maskCPF(e.target.value);
        });
    }

    const phoneInput = document.getElementById('register-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }

    // Adiciona listener para busca de CEP
    const cepInput = document.getElementById('register-cep');
    if (cepInput) {
        cepInput.addEventListener('blur', (e) => {
            searchCEP(e.target.value);
        });
    }

    // Inicializa a navbar (Garante persistência de login em todas as páginas)
    updateNavbar();
});

// Expor funções globais para o HTML
window.login1 = login1;
window.register1 = register1;
window.logout = logout;
window.toggleForm1 = toggleForm1; // Adicionando a função de toggle para o modal

// Funções de controle do modal (toggleForm1, closeModal1, etc.)
function toggleForm1() {
    const loginForm = document.getElementById('login-form1');
    const registerForm = document.getElementById('register-form1');

    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }
}

function closeModal1() {
    document.getElementById('login-modal1').style.display = 'none';
}
