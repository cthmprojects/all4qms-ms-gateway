import { Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { Enums, NonConformityOrigin } from 'app/modules/rnc/models';

type NonConformityOriginSummaryProps = {
  enums: Enums | null;
  origin: NonConformityOrigin;
};

const NonConformityOriginSummary = ({ enums, origin }: NonConformityOriginSummaryProps) => {
  const formatTimestamp = (timestamp: Date): string => {
    const date: Date = new Date(timestamp);
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    const yearStr: string = year.toString().padStart(4, '0');
    const monthStr: string = month.toString().padStart(2, '0');
    const dayStr: string = day.toString().padStart(2, '0');

    return `${yearStr}/${monthStr}/${dayStr}`;
  };

  const formatDate = (timestamp: Date): string => {
    const date: Date = new Date(timestamp);
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    const yearStr: string = year.toString().padStart(4, '0');
    const monthStr: string = month.toString().padStart(2, '0');
    const dayStr: string = day.toString().padStart(2, '0');

    return `${dayStr}/${monthStr}/${yearStr}`;
  };

  function identificadoNoLabel(value: string) {
    const labels = {
      process: 'Processo',
      reception: 'Recebimento',
    };
    return labels[value] || 'Carregando...';
  }

  return (
    <Card>
      <CardHeader title="Origem" />
      <CardContent>
        {origin?.auditoria && (
          <Stack direction="row" spacing={2}>
            <TextField disabled label="Norma" placeholder="Norma" value={origin?.auditoria.normaAuditoria} />
            <TextField disabled label="Número da notação" placeholder="Número da notação" value={origin?.auditoria.idNaoConformidade} />
            <TextField
              disabled
              label="Requisito(s) da Norma"
              placeholder="Requisito(s) da Norma"
              value={origin?.auditoria.requisitoAuditoria}
            />
            <TextField
              disabled
              label="Número do Relatório"
              placeholder="Número do Relatório"
              value={origin?.auditoria.sequecialAuditoria}
            />
          </Stack>
        )}

        {origin?.cliente && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField disabled label="Nome" placeholder="Nome" value={origin?.cliente.cliente.nomeClienteReclamacao} />
              <TextField disabled label="Código do produto" placeholder="Código do produto" value={origin?.cliente.produto.codigoProduto} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                disabled
                label="Nome do fornecedor"
                placeholder="Nome do fornecedor"
                value={origin?.cliente.produto.nomeFornecedor}
              />
              <TextField disabled label="Nome do produto" placeholder="Nome do produto" value={origin?.cliente.produto.nomeProduto} />
              <TextField disabled label="Quantidade do lote" placeholder="Quantidade do lote" value={origin?.cliente.produto.qtdLote} />
              <TextField
                disabled
                label="Quantidade rejeitada"
                placeholder="Quantidade rejeitada"
                value={origin?.cliente.produto.qtdRejeicao}
              />
              <TextField
                disabled
                label="% defeito"
                placeholder="% defeito"
                value={origin?.cliente.produto.qtdDefeito || (origin?.cliente.produto.qtdRejeicao / origin?.cliente.produto.qtdLote) * 100}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField disabled label="Lote" placeholder="Lote" value={origin?.cliente.produto.lote} />
              <TextField
                disabled
                label="Data da entrega"
                placeholder="Data da entrega"
                value={formatDate(origin?.cliente.rastreabilidade.dtEntregaNF)}
              />
              <TextField disabled label="Nota fiscal" placeholder="Nota fiscal" value={origin?.cliente.rastreabilidade.numNF} />
              <TextField disabled label="Data NF" placeholder="Data NF" value={formatDate(origin?.cliente.rastreabilidade.dtNF)} />
              <TextField disabled label="Número de pedido" placeholder="Número de pedido" value={origin?.cliente.produto.numPedido} />
              <TextField disabled label="Número OP" placeholder="Número OP" value={origin?.cliente.produto.numOP} />
            </Stack>
          </Stack>
        )}

        {origin?.mpprod && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField disabled label="Código" placeholder="Código" value={origin?.mpprod.produto.codigoProduto} />
              <TextField disabled label="Descrição" placeholder="Descrição" value={origin?.mpprod.produto.nomeProduto} />
              <TextField
                disabled
                label="Identificado no"
                placeholder="Identificado no"
                value={identificadoNoLabel(origin?.mpprod.produto.identificador)}
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField disabled label="Turno" placeholder="Turno" value={origin?.mpprod.operador.turnoOperador} />
              <TextField disabled label="Linha" placeholder="Linha" value={origin?.mpprod.operador.linhaOperador} />
              <TextField disabled label="Operador" placeholder="Operador" value={origin?.mpprod.operador.nomeOperador} />
              <TextField disabled label="Inspetor" placeholder="Inspetor" value={origin?.mpprod.operador.nomeInspetorOperador} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField disabled label="Lote" placeholder="Lote" value={origin?.mpprod.produto.lote} />
              <TextField disabled label="Quantidade do Lote" placeholder="Quantidade do Lote" value={origin?.mpprod.produto.qtdLote} />
              <TextField
                disabled
                label="Regime de inspeção"
                placeholder="Regime de inspeção"
                value={origin?.mpprod.produto.regimeInspecao}
              />
              <TextField disabled label="NQA" placeholder="NQA" value={origin?.mpprod.produto.nqa} />
              <TextField disabled label="Número de amostras" placeholder="Número de amostras" value={origin?.mpprod.produto.qtdAmostra} />
              <TextField disabled label="Número de defeitos" placeholder="Número de defeitos" value={origin?.mpprod.produto.qtdDefeito} />
              <TextField disabled label="% Rejeição" placeholder="% Rejeição" value={origin?.mpprod.produto.qtdRejeicao?.toFixed(2)} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                disabled
                label="Data da entrega"
                placeholder="Data da entrega"
                value={formatDate(origin?.mpprod.rastreabilidade.dtEntregaNF)}
              />
              <TextField disabled label="Nota fiscal" placeholder="Nota fiscal" value={origin?.mpprod.rastreabilidade.numNF} />
              <TextField disabled label="Data NF" placeholder="Data NF" value={formatDate(origin?.mpprod.rastreabilidade.dtNF)} />
              <TextField disabled label="Número de pedido" placeholder="Número de pedido" value={origin?.mpprod.produto.numPedido} />
              <TextField disabled label="Número OP" placeholder="Número OP" value={origin?.mpprod.produto.numOP} />
            </Stack>
          </Stack>
        )}

        {origin?.outros && (
          <Stack spacing={2}>
            <TextField disabled label="Outros" placeholder="Outros" value={origin?.outros} />
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default NonConformityOriginSummary;
