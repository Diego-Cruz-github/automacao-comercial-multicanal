# 🧪 Guia de Testes - Workflows N8N

## 📋 Workflows Criados

✅ **main-conversation-complete.json** - Bot principal com integração completa  
✅ **template-advocacia.json** - Template especializado para escritórios jurídicos  
✅ **template-estetica.json** - Template para clínicas de estética  
✅ **test-simulator.json** - Simulador automatizado de testes  

## 🚀 Como Testar

### 1. Importar no N8N

```bash
# Acesse seu N8N
http://localhost:5678

# Vá em Workflows > Import from File
# Importe cada arquivo .json
```

### 2. Configurar Credenciais

**Google Sheets:**
- Criar conta de serviço Google
- Configurar em Settings > Credentials
- ID da planilha: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

**Telegram Bot:**
- Criar bot no @BotFather
- Configurar token nas credenciais

**Google Calendar:**
- Mesmo service account do Sheets
- Calendar ID: `primary`

### 3. Testar com Simulador

**Teste Advocacia:**
```bash
curl -X POST http://localhost:5678/webhook/test-simulator \
  -H "Content-Type: application/json" \
  -d '{
    "test_type": "advocacia",
    "scenario": "caso_urgente",
    "user_name": "João Silva",
    "chat_id": "123456789"
  }'
```

**Teste Estética:**
```bash
curl -X POST http://localhost:5678/webhook/test-simulator \
  -H "Content-Type: application/json" \
  -d '{
    "test_type": "estetica",
    "scenario": "nova_cliente",
    "user_name": "Maria Santos",
    "chat_id": "987654321"
  }'
```

### 4. Cenários de Teste Manual

#### Bot Principal (Cibersegurança)
1. `/start` → Escolher "Novo"
2. Testar "Emergência" → Deve transferir imediatamente
3. Testar "Consultoria" → Deve pedir formulário → Agendar
4. Verificar Google Sheets e Calendar

#### Template Advocacia
1. `/start` → "Novo caso"
2. Escolher área (ex: "Trabalhista")
3. Testar urgência "Imediato" → Transferência
4. Testar "Esta semana" → Formulário → Agendamento

#### Template Estética
1. `/start` → "Primeira vez"
2. Escolher procedimento (ex: "Botox")
3. Selecionar orçamento
4. Testar "Só informações" vs "Agendamento"

## 📊 Validações Automáticas

O **test-simulator.json** registra automaticamente:
- ✅ Status HTTP das requisições
- ✅ Timestamps de execução
- ✅ Dados dos cenários testados
- ✅ Logs no Google Sheets

## 🔍 Checklist de Validação

### Funcionalidades Básicas
- [ ] Webhook recebe mensagens
- [ ] Botões inline funcionam
- [ ] Fluxo de conversação segue lógica
- [ ] Mensagens são enviadas corretamente

### Integrações
- [ ] Google Sheets salva leads
- [ ] Google Calendar cria eventos
- [ ] Telegram responde adequadamente
- [ ] Transferências funcionam

### Filosofia "MENOS É MAIS"
- [ ] Máximo 3 opções por menu
- [ ] Mensagens concisas e diretas
- [ ] Qualificação rápida do lead
- [ ] CRM captura dados essenciais

### Templates Específicos
- [ ] **Advocacia**: Detecta urgência, classifica área jurídica
- [ ] **Estética**: Qualifica orçamento, agenda avaliação
- [ ] **Principal**: Identifica emergências, agenda consultorias

## 📈 Métricas de Sucesso

O sistema está configurado para medir:
- **Taxa de conversão**: Leads → Agendamentos
- **Tempo de resposta**: Bot → Humano
- **Qualidade do lead**: Dados completos captados
- **ROI por canal**: Telegram, WhatsApp, etc.

## 🛠️ Resolução de Problemas

**Erro de Webhook:**
- Verificar se N8N está rodando
- Confirmar URLs dos webhooks
- Testar com ngrok se necessário

**Erro Google Sheets:**
- Verificar permissões da service account
- Confirmar ID da planilha
- Testar credenciais

**Bot não responde:**
- Verificar token do Telegram
- Confirmar webhook está ativo
- Testar bot manualmente no Telegram

---

## 🎯 Próximos Passos

1. **Teste manual** de todos os cenários
2. **Configurar monitoramento** com alertas
3. **Criar dashboard** de métricas
4. **Otimizar** com base nos resultados
5. **Escalar** para outros templates de negócio

---

*Todos os workflows seguem as diretrizes do `claude_code_instructions.md` e implementam a filosofia "MENOS É MAIS" para maximizar conversões.*