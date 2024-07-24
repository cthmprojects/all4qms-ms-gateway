import { createAsyncThunk } from '@reduxjs/toolkit';
import { InfoDoc } from 'app/modules/infodoc/models';
import axios from 'axios';

interface ListParams {
  idProcesso?: number;
  pesquisa?: string;
}

const apiDocumentacaoUrl = 'services/all4qmsmsinfodoc/api/infodoc/documentos';

export const listdocs = createAsyncThunk('risk/list', async (params: ListParams) => {
  const filteredQuery: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!!value) {
      filteredQuery[key] = `${value}`;
    }
  }

  filteredQuery['cacheBuster'] = `${new Date().getTime()}`;

  return axios.get<Array<InfoDoc>>(`${apiDocumentacaoUrl}`, { params: filteredQuery });
});
