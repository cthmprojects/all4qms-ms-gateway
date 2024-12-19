import axios from 'axios';
import { RawInterestedPart, RawRiskOpportunity } from '../risks-opportunities/models';
import { EixosSwot } from './models/swot';
import { addToast } from 'app/shared/util/add-toast';
import { IUser } from 'app/shared/model/user.model';
import { Storage } from 'react-jhipster';

const apiPartesInteressadasUrl = 'services/all4qmsmsrisco/api/risco/partes-interessadas';
const apiRiscoOportunidadeUrl = 'services/all4qmsmsrisco/api/risco/risco-oportunidades';
const apiUrl = 'services/all4qmsmsauditplan/api/planest/swots';

const updateSwotWithRo = async (swot: EixosSwot) => {
  return axios.put<EixosSwot>(`${apiUrl}/${swot.id}`, swot);
};

const createInterestedPart = async () => {
  const { data } = await axios.post<RawInterestedPart>(apiPartesInteressadasUrl, { nomeParteInteressada: '' });
  return data;
};
export const createRiskOportunity = addToast(
  async (swot: EixosSwot, type: 'R' | 'O') => {
    const user = JSON.parse(Storage.session.get('USUARIO_QMS'));
    const parts = await createInterestedPart();
    const payload = {
      dataRegistro: new Date().toISOString(),
      descricao1: swot.descricao,
      descricao2: '',
      descricao3: '',
      descricaoControle: '',
      idEmissor: user?.id, //
      idPartesInteressadas: parts.id,
      idsAnaliseROS: null,
      nomeAtividade: '',
      nomeFluxo: '',
      tipoRO: type,
    };

    const { data } = await axios.post<RawRiskOpportunity>(apiRiscoOportunidadeUrl, payload);
    updateSwotWithRo({ ...swot, idRiscoOportunidade: data.id });
  },
  'Registro criado em Risco/Oportunidade',
  'Erro ao criar registro em Risco Oportunidade'
);

export const listAgroupedSwots = addToast(
  async () => {
    const { data } = await axios.get<{ forcas: EixosSwot[]; fraquezas: EixosSwot[]; oportunidades: EixosSwot[]; ameacas: EixosSwot[] }>(
      `${apiUrl}/agrupado`
    );
    return data;
  },
  '',
  'Erro ao tentar listar swots cadastrados'
);

export const deleteSwot = addToast(
  async (eixo: EixosSwot) => {
    const { data } = await axios.delete(`${apiUrl}/${eixo.id}`);
    return data;
  },
  'Item excluído com sucesso',
  'Erro ao excluir, tente novamente'
);
