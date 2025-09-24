/**
 * 🧪 Script de Teste Automatizado - Workflows N8N
 * Execute: node test_automation.js
 */

const https = require('https');
const http = require('http');

// Configurações
const CONFIG = {
    n8n_base: 'http://localhost:5678',
    webhook_paths: {
        main: '/webhook/telegram-webhook',
        advocacia: '/webhook/advocacia-webhook', 
        estetica: '/webhook/estetica-webhook',
        test_simulator: '/webhook/test-simulator'
    },
    delay: 2000 // 2 segundos entre testes
};

// Cenários de teste
const TEST_SCENARIOS = [
    {
        name: "🤖 Bot Principal - Emergência",
        webhook: 'main',
        payload: {
            message: {
                text: "/start",
                chat: { id: 123456789 },
                from: { first_name: "João", username: "joao_teste" }
            }
        }
    },
    {
        name: "⚖️ Advocacia - Caso Urgente", 
        webhook: 'advocacia',
        payload: {
            message: {
                text: "/start",
                chat: { id: 987654321 },
                from: { first_name: "Maria", username: "maria_advogada" }
            }
        }
    },
    {
        name: "💄 Estética - Nova Cliente",
        webhook: 'estetica', 
        payload: {
            message: {
                text: "/start",
                chat: { id: 555666777 },
                from: { first_name: "Ana", username: "ana_estetica" }
            }
        }
    },
    {
        name: "🧪 Simulador - Teste Advocacia",
        webhook: 'test_simulator',
        payload: {
            test_type: "advocacia",
            scenario: "caso_urgente",
            user_name: "Teste Automatizado",
            chat_id: "auto_test_123"
        }
    },
    {
        name: "🧪 Simulador - Teste Estética", 
        webhook: 'test_simulator',
        payload: {
            test_type: "estetica",
            scenario: "nova_cliente", 
            user_name: "Teste Automatizado",
            chat_id: "auto_test_456"
        }
    }
];

// Função para fazer requisição HTTP
function makeRequest(url, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(url, options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Função para aguardar delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Executar todos os testes
async function runAllTests() {
    console.log('🚀 Iniciando testes automatizados dos workflows N8N\n');
    
    const results = [];
    
    for (let i = 0; i < TEST_SCENARIOS.length; i++) {
        const scenario = TEST_SCENARIOS[i];
        const url = CONFIG.n8n_base + CONFIG.webhook_paths[scenario.webhook];
        
        console.log(`📋 Executando: ${scenario.name}`);
        console.log(`🔗 URL: ${url}`);
        
        try {
            const startTime = Date.now();
            const response = await makeRequest(url, scenario.payload);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            const result = {
                test: scenario.name,
                url: url,
                status: response.statusCode,
                duration: `${duration}ms`,
                success: response.statusCode >= 200 && response.statusCode < 300,
                timestamp: new Date().toLocaleString('pt-BR')
            };
            
            results.push(result);
            
            if (result.success) {
                console.log(`✅ Sucesso (${response.statusCode}) - ${duration}ms`);
            } else {
                console.log(`❌ Falha (${response.statusCode}) - ${duration}ms`);
                console.log(`📄 Response: ${response.body.substring(0, 200)}...`);
            }
            
        } catch (error) {
            console.log(`❌ Erro: ${error.message}`);
            results.push({
                test: scenario.name,
                url: url,
                status: 'ERROR',
                duration: '0ms',
                success: false,
                error: error.message,
                timestamp: new Date().toLocaleString('pt-BR')
            });
        }
        
        console.log('---\n');
        
        // Aguardar antes do próximo teste
        if (i < TEST_SCENARIOS.length - 1) {
            await sleep(CONFIG.delay);
        }
    }
    
    // Relatório final
    console.log('📊 RELATÓRIO FINAL DE TESTES\n');
    console.log('===============================');
    
    let successCount = 0;
    let totalTests = results.length;
    
    results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${result.test}`);
        console.log(`   Status: ${result.status} | Tempo: ${result.duration}`);
        
        if (result.success) successCount++;
        if (result.error) console.log(`   Erro: ${result.error}`);
        console.log('');
    });
    
    const successRate = ((successCount / totalTests) * 100).toFixed(1);
    
    console.log('===============================');
    console.log(`📈 Taxa de Sucesso: ${successCount}/${totalTests} (${successRate}%)`);
    console.log(`⏱️  Tempo Total: ${results.reduce((sum, r) => sum + parseInt(r.duration), 0)}ms`);
    console.log(`📅 Executado em: ${new Date().toLocaleString('pt-BR')}`);
    
    if (successRate >= 80) {
        console.log('\n🎉 TESTES APROVADOS! Workflows funcionando corretamente.');
    } else {
        console.log('\n⚠️  ATENÇÃO: Alguns testes falharam. Verifique a configuração.');
    }
    
    // Salvar resultado em arquivo
    const reportData = {
        timestamp: new Date().toISOString(),
        total_tests: totalTests,
        success_count: successCount,
        success_rate: successRate,
        results: results
    };
    
    require('fs').writeFileSync(
        'test_report.json', 
        JSON.stringify(reportData, null, 2)
    );
    
    console.log('\n💾 Relatório salvo em: test_report.json');
}

// Executar se chamado diretamente
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { runAllTests, TEST_SCENARIOS, CONFIG };