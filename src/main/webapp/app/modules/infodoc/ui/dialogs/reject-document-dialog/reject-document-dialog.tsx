import { Textarea } from '@mui/joy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { EnumStatusDoc, EnumTipoMovDoc, InfoDoc, Movimentacao } from 'app/modules/infodoc/models';
import { cadastrarMovimentacao } from 'app/modules/infodoc/reducers/movimentacao.reducer';
import { StyledLabel, StyledTextarea } from 'app/modules/rnc/ui/new/register-types/general-register/styled-components';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import { IUsuario } from '../../../../../shared/model/usuario.model';
import { notifyEmailInfoDoc } from '../../../reducers/infodoc.reducer';
import { UserQMS } from '../../../../../entities/usuario/reducers/usuario.reducer';

const DocumentDescription = React.forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(function InnerTextarea(props, ref) {
  const id = React.useId();
  return (
    <React.Fragment>
      <StyledTextarea minRows={5} cols={100} {...props} ref={ref} id={id} />
      <StyledLabel htmlFor={id}>Justificativa de Reprovação</StyledLabel>
    </React.Fragment>
  );
});

type RejectDialogProps = {
  open: boolean;
  handleClose: () => void;
  documentTitle: string;
  currentUser: UserQMS;
  currentDocument: InfoDoc;
};
export const RejectDocumentDialog = ({ open, handleClose, documentTitle, currentUser, currentDocument }: RejectDialogProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState('');

  const users = useAppSelector(state => state.all4qmsmsgatewayrnc.users.entities);

  const reprovalDocument = async () => {
    await axios
      .put(`services/all4qmsmsinfodoc/api/infodoc/documentos/cancelar/${currentDocument?.doc?.id}`, {
        idDocumento: currentDocument?.doc?.id,
        idUsuario: currentUser ? currentUser.id : 0,
        justificativa: description,
      })
      .then(async () => {
        toast.success('Documento rejeitado!');
        const userEmitter: IUsuario = users.filter(usr => usr.id?.toString() == currentDocument.doc?.idUsuarioCriacao)[0];
        dispatch(
          notifyEmailInfoDoc({
            to: userEmitter?.email || '', // Email
            subject: 'Documento REPROVADO por SGQ',
            tipo: 'REPROVAR',
            nomeEmissor: userEmitter?.nome || '', // nome
            tituloDocumento: 'Documento REPROVADO',
            dataCriacao: new Date(Date.now()).toLocaleDateString('pt-BR'),
            descricao: `Documento rejeitado por ${currentUser.nome} com o email ${currentUser.email}`,
            motivoReprovacao: '',
          })
        );

        setDescription('');
        navigate('/infodoc');
      })
      .catch(e => {
        toast.error('Erro ao rejeitar documento');
      });

    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <h1 style={{ fontSize: '1.2rem', textAlign: 'center' }}>Justificar reprovação</h1>
          <h3 style={{ fontSize: '1rem', textAlign: 'center' }}>{currentDocument?.doc?.titulo}</h3>
        </DialogTitle>
        <DialogContent>
          <Textarea
            className="w-100"
            slots={{ textarea: DocumentDescription }}
            slotProps={{ textarea: { placeholder: '' } }}
            sx={{ borderRadius: '6px' }}
            onChange={e => setDescription(e.target.value)}
            name="ncArea"
          />
        </DialogContent>
        <DialogActions>
          <Button className="format-button" onClick={handleClose}>
            Voltar
          </Button>
          <Button
            className="ms-3 me-3 format-button"
            variant="contained"
            color="primary"
            style={{ background: '#A23900', color: '#fff' }}
            onClick={() => reprovalDocument()}
          >
            Reprovar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
