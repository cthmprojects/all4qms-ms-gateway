import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit';
import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
import axios from 'axios';
import { Doc, DocAttachment, DocumentacaoRequest, InfoDoc, UploadAnexo } from '../models';

const apiAttachmentUrl = 'services/all4qmsmsinfodoc/api/infodoc/anexos';
const apiAttachmentDownloadUrl = 'services/all4qmsmsinfodoc/api/infodoc/anexos/download/';
const apiDocPromptIA = 'https://api-llm-all4qms.cthmprojetos.com/api/docPrompt';

// Initial State
const initialState: EntityState<DocAttachment> = {
  entities: [],
  entity: null,
  errorMessage: null,
  loading: false,
  updateSuccess: false,
  updating: false,
  links: '',
  totalItems: 0,
};

export const listAnexos = createAsyncThunk('anexos/list', async () => {
  const url = apiAttachmentUrl;

  return axios.get<Array<DocAttachment>>(url);
});

export const downloadAnexo = createAsyncThunk('anexos/get', async (id: number) => {
  const url = apiAttachmentDownloadUrl + id;
  return axios.get<string>(url);
});

export const getById = createAsyncThunk('anexos/get', async (id: number) => {
  const url = apiAttachmentUrl + '/' + id;
  return axios.get<DocAttachment>(url);
});

export const getResumeIA = createAsyncThunk('anexo/get/resume-ia', async (arquivo: File | undefined) => {
  if (!arquivo) {
    return null;
  }
  try {
    const formData = new FormData();

    formData.append('file', arquivo);
    // formData.append('idDocumentacao', String(anexo.idDocumentacao));

    // const response = await axios.post(apiDocPromptIA, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //   },
    // });
    const response = await fetch(apiDocPromptIA, {
      method: 'POST', // Método que permite envio de dados
      body: formData, // Dados multipart/form-data
      headers: {
        // Não defina `Content-Type` explicitamente ao usar FormData.
        // O navegador definirá o cabeçalho correto, incluindo o boundary.
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Arquivo enviado com sucesso:', result);
    } else {
      console.error('Erro ao enviar o arquivo:', response.statusText);
    }

    return response;
  } catch (err) {
    console.error('API getResumeIA: ', err);
  }
});

export const uploadAnexo = createAsyncThunk('anexos/post', async (anexo: UploadAnexo) => {
  if (!anexo.arquivo) {
    return null;
  }

  const formData = new FormData();

  formData.append('arquivo', anexo.arquivo);
  // formData.append('idDocumentacao', String(anexo.idDocumentacao));

  const response = await axios.post(apiAttachmentUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response;
});

const Anexo = createEntitySlice({
  name: 'anexo',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isPending(listAnexos), (state, action) => {
        state.loading = true;
      })
      .addMatcher(isFulfilled(listAnexos), (state, action) => {
        const { data, headers } = action.payload;
        return {
          ...state,
          loading: false,
          entities: data,
          entity: null,
          totalItems: parseInt(headers['x-total-count'], 10),
        };
      })
      .addMatcher(isFulfilled(getById), (state, action) => {
        const { data } = action.payload;
        state.updating = false;
        state.loading = false;
        state.entity = data;
      })
      .addMatcher(isFulfilled(downloadAnexo), (state, action) => {
        const { data } = action.payload;
        state.updating = false;
        state.loading = false;
        state.links = data;
      })
      .addMatcher(isFulfilled(uploadAnexo), (state, action) => {
        state.updating = false;
        state.loading = false;
      });
  },
});

export const { reset } = Anexo.actions;

// Reducers
export default Anexo.reducer;
