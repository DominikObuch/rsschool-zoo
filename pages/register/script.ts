import '../../src/styles/main.scss';
import './register.scss';
import type { ZooInput } from '../../components/zoo-input/zoo-input.ts';
import type { ApiErrorResponseDto } from '../../src/api/models/common.dto.ts';
import { authService } from '../../src/api/services/auth.service.ts';
import { authTokenStorage } from '../../src/utils/auth-token.ts';

const NAME_PATTERN = /^[A-Za-z][A-Za-z\s'-]{1,49}$/;
const LOGIN_PATTERN = /^[A-Za-z0-9._-]{3,24}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[!@#$%^&*()[\]{}\\|;:'\",.<>/?`~_\-+=]).{8,}$/;

function getApiError(error: unknown): { statusCode?: number; message: string } {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorResponseDto;
    return {
      statusCode: apiError.statusCode,
      message: apiError.message || apiError.error || 'Unexpected error. Please try again.',
    };
  }

  return { message: 'Unexpected error. Please try again.' };
}

function validateName(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Name is required';
  if (!NAME_PATTERN.test(normalized)) return 'Use letters, spaces, apostrophe or dash (2-50 chars)';
  return null;
}

function validateLogin(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Login is required';
  if (!LOGIN_PATTERN.test(normalized)) return 'Login must be 3-24 chars: letters, numbers, dot, underscore or dash';
  return null;
}

function validateEmail(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Email is required';
  if (!EMAIL_PATTERN.test(normalized)) return 'Enter a valid email address';
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return 'Password is required';
  if (!PASSWORD_PATTERN.test(value)) return 'Password must be at least 8 chars and include 1 special character';
  return null;
}

function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) return 'Confirm password is required';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
}

const form = document.querySelector<HTMLFormElement>('.auth-page__form');

if (form) {
  const nameInput = form.querySelector<ZooInput>('zoo-input[name="name"]');
  const loginInput = form.querySelector<ZooInput>('zoo-input[name="login"]');
  const emailInput = form.querySelector<ZooInput>('zoo-input[name="email"]');
  const passwordInput = form.querySelector<ZooInput>('zoo-input[name="password"]');
  const confirmPasswordInput = form.querySelector<ZooInput>('zoo-input[name="confirmPassword"]');

  const errorEl = form.querySelector<HTMLElement>('#register-form-error');
  const submitBtn = form.querySelector('zoo-btn');

  const validateField = (input: ZooInput | null): boolean => {
    if (!input) return false;

    const name = input.getAttribute('name');
    const value = input.value;
    let error: string | null = null;

    if (name === 'name') error = validateName(value);
    if (name === 'login') error = validateLogin(value);
    if (name === 'email') error = validateEmail(value);
    if (name === 'password') error = validatePassword(value);
    if (name === 'confirmPassword') {
      error = validateConfirmPassword(passwordInput?.value ?? '', value);
    }

    if (error) {
      input.setAttribute('error', error);
      return false;
    }

    input.removeAttribute('error');
    return true;
  };

  const allInputs = [nameInput, loginInput, emailInput, passwordInput, confirmPasswordInput];

  allInputs.forEach((input) => {
    if (!input) return;

    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('focus', () => {
      input.removeAttribute('error');
      if (errorEl) errorEl.textContent = '';
    });
  });

  passwordInput?.addEventListener('input', () => {
    if (confirmPasswordInput?.value) {
      validateField(confirmPasswordInput);
    }
  });

  const submit = async (): Promise<void> => {
    if (errorEl) errorEl.textContent = '';

    const valid = allInputs.map((input) => validateField(input)).every(Boolean);
    if (!valid || !nameInput || !loginInput || !emailInput || !passwordInput) return;

    try {
      const response = await authService.register({
        name: nameInput.value.trim(),
        login: loginInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
      });

      if (response.token) authTokenStorage.set(response.token);
      window.location.href = '../landing/index.html';
    } catch (error: unknown) {
      const apiError = getApiError(error);
      if (!errorEl) return;

      if (apiError.statusCode === 409) {
        errorEl.textContent = apiError.message;
        return;
      }

      errorEl.textContent = apiError.message;
    }
  };

  submitBtn?.addEventListener('zoo-click', () => {
    void submit();
  });
}
