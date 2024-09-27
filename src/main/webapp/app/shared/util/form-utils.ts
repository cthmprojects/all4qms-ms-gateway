import { ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from 'react-hook-form';

type ControllerProps = {
  field: any;
  fieldState: any;
  formState: any;
};
export const formField = ({ field, fieldState, formState }: ControllerProps) => {
  return {
    ...field,
    required: true,
    error: !!fieldState?.error?.message,
    helperText: fieldState?.error?.message,
  };
};
