import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './pendencia.reducer';

export const PendenciaDeleteDialog = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<'id'>();

  const [loadModal, setLoadModal] = useState(false);

  useEffect(() => {
    dispatch(getEntity(id));
    setLoadModal(true);
  }, []);

  const pendenciaEntity = useAppSelector(state => state.all4qmsmsgateway.pendencia.entity);
  const updateSuccess = useAppSelector(state => state.all4qmsmsgateway.pendencia.updateSuccess);

  const handleClose = () => {
    navigate('/pendencia' + location.search);
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(pendenciaEntity.id));
  };

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy="pendenciaDeleteDialogHeading">
        {/* <Translate contentKey="entity.delete.title">Confirm delete operation</Translate> */}
        Confirmar
      </ModalHeader>
      <ModalBody id="all4QmsMsGatewayApp.pendencia.delete.question">
        Você deseja remover esta Pendencia?
        {/* <Translate contentKey="all4QmsMsGatewayApp.pendencia.delete.question" interpolate={{ id: pendenciaEntity.id }}>
          Are you sure you want to delete this Pendencia?
        </Translate> */}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={handleClose}>
          <FontAwesomeIcon icon="ban" />
          &nbsp;
          {/* <Translate contentKey="entity.action.cancel">Cancel</Translate> */}
          Cancelar
        </Button>
        <Button id="jhi-confirm-delete-pendencia" data-cy="entityConfirmDeleteButton" color="danger" onClick={confirmDelete}>
          <FontAwesomeIcon icon="trash" />
          &nbsp;
          {/* <Translate contentKey="entity.action.delete">Delete</Translate> */}
          Deletar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PendenciaDeleteDialog;
