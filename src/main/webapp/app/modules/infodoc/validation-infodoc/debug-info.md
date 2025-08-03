# Debug - Campo Área/Processo não carrega corretamente

## Problema Identificado

O campo "Área/Processo" na tela de validação (`/infodoc/validation/23`) não está carregando o valor correto do documento.

## Análise do Problema

### Fluxo Atual (Problemático):

1. **useEffect inicial**: Carrega processos e define `selectedProcess` como primeiro processo
2. **useEffect do documento**: Quando documento carrega, sobrescreve `selectedProcess` com `idProcesso` do documento
3. **Problema**: Se documento carregar antes dos processos, o valor pode ser incorreto

### Solução Implementada:

1. **Remoção da definição prematura**: Não definir `selectedProcess` no carregamento inicial dos processos
2. **Sincronização**: Aguardar ambos os dados (processos e documento) estarem disponíveis
3. **Validação**: Verificar se o processo do documento existe na lista antes de definir
4. **Fallback**: Se processo não existir, usar primeiro da lista

## Logs de Debug Adicionados

### Console Logs:

- `Processos carregados:` - Mostra dados retornados pela API
- `Carregando dados do documento:` - Mostra dados do documento
- `Processos disponíveis:` - Mostra lista de processos
- `ID do processo do documento:` - Mostra ID do processo do documento
- `Processo encontrado na lista:` - Confirma se processo foi encontrado
- `Processo não encontrado, usando primeiro da lista:` - Fallback

## Como Testar

1. Acesse `http://localhost:9000/infodoc/validation/23`
2. Abra o Console do navegador (F12)
3. Verifique os logs para identificar:
   - Se os processos estão sendo carregados
   - Se o documento está sendo carregado
   - Se o ID do processo do documento existe na lista
   - Qual valor está sendo definido para `selectedProcess`

## Possíveis Causas

1. **API de Processos**: Erro na chamada `GET /api/processos`
2. **Dados do Documento**: `idProcesso` nulo ou inválido
3. **Timing**: Documento carrega antes dos processos
4. **Tipos de Dados**: Incompatibilidade entre tipos (number vs string)

## Endpoints Relevantes

- **Processos**: `GET services/all4qmsmsgateway/api/processos`
- **Documento**: `GET services/all4qmsmsinfodoc/api/infodoc/documentos/{id}`

## Estrutura de Dados

### Process:

```typescript
{
  id: number;
  numero: string;
  nome: string;
  descricao: string;
  // ...
}
```

### Documento:

```typescript
{
  doc: {
    idProcesso: number;
    // ...
  }
}
```
