// Global Variables
let selectedTemplate = 'advocacia';
let isJsonVisible = false;

// DOM Elements
const templateBtns = document.querySelectorAll('.template-btn');
const templateContents = document.querySelectorAll('.template-content');
const demoForm = document.getElementById('demoForm');
const responseArea = document.getElementById('responseArea');
const jsonViewer = document.getElementById('jsonViewer');
const jsonContent = document.getElementById('jsonContent');
const toggleJsonBtn = document.getElementById('toggleJson');
const quickBtns = document.querySelectorAll('.quick-btn');
const empresaGroup = document.getElementById('empresaGroup');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTemplateSelector();
    initializeForm();
    initializeQuickTests();
    initializeJsonToggle();
    initializeSectorButtons();
    addScrollEffects();
});

// Template Selector Functionality
function initializeTemplateSelector() {
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            selectTemplate(template);
        });
    });
}

function selectTemplate(template) {
    selectedTemplate = template;
    
    // Update active button
    templateBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.template === template) {
            btn.classList.add('active');
        }
    });
    
    // Update active content
    templateContents.forEach(content => {
        content.classList.remove('active');
        if (content.dataset.template === template) {
            content.classList.add('active');
        }
    });
    
    // Show/hide empresa field based on template
    if (template === 'consultoria') {
        empresaGroup.style.display = 'block';
    } else {
        empresaGroup.style.display = 'none';
    }
    
    // Update quick test scenarios based on template
    updateQuickTestScenarios(template);
}

function updateQuickTestScenarios(template) {
    const scenarios = {
        advocacia: [
            { test: 'lgpd', icon: '🔒', text: 'LGPD/Compliance (aciona parceiro especialista)' },
            { test: 'urgencia', icon: '🚨', text: 'Processo Trabalhista Urgente' },
            { test: 'divorcio', icon: '👥', text: 'Divórcio Consensual' },
            { test: 'contrato', icon: '📄', text: 'Revisão de Contrato Empresarial' }
        ],
        consultoria: [
            { test: 'lgpd', icon: '🔒', text: 'LGPD/Compliance (aciona parceiro especialista)' },
            { test: 'transformacao', icon: '🚀', text: 'Transformação Digital Urgente' },
            { test: 'diagnostico', icon: '📊', text: 'Diagnóstico Empresarial Gratuito' },
            { test: 'orcamento', icon: '💰', text: 'Consultoria Financeira/Orçamento' }
        ],
        clinicas: [
            { test: 'lgpd', icon: '🔒', text: 'LGPD Médica (adequação de dados)' },
            { test: 'emergencia', icon: '🚨', text: 'Consulta de Emergência' },
            { test: 'checkup', icon: '🩺', text: 'Check-up Completo' },
            { test: 'retorno', icon: '📋', text: 'Retorno/Acompanhamento' }
        ]
    };
    
    const quickButtons = document.querySelector('.quick-buttons');
    const currentScenarios = scenarios[template];
    
    quickButtons.innerHTML = currentScenarios.map(scenario => `
        <button class="quick-btn" data-test="${scenario.test}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${getIconSVG(scenario.test)}
            </svg>
            ${scenario.icon} ${scenario.text}
        </button>
    `).join('');
    
    // Re-attach event listeners
    reinitializeQuickTests();
}

function reinitializeQuickTests() {
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.test;
            runQuickTest(testType);
        });
    });
}

function getIconSVG(testType) {
    const icons = {
        lgpd: '<rect x="3" y="11" width="18" height="10" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
        urgencia: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
        emergencia: '<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>',
        divorcio: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
        contrato: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/>',
        transformacao: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        diagnostico: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
        orcamento: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
        checkup: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
        retorno: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>'
    };
    
    return icons[testType] || icons.lgpd;
}

// Form Functionality
function initializeForm() {
    demoForm.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(demoForm);
    const data = Object.fromEntries(formData);
    
    // Add template to data
    data.template = selectedTemplate;
    
    // Show loading state
    showLoadingState();
    
    try {
        // Simulate API call (replace with actual webhook URL)
        const response = await simulateWebhookCall(data);
        displayResponse(response);
    } catch (error) {
        console.error('Erro:', error);
        displayError('Erro ao processar solicitação. Tente novamente.');
    } finally {
        hideLoadingState();
    }
}

function showLoadingState() {
    const submitBtn = document.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
}

function hideLoadingState() {
    const submitBtn = document.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
}

// Simulate Webhook Response (replace with actual API)
async function simulateWebhookCall(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate response based on template and message content
    return generateMockResponse(data);
}

function generateMockResponse(data) {
    const { nome, mensagem, template, empresa } = data;
    const isLGPD = mensagem.toLowerCase().includes('lgpd');
    const isUrgent = mensagem.toLowerCase().includes('urgente') || mensagem.toLowerCase().includes('urgência');
    
    let response = {
        status: 'success',
        template_detectado: template,
        nome_cliente: nome,
        mensagem_original: mensagem,
        categorias_detectadas: [],
        resposta_automatica: '',
        proximos_passos: [],
        integracoes_ativadas: []
    };
    
    // Add empresa if consultoria
    if (template === 'consultoria' && empresa) {
        response.empresa_cliente = empresa;
    }
    
    // Detect categories
    if (isLGPD) {
        response.categorias_detectadas.push('LGPD', 'Cibersegurança');
        response.integracoes_ativadas.push('ZowTi Cibersegurança');
    }
    
    if (isUrgent) {
        response.categorias_detectadas.push('Urgência');
    }
    
    // Generate template-specific response
    switch (template) {
        case 'advocacia':
            response.resposta_automatica = generateAdvocaciaResponse(nome, isLGPD, isUrgent);
            response.proximos_passos = [
                'Encaminhamento para advogado especializado',
                'Agendamento de consulta prioritária',
                isLGPD ? 'Conexão com ZowTi para auditoria de segurança' : 'Análise preliminar do caso'
            ];
            break;
            
        case 'consultoria':
            response.resposta_automatica = generateConsultoriaResponse(nome, empresa, isLGPD, isUrgent);
            response.proximos_passos = [
                'Qualificação da necessidade empresarial',
                'Proposta comercial personalizada',
                isLGPD ? 'Consultoria em LGPD + Cibersegurança ZowTi' : 'Análise diagnóstica gratuita'
            ];
            break;
            
        case 'clinicas':
            response.resposta_automatica = generateClinicaResponse(nome, isLGPD, isUrgent);
            response.proximos_passos = [
                'Triagem por especialidade',
                'Agendamento preferencial',
                isLGPD ? 'Consultoria em conformidade LGPD médica' : 'Pré-consulta digital'
            ];
            break;
    }
    
    return response;
}

function generateAdvocaciaResponse(nome, isLGPD, isUrgent) {
    let response = `Olá ${nome}! Recebemos sua solicitação no Escritório Silva & Associados.\n\n`;
    
    if (isLGPD) {
        response += `Detectamos que sua consulta envolve questões de compliance/LGPD. Nossa equipe especializada em proteção de dados já foi notificada.\n\n`;
        response += `IMPORTANTE: Para casos complexos de compliance, temos parcerias com especialistas em cibersegurança.\n\n`;
    }
    
    if (isUrgent) {
        response += `Sua solicitação foi marcada como URGENTE e será priorizada.\n\n`;
    }
    
    response += `Um advogado especializado entrará em contato em até 2 horas para agendarmos uma consulta.`;
    
    return response;
}

function generateConsultoriaResponse(nome, empresa, isLGPD, isUrgent) {
    let response = `Olá ${nome}${empresa ? ` da ${empresa}` : ''}! Obrigado por entrar em contato com a ABC Consultoria.\n\n`;
    
    if (isLGPD) {
        response += `Identificamos necessidade de adequação em compliance/LGPD. Nossa especialidade!\n\n`;
        response += `OPORTUNIDADE: Oferecemos consultoria completa em adequação de dados com parceiros especializados.\n\n`;
    }
    
    if (isUrgent) {
        response += `Situação urgente identificada. Priorizaremos seu atendimento.\n\n`;
    }
    
    response += `Nossa equipe comercial entrará em contato para agendar uma análise diagnóstica gratuita.`;
    
    return response;
}

function generateClinicaResponse(nome, isLGPD, isUrgent) {
    let response = `Olá ${nome}! Bem-vindo à Clínica Médica Saúde Total.\n\n`;
    
    if (isLGPD) {
        response += `Sua consulta envolve questões de privacidade de dados médicos (LGPD).\n\n`;
        response += `Oferecemos consultoria especializada em adequação LGPD para área médica.\n\n`;
    }
    
    if (isUrgent) {
        response += `Caso marcado como URGENTE - você será atendido prioritariamente.\n\n`;
    }
    
    response += `Nossa recepção entrará em contato para agendamento conforme sua especialidade necessária.`;
    
    return response;
}

// Display Response
function displayResponse(response) {
    const responseHTML = `
        <div class="response-content">
            <div class="response-status">✅ Processamento Concluído</div>
            
            <div class="response-field">
                <div class="response-label">Template Detectado</div>
                <div class="response-value">${response.template_detectado.toUpperCase()}</div>
            </div>
            
            <div class="response-field">
                <div class="response-label">Cliente</div>
                <div class="response-value">${response.nome_cliente}${response.empresa_cliente ? ` - ${response.empresa_cliente}` : ''}</div>
            </div>
            
            ${response.categorias_detectadas.length > 0 ? `
            <div class="response-field">
                <div class="response-label">Categorias Detectadas</div>
                <div class="response-value">${response.categorias_detectadas.join(', ')}</div>
            </div>
            ` : ''}
            
            <div class="response-field">
                <div class="response-label">Resposta Automática</div>
                <div class="response-value">${response.resposta_automatica}</div>
            </div>
            
            <div class="response-field">
                <div class="response-label">Próximos Passos</div>
                <div class="response-value">${response.proximos_passos.map(step => `• ${step}`).join('<br>')}</div>
            </div>
            
            ${response.integracoes_ativadas.length > 0 ? `
            <div class="response-field">
                <div class="cross-sales-highlight">
                    <div class="response-label">🚀 Integrações Ativadas</div>
                    <div class="response-value">${response.integracoes_ativadas.join(', ')}</div>
                    <small style="display: block; margin-top: 8px; opacity: 0.8;">
                        ✨ Conexão automática detectada - oportunidade identificada!
                    </small>
                </div>
            </div>
            ` : ''}
        </div>
    `;
    
    responseArea.innerHTML = responseHTML;
    
    // Update JSON viewer
    jsonContent.textContent = JSON.stringify(response, null, 2);
}

function displayError(message) {
    responseArea.innerHTML = `
        <div class="response-content">
            <div class="response-status" style="background: #dc3545;">❌ Erro</div>
            <div class="response-field">
                <div class="response-value">${message}</div>
            </div>
        </div>
    `;
}

// Quick Tests
function initializeQuickTests() {
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.test;
            runQuickTest(testType);
        });
    });
}

function runQuickTest(testType) {
    const nomeInput = document.getElementById('nome');
    const mensagemInput = document.getElementById('mensagem');
    const empresaInput = document.getElementById('empresa');
    const telefoneInput = document.getElementById('telefone');
    const emailInput = document.getElementById('email');
    
    // Visual feedback
    const clickedBtn = document.querySelector(`[data-test="${testType}"]`);
    clickedBtn.style.background = 'var(--primary-color)';
    clickedBtn.style.color = 'white';
    clickedBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        clickedBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Set default values
    nomeInput.value = 'João Silva';
    telefoneInput.value = '(11) 99999-9999';
    emailInput.value = 'joao@email.com';
    
    if (selectedTemplate === 'consultoria') {
        empresaInput.value = 'Tech Corp Ltda';
    }
    
    const messages = {
        // Advocacia
        lgpd: 'Preciso de ajuda com adequação LGPD da minha empresa. Temos problemas com proteção de dados e compliance.',
        urgencia: 'URGENTE: Fui demitido sem justa causa e preciso entrar com processo trabalhista imediatamente.',
        divorcio: 'Eu e minha esposa decidimos nos divorciar de forma amigável. Queremos fazer um divórcio consensual.',
        contrato: 'Recebi um contrato de prestação de serviços e preciso que um advogado revise antes de assinar.',
        
        // Consultoria
        transformacao: 'Nossa empresa precisa urgentemente de transformação digital. Estamos perdendo mercado para concorrentes.',
        diagnostico: 'Gostaria de fazer um diagnóstico empresarial completo para identificar oportunidades de melhoria.',
        
        // Clínicas
        emergencia: 'Estou com fortes dores no peito e falta de ar. Preciso de atendimento médico urgente!',
        checkup: 'Gostaria de agendar um check-up completo. Tenho 45 anos e nunca fiz exames preventivos.',
        retorno: 'Preciso marcar um retorno com o Dr. Silva para avaliar os resultados dos exames.'
    };
    
    mensagemInput.value = messages[testType] || messages.lgpd;
    
    // Set priority for urgent cases
    if (testType === 'urgencia' || testType === 'emergencia' || testType === 'transformacao') {
        document.getElementById('prioridade').value = 'urgente';
    } else {
        document.getElementById('prioridade').value = 'normal';
    }
    
    // Scroll suave para o formulário
    document.getElementById('demoForm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-submit após delay para usuário ver o preenchimento
    setTimeout(() => {
        demoForm.dispatchEvent(new Event('submit'));
    }, 800);
}

// Sector Buttons Functionality
function initializeSectorButtons() {
    const sectorBtns = document.querySelectorAll('.sector-btn');
    
    sectorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sector = btn.dataset.sector;
            selectTemplate(sector);
            
            // Update sector buttons
            sectorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// JSON Toggle
function initializeJsonToggle() {
    toggleJsonBtn.addEventListener('click', () => {
        isJsonVisible = !isJsonVisible;
        
        if (isJsonVisible) {
            jsonViewer.style.display = 'block';
            toggleJsonBtn.textContent = 'Ocultar JSON';
        } else {
            jsonViewer.style.display = 'none';
            toggleJsonBtn.textContent = 'Ver JSON';
        }
    });
}

// Scroll Effects
function addScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scroll to demo
    window.scrollToDemo = function() {
        document.getElementById('demo').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .template-preview, .demo-form-container, .response-container').forEach(el => {
        observer.observe(el);
    });
}

// Workflow Animation
function animateWorkflow() {
    const nodes = document.querySelectorAll('.workflow-node');
    const arrows = document.querySelectorAll('.workflow-arrow');
    
    nodes.forEach((node, index) => {
        setTimeout(() => {
            node.style.transform = 'scale(1.1)';
            node.style.borderColor = 'var(--primary-color)';
            
            setTimeout(() => {
                node.style.transform = 'scale(1)';
            }, 300);
        }, index * 500);
    });
    
    arrows.forEach((arrow, index) => {
        setTimeout(() => {
            arrow.style.color = 'var(--primary-color)';
            arrow.style.transform = 'scale(1.2)';
            
            setTimeout(() => {
                arrow.style.color = 'var(--gray-400)';
                arrow.style.transform = 'scale(1)';
            }, 300);
        }, (index + 1) * 500);
    });
}

// Start workflow animation on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateWorkflow, 1000);
    setInterval(animateWorkflow, 8000); // Repeat every 8 seconds
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Performance Monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        }, 0);
    });
}