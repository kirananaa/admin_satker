import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { errorMessage, fieldErrors } from '@/shared/api/client';
import { useAuth } from '@/shared/auth/AuthProvider';
import { FormField } from '@/shared/ui/FormField';

const schema = z.object({
  login: z.string().trim().min(1, 'Username atau email wajib diisi.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.'),
});
type Values = z.infer<typeof schema>;

export function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const from = (location.state as { from?: string } | null)?.from ?? '/satker';

  if (status === 'authenticated') return <Navigate to={from} replace />;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values.login, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      const server = fieldErrors(error);
      const names = Object.keys(server) as (keyof Values)[];
      if (names.length > 0) names.forEach((name) => setError(name, { message: server[name] }));
      else setFormError(errorMessage(error));
    }
  });

  return (
    <main className="login">
      <h1>SIMRIS Admin Satker</h1>
      <form onSubmit={onSubmit} noValidate>
        <FormField label="Username atau email" autoComplete="username" registration={register('login')} error={errors.login} />
        <FormField
          label="Kata sandi"
          type="password"
          autoComplete="current-password"
          registration={register('password')}
          error={errors.password}
        />
        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </main>
  );
}