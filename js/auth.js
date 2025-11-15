/**
 * Função auxiliar para exibir mensagens de erro ou sucesso na tela
 * @param {string} message - A mensagem a ser exibida
 * @param {string} type - 'success' ou 'error'
 */
function displayMessage(message, type) {
    const messageElement = document.getElementById('auth-message');
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.className = `alert alert-${type}`;
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

/**
 * Lida com o envio do formulário de Login
 * @param {Event} event - O evento de envio do formulário
 */
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

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
            displayMessage('Login realizado com sucesso! Redirecionando...', 'success');
            // Armazenar informações do usuário (ex: em localStorage ou cookies)
            localStorage.setItem('user', JSON.stringify(data.data));
            // Redirecionar para a página inicial ou perfil
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            displayMessage(data.error || 'Erro ao fazer login. Verifique suas credenciais.', 'error');
        }
    } catch (error) {
        console.error('Erro de rede/servidor:', error);
        displayMessage('Erro de conexão com o servidor. Tente novamente.', 'error');
    }
}

/**
 * Lida com o envio do formulário de Cadastro
 * @param {Event} event - O evento de envio do formulário
 */
async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (data.success) {
            displayMessage('Cadastro realizado com sucesso! Você pode fazer login agora.', 'success');
            // Limpar o formulário
            form.reset();
            // Opcional: Redirecionar para a página de login
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            displayMessage(data.error || 'Erro ao realizar cadastro. Tente outro email.', 'error');
        }
    } catch (error) {
        console.error('Erro de rede/servidor:', error);
        displayMessage('Erro de conexão com o servidor. Tente novamente.', 'error');
    }
}

// Adicionar listeners aos formulários
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
