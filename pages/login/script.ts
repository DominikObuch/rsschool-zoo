import '../../src/styles/main.scss';
import './login.scss';
import type { ZooInput } from '../../components/zoo-input/zoo-input.ts';
import type { ApiErrorResponseDto } from '../../src/api/models/common.dto.ts';
import { authService } from '../../src/api/services/auth.service.ts';
import { authTokenStorage } from '../../src/utils/auth-token.ts';

const LOGIN_PATTERN = /^[A-Za-z0-9._-]{3,24}$/;
const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*()[\]{}\\|;:'\",.<>/?`~_\-+=]).{8,}$/;

function getErrorMessage(error: unknown): { statusCode?: number; message: string } {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorResponseDto;
    return {
      statusCode: apiError.statusCode,
      message: apiError.message || apiError.error || 'Unexpected error. Please try again.',
    };
  }

  return { message: 'Unexpected error. Please try again.' };
}

function validateLogin(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Login is required';
  if (!LOGIN_PATTERN.test(normalized)) return 'Login must be 3-24 chars: letters, numbers, dot, underscore or dash';
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return 'Password is required';
  if (!PASSWORD_PATTERN.test(value)) return 'Password must be at least 8 chars and include 1 special character';
  return null;
}

const form = document.querySelector<HTMLFormElement>('.auth-page__form');

if (form) {
  const loginInput = form.querySelector<ZooInput>('zoo-input[name="login"]');
  const passwordInput = form.querySelector<ZooInput>('zoo-input[name="password"]');
  const errorEl = form.querySelector<HTMLElement>('#login-form-error');
  const submitBtn = form.querySelector('zoo-btn');

  const validateField = (input: ZooInput | null): boolean => {
    if (!input) return false;

    const name = input.getAttribute('name');
    const value = input.value;
    let error: string | null = null;

    if (name === 'login') error = validateLogin(value);
    if (name === 'password') error = validatePassword(value);

    if (error) {
      input.setAttribute('error', error);
      return false;
    }

    input.removeAttribute('error');
    return true;
  };

  [loginInput, passwordInput].forEach((input) => {
    if (!input) return;

    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('focus', () => {
      input.removeAttribute('error');
      if (errorEl) errorEl.textContent = '';
    });
  });

  const submit = async (): Promise<void> => {
    if (errorEl) errorEl.textContent = '';

    const isLoginValid = validateField(loginInput);
    const isPasswordValid = validateField(passwordInput);
    if (!isLoginValid || !isPasswordValid || !loginInput || !passwordInput) return;

    try {
      const response = await authService.login({
        login: loginInput.value.trim(),
        password: passwordInput.value,
      });

      authTokenStorage.set(response.token);
      window.location.href = '../landing/index.html';
    } catch (error: unknown) {
      const parsed = getErrorMessage(error);
      if (errorEl) errorEl.textContent = parsed.message;
    }
  };

  submitBtn?.addEventListener('zoo-click', () => {
    void submit();
  });
}
