export const validateFields = (clientForm, setClientForm): boolean => {
  const validateName = () => {
    let valid = true;
    if (clientForm.name.value == '') {
      setClientForm({ ...clientForm, name: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, name: { value: clientForm.name.value, error: false } });
    }
    return valid;
  };

  const validateProductCode = () => {
    let valid = true;
    if (clientForm.productCode.value == '') {
      setClientForm({ ...clientForm, productCode: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, productCode: { value: clientForm.productCode.value, error: false } });
    }
    return valid;
  };

  const validateProductCode2 = () => {
    let valid = true;
    if (clientForm.productCode2.value == '') {
      setClientForm({ ...clientForm, productCode2: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, productCode2: { value: clientForm.productCode2.value, error: false } });
    }
    return valid;
  };

  const validateProductDescription = () => {
    let valid = true;
    if (clientForm.productDescription.value == '') {
      setClientForm({ ...clientForm, productDescription: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, productDescription: { value: clientForm.productDescription.value, error: false } });
    }
    return valid;
  };

  const validateReceipt = () => {
    let valid = true;
    if (clientForm.receipt.value == '') {
      setClientForm({ ...clientForm, receipt: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, receipt: { value: clientForm.receipt.value, error: false } });
    }
    return valid;
  };

  const validateNfDate = () => {
    let valid = true;
    if (clientForm.nfDate.value == '') {
      setClientForm({ ...clientForm, nfDate: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, nfDate: { value: clientForm.nfDate.value, error: false } });
    }
    return valid;
  };

  const validateRequestNumber = () => {
    let valid = true;
    if (clientForm.requestNumber.value == '') {
      setClientForm({ ...clientForm, requestNumber: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, requestNumber: { value: clientForm.requestNumber.value, error: false } });
    }
    return valid;
  };

  const validateOpNumber = () => {
    let valid = true;
    if (clientForm.opNumber.value == '') {
      setClientForm({ ...clientForm, opNumber: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, opNumber: { value: clientForm.opNumber.value, error: false } });
    }
    return valid;
  };

  const validateLotQuantity = () => {
    let valid = true;
    if (clientForm.opNumber.value == '') {
      setClientForm({ ...clientForm, lotQuantity: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, lotQuantity: { value: clientForm.lotQuantity.value, error: false } });
    }
    return valid;
  };

  const validateRejectedQuantity = () => {
    let valid = true;
    if (clientForm.opNumber.value == '') {
      setClientForm({ ...clientForm, rejectedQuantity: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, rejectedQuantity: { value: clientForm.rejectedQuantity.value, error: false } });
    }
    return valid;
  };

  const validateLot = () => {
    let valid = true;
    if (clientForm.opNumber.value == '') {
      setClientForm({ ...clientForm, lot: { value: '', error: true } });
      valid = false;
    } else {
      setClientForm({ ...clientForm, lot: { value: clientForm.lot.value, error: false } });
    }
    return valid;
  };

  if (
    !validateName() ||
    !validateProductCode() ||
    !validateProductCode2() ||
    !validateProductDescription() ||
    !validateLotQuantity() ||
    !validateRejectedQuantity() ||
    !validateReceipt() ||
    !validateNfDate() ||
    !validateRequestNumber() ||
    !validateOpNumber() ||
    !validateLot()
  ) {
    return false;
  }

  return true;
};
