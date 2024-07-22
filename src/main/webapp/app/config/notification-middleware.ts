import { toast } from 'react-toastify';
import { isFulfilledAction, isRejectedAction } from 'app/shared/reducers/reducer.utils';

const addErrorAlert = (message, key?, data?) => {
  toast.error(message);
};

export default () => next => action => {
  const { error, payload } = action;

  /**
   *
   * The notification middleware serves to add success and error notifications
   */
  if (isFulfilledAction(action) && payload && payload.headers) {
    const headers = payload?.headers;
    let alert: string | null = null;
    headers &&
      Object.entries<string>(headers).forEach(([k, v]) => {
        if (k.toLowerCase().endsWith('app-alert')) {
          alert = v;
        }
      });
    if (alert) {
      const msg = translateItemName(alert);
      if (msg !== 'O usuario foi salvo com sucesso' && msg !== 'O usuario foi excluído com sucesso') {
        toast.success(msg);
      }
    }
  }

  function translateItemName(alert) {
    // console.log('>> alerta: ', alert);
    const words = alert.split(' ');
    if (words[4] === 'created') {
      if (words[2] === 'all4QmsMsInfodocDocumentacaoAnexo') {
        return `O anexo INFODOC foi salvo com sucesso`;
      } else if (words[2] === 'funcao') {
        return `A função foi criada com sucesso`;
      } else if (words[2] === 'all4QmsMsInfodocDocumentacao') {
        return `O documento INFODOC foi salvo com sucesso`;
      } else {
        return `O ${words[2]} foi criado com sucesso`;
      }
    } else if (words[3] === 'updated') {
      if (words[1] === 'funcao') {
        return `A função foi atualizada com sucesso`;
      } else if (words[1] === 'all4QmsMsInfodocMovimentacaoDoc') {
        return `A movimentação foi atualizada com sucesso`;
      } else if (words[1] === 'all4QmsMsInfodocDocumentacao') {
        return `O documento INFODOC foi atualizado com sucesso`;
      } else {
        return `O ${words[1]} foi atualizado com sucesso`;
      }
    } else if (words[3] === 'created') {
      if (words[1] === 'user') {
        return `Um usuário foi criado com sucesso`;
      } else {
        return `O ${words[1]} foi criado com sucesso`;
      }
    } else if (words[3] === 'deleted') {
      if (words[1] === 'user') {
        return `O usuário foi excluído com sucesso`;
      } else if (words[1] === 'funcao') {
        return `A função foi excluída com sucesso`;
      } else {
        return `O ${words[1]} foi excluído com sucesso`;
      }
    } else {
      return `Aviso: ${alert}`;
    }
  }

  function translateFieldName(fieldName) {
    const fieldNameTranslations = {
      Username: 'Usuário',
      Password: 'Senha',
    };
    return fieldNameTranslations[fieldName] || fieldName;
  }

  if (isRejectedAction(action) && error && error.isAxiosError) {
    if (error.response) {
      const response = error.response;
      const data = response.data;
      if (
        !(
          response.status === 401 &&
          (error.message === '' || (data && data.path && (data.path.includes('/api/account') || data.path.includes('/api/authenticate'))))
        )
      ) {
        switch (response.status) {
          // connection refused, server not reachable
          case 0:
            addErrorAlert('Servidor fora de alcance', 'error.server.not.reachable');
            break;

          case 400: {
            let errorHeader: string | null = null;
            let entityKey: string | null = null;
            response?.headers &&
              Object.entries<string>(response.headers).forEach(([k, v]) => {
                if (k.toLowerCase().endsWith('app-error')) {
                  errorHeader = v;
                } else if (k.toLowerCase().endsWith('app-params')) {
                  entityKey = v;
                }
              });
            if (errorHeader) {
              const entityName = entityKey;
              addErrorAlert(errorHeader, errorHeader, { entityName });
            } else if (data?.fieldErrors) {
              const fieldErrors = data.fieldErrors;
              for (const fieldError of fieldErrors) {
                if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                  fieldError.message = 'Size';
                }
                // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                const fieldName = convertedField.charAt(0).toUpperCase() + convertedField.slice(1);
                addErrorAlert(`Erro no campo "${translateFieldName(fieldName)}"`, `error.${fieldError.message}`, { fieldName });
              }
            } else if (typeof data === 'string' && data !== '') {
              addErrorAlert(data);
            }
            break;
          }
          case 404:
            addErrorAlert('Não encontrado', 'error.url.not.found');
            break;

          default:
            if (typeof data === 'string' && data !== '') {
              addErrorAlert(data);
            } else {
              toast.error(data?.message || data?.error || data?.title || 'Erro desconhecido!');
            }
        }
      }
    } else if (error.config && error.config.url === 'api/account' && error.config.method === 'get') {
      /* eslint-disable no-console */
      console.log('Erro de autenticação: Tentando acessar endereço api/account com método GET.');
    } else {
      toast.error(error.message || 'Erro desconhecido!');
    }
  } else if (error) {
    toast.error(error.message || 'Erro desconhecido!');
  }

  return next(action);
};
