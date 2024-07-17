import { AutocompleteChangeDetails, AutocompleteChangeReason } from '@mui/material';

export const onAutocompleteChanged = (
  event: React.SyntheticEvent,
  value: string,
  reason: AutocompleteChangeReason,
  details: AutocompleteChangeDetails<string>,
  setter: React.Dispatch<React.SetStateAction<string>>
): void => {
  setter(value);
};

export const onCheckboxChanged = (
  event: React.ChangeEvent<HTMLInputElement>,
  checked: boolean,
  setter: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  setter(checked);
};

export const onDateChanged = (newDate: Date, setter: React.Dispatch<React.SetStateAction<Date>>): void => {
  setter(newDate);
};

export const onTextChanged = (
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<string>>
): void => {
  const { value } = event.target;
  setter(value);
};
