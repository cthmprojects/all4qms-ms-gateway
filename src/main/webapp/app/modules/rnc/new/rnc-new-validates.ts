export const validateFields = (firstForm, setFirstForm, setFormError): boolean => {
  const validateProcessOrigin = () => {
    let valid = true;
    if (firstForm.processOrigin.value == '') {
      setFirstForm({ ...firstForm, processOrigin: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, processOrigin: { value: firstForm.processOrigin.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateForwarded = () => {
    let valid = true;
    if (firstForm.forwarded.value == '') {
      setFirstForm({ ...firstForm, forwarded: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, forwarded: { value: firstForm.forwarded.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateProcessTarget = () => {
    let valid = true;
    if (firstForm.processTarget.value == '') {
      setFirstForm({ ...firstForm, processTarget: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, processTarget: { value: firstForm.processTarget.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateType = () => {
    let valid = true;
    if (firstForm.type.value == '') {
      setFirstForm({ ...firstForm, type: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, type: { value: firstForm.type.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  const validateOrigin = () => {
    let valid = true;
    if (firstForm.origin.value == '') {
      setFirstForm({ ...firstForm, origin: { value: '', error: true } });
      setFormError(true);
      valid = false;
    } else {
      setFirstForm({ ...firstForm, origin: { value: firstForm.origin.value, error: false } });
      setFormError(false);
    }
    return valid;
  };

  if (!validateProcessOrigin()) {
    return false;
  }

  if (!validateForwarded()) {
    return false;
  }

  if (!validateProcessTarget()) {
    return false;
  }

  if (!validateType()) {
    return false;
  }

  if (!validateOrigin()) {
    return false;
  }

  return true;
};
