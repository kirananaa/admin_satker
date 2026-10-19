import type { InputHTMLAttributes } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'onChange' | 'onBlur' | 'ref'> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError | { message?: string };
}

export function FormField({ label, registration, error, id, ...input }: Props) {
  const inputId = id ?? `field-${registration.name}`;
  const errorId = `${inputId}-error`;

  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...registration}
        {...input}
      />
      {error?.message && (
        <p id={errorId} className="field-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}