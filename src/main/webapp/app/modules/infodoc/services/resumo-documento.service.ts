import axios, { AxiosResponse } from 'axios';

import { ResumoDocumento, StatusResumo, SolicitacaoResumoRequest, AtualizarStatusRequest } from '../models/resumo-documento';

export type EntityResponseType = AxiosResponse<ResumoDocumento>;
export type EntityArrayResponseType = AxiosResponse<ResumoDocumento[]>;

export class ResumoDocumentoService {
  public resourceUrl = 'services/all4qmsmsinfodoc/api/resumo-documento';

  create(resumoDocumento: ResumoDocumento): Promise<EntityResponseType> {
    return axios.post<ResumoDocumento>(this.resourceUrl, resumoDocumento);
  }

  update(resumoDocumento: ResumoDocumento): Promise<EntityResponseType> {
    return axios.put<ResumoDocumento>(`${this.resourceUrl}/${resumoDocumento.id}`, resumoDocumento);
  }

  partialUpdate(resumoDocumento: ResumoDocumento): Promise<EntityResponseType> {
    return axios.patch<ResumoDocumento>(`${this.resourceUrl}/${resumoDocumento.id}`, resumoDocumento);
  }

  find(id: number): Promise<EntityResponseType> {
    return axios.get<ResumoDocumento>(`${this.resourceUrl}/${id}`);
  }

  query(req?: any): Promise<EntityArrayResponseType> {
    const options = req ? { params: req } : {};
    return axios.get<ResumoDocumento[]>(this.resourceUrl, options);
  }

  delete(id: number): Promise<AxiosResponse<{}>> {
    return axios.delete(`${this.resourceUrl}/${id}`);
  }

  // Métodos específicos para resumo IA

  solicitarResumo(request: SolicitacaoResumoRequest): Promise<EntityResponseType> {
    return axios.post<ResumoDocumento>(`${this.resourceUrl}/solicitar`, request);
  }

  getResumosByDocumento(idDocumento: number): Promise<EntityArrayResponseType> {
    return axios.get<ResumoDocumento[]>(`${this.resourceUrl}/documento/${idDocumento}`);
  }

  getResumoByTicket(ticket: string): Promise<EntityResponseType> {
    return axios.get<ResumoDocumento>(`${this.resourceUrl}/ticket/${ticket}`);
  }

  getResumosByStatus(status: StatusResumo): Promise<EntityArrayResponseType> {
    return axios.get<ResumoDocumento[]>(`${this.resourceUrl}/status/${status}`);
  }

  getResumosPendentes(): Promise<EntityArrayResponseType> {
    return axios.get<ResumoDocumento[]>(`${this.resourceUrl}/pendentes`);
  }

  updateStatus(id: number, request: AtualizarStatusRequest): Promise<EntityResponseType> {
    return axios.put<ResumoDocumento>(`${this.resourceUrl}/${id}/status`, request);
  }

  hasResumoConcluido(idDocumento: number): Promise<AxiosResponse<boolean>> {
    return axios.get<boolean>(`${this.resourceUrl}/documento/${idDocumento}/concluido`);
  }

  getResumoConcluidoMaisRecente(idDocumento: number): Promise<EntityResponseType> {
    return axios.get<ResumoDocumento>(`${this.resourceUrl}/documento/${idDocumento}/concluido/recente`);
  }

  // Métodos utilitários

  getStatusDisplayName(status: StatusResumo): string {
    const displayNames: Record<StatusResumo, string> = {
      [StatusResumo.PENDING]: 'Aguardando processamento',
      [StatusResumo.PROCESSING]: 'Em processamento',
      [StatusResumo.DONE]: 'Concluído com sucesso',
      [StatusResumo.ERROR]: 'Erro no processamento',
    };
    return displayNames[status] || status;
  }

  getStatusColor(status: StatusResumo): string {
    const colors: Record<StatusResumo, string> = {
      [StatusResumo.PENDING]: 'warning',
      [StatusResumo.PROCESSING]: 'info',
      [StatusResumo.DONE]: 'success',
      [StatusResumo.ERROR]: 'danger',
    };
    return colors[status] || 'secondary';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s atrás`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
    return `${Math.floor(diffInSeconds / 86400)}d atrás`;
  }
}
