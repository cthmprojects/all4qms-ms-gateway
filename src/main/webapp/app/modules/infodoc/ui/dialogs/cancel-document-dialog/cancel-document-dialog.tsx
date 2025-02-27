import React, { useEffect, useState } from 'react';
import { Textarea } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { InfoDoc } from 'app/modules/infodoc/models';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import { Button } from 'reactstrap';
import { aprovarCancelDocument, cancelDocument, solicitarCancelDocument } from 'app/modules/infodoc/reducers/infodoc.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Storage } from 'react-jhipster';
import axios, { AxiosResponse } from 'axios';
import { createEntity as createPendencia } from 'app/entities/pendencia/pendencia.reducer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IUsuario } from '../../../../../shared/model/usuario.model';
import { notifyEmailInfoDoc, updateInfoDoc } from '../../../reducers/infodoc.reducer';
import { Doc, EnumSituacao, StatusEnum } from '../../../models/infodoc';
import { atualizarMovimentacao } from '../../../reducers/movimentacao.reducer';
import { EnumStatusDoc, EnumTipoMovDoc, Movimentacao } from '../../../models/movimentacao';

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();

  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={100} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Motivo da solicitação</StyledLabel>
    </React.Fragment>
  );
});

type CancelDocumentDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
  infodoc: InfoDoc;
  userId: number;
  usersSGQ: [];
};
export const CancelDocumentDialog = ({ open, handleClose, documentTitle, infodoc, userId, usersSGQ }: CancelDocumentDialogProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [justifyValue, setJustifyValue] = useState('');

  const [isSGQ, setIsSGQ] = useState(false);
  const [currentUser, _] = useState(JSON.parse(Storage.session.get('USUARIO_QMS')));
  const users: IUsuario[] = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);

  useEffect(() => {
    const roles = Storage.local.get('ROLE');
    const _isSGQ = ['ROLE_ADMIN', 'ROLE_SGQ'].some(item => roles.includes(item));
    setIsSGQ(_isSGQ);
  }, []);

  const sendPendenciasSGQ = () => {
    toast.success('Documento Cancelado!');
    const userEmitter: IUsuario = users.filter(usr => usr.id?.toString() == infodoc.doc?.idUsuarioCriacao.toString())[0];
    dispatch(
      notifyEmailInfoDoc({
        to: userEmitter?.email || '', // Email
        subject: 'Documento Cancelado por SGQ',
        tipo: 'REPROVAR',
        nomeEmissor: userEmitter?.nome || '', // nome
        tituloDocumento: 'Documento Cancelado',
        dataCriacao: new Date(Date.now()).toLocaleDateString('pt-BR'),
        descricao: `Documento Cancelado por ${currentUser.nome} com o email ${currentUser.email}`,
        motivoReprovacao: '',
      })
    );
  };

  const requestCancelInfoDoc = (justify: string) => {
    if (!justify) {
      toast.error('Motivo do cancelamento não pode estar vazio');
      return;
    }

    const params = { id: infodoc.doc.id, userLoginID: userId, justify };

    if (isSGQ) {
      dispatch(aprovarCancelDocument(params));
      sendPendenciasSGQ();
    } else {
      dispatch(solicitarCancelDocument(params));
    }
    setJustifyValue('');
    // navigate('/infodoc');
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Solicitar Cancelamento</h1>
          <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{documentTitle}</h3>
        </DialogTitle>
        <DialogContent>
          <Textarea
            id="justify"
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            name="ncArea"
            value={justifyValue || ''}
            onChange={e => setJustifyValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ paddingBottom: '20px' }}>
          <Button className="format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button
            className="ms-3 me-3 format-button"
            variant="contained"
            color="primary"
            style={{ background: '#A23900', color: '#fff' }}
            onClick={() => requestCancelInfoDoc(justifyValue)}
          >
            {isSGQ ? 'Cancelar' : 'Solicitar'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
