# All4QMS Docker Configuration

## 📁 Estrutura de Arquivos

```
src/main/docker/
├── app.yml                    # Arquivo principal do Docker Compose
├── env.example               # Exemplo de variáveis de ambiente
├── README.md                 # Este arquivo
└── services/                 # Serviços individuais
    ├── gateway.yml
    ├── rnc.yml
    ├── infodoc.yml
    ├── risco.yml
    ├── metaind.yml
    ├── auditplan.yml
    └── tunnel.yml
```

## 🔧 Configuração de Variáveis de Ambiente

### **1. Configuração Inicial**

Copie o arquivo de exemplo para criar seu arquivo de ambiente:

```bash
cp env.example .env
```

### **2. Personalização**

Edite o arquivo `.env` conforme necessário:

```bash
# Exemplo de personalização
QMS_REGISTRY_HOST=meu-registry.exemplo.com
GATEWAY_URL=https://meu-gateway.exemplo.com
IA_HOST=https://meu-ia.exemplo.com
```

### **3. Variáveis Disponíveis**

#### **Java Options**

- `_JAVA_OPTIONS`: Opções JVM (padrão: `-Xmx512m -Xms256m`)

#### **Spring Configuration**

- `SPRING_PROFILES_ACTIVE`: Perfis ativos (padrão: `prod,api-docs`)
- `MANAGEMENT_METRICS_EXPORT_PROMETHEUS_ENABLED`: Métricas Prometheus

#### **JHipster Registry**

- `jhipster.registry.password`: Senha do registry
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: URL do Eureka
- `SPRING_CLOUD_CONFIG_URI`: URL do Config Server

#### **Database**

- `SPRING_R2DBC_URL`: URL R2DBC do Gateway
- `SPRING_LIQUIBASE_URL`: URL Liquibase do Gateway
- `DB_*`: Nomes dos bancos de dados por serviço

#### **QMS Registry**

- `QMS_REGISTRY_HOST`: Host do registry (padrão: `all4qms-registry.vdeveloper.com.br`)
- `QMS_REGISTRY_PROTOCOLO`: Protocolo (padrão: `https`)

#### **Gateway Configuration**

- `GATEWAY_URL`: URL do gateway (padrão: `https://all4qms-gateway.vdeveloper.com.br`)
- `GATEWAY_HOST`: Host do gateway
- `PROXY_PORT`: Porta do proxy (padrão: `3000`)

#### **IA Service**

- `IA_HOST`: URL do serviço de IA (padrão: `https://all4qms-ia.vdeveloper.com.br`)

#### **Server Communication**

- `SERVER_GATEWAY`: URL interna do gateway
- `SERVER_RNC`: URL interna do RNC

#### **Sleep Times**

- `JHIPSTER_SLEEP`: Tempo de espera do Gateway (30s)
- `RNC_SLEEP`: Tempo de espera do RNC (40s)
- `INFODOC_SLEEP`: Tempo de espera do Infodoc (50s)
- `RISCO_SLEEP`: Tempo de espera do Risco (40s)
- `METAIND_SLEEP`: Tempo de espera do Metaind (50s)
- `AUDITPLAN_SLEEP`: Tempo de espera do Auditplan (60s)

## 🚀 Execução

### **Execução Completa**

```bash
docker-compose -f src/main/docker/app.yml up -d
```

### **Execução de Serviços Específicos**

```bash
# Apenas o gateway
docker-compose -f src/main/docker/app.yml up gateway

# Gateway e RNC
docker-compose -f src/main/docker/app.yml up gateway rnc

# Todos exceto tunnel
docker-compose -f src/main/docker/app.yml up gateway rnc infodoc risco metaind auditplan
```

### **Execução com Variáveis Personalizadas**

```bash
# Usando arquivo .env personalizado
docker-compose -f src/main/docker/app.yml --env-file ./meu-ambiente.env up -d

# Usando variáveis de ambiente do sistema
export QMS_REGISTRY_HOST=meu-registry.com
docker-compose -f src/main/docker/app.yml up -d
```

## 📋 Benefícios

1. **✅ Centralização**: Todas as variáveis em um local
2. **✅ Flexibilidade**: Fácil mudança entre ambientes
3. **✅ Manutenibilidade**: Configuração centralizada
4. **✅ Reutilização**: Mesmas variáveis para todos os serviços
5. **✅ Versionamento**: Controle de versão das configurações
6. **✅ Segurança**: Arquivo .env pode ser ignorado no git

## 🔒 Segurança

- O arquivo `.env` deve ser adicionado ao `.gitignore`
- Use `env.example` como template
- Nunca commite senhas ou tokens no repositório
- Use variáveis de ambiente do sistema para dados sensíveis

## 🛠️ Troubleshooting

### **Problema**: Variáveis não são carregadas

**Solução**: Verifique se o arquivo `.env` existe na pasta `docker/`

### **Problema**: Serviços não conseguem se conectar

**Solução**: Verifique as URLs no arquivo `.env`

### **Problema**: Banco de dados não encontrado

**Solução**: Verifique os nomes dos bancos (`DB_*`) no `.env`
