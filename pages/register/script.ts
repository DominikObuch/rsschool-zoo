import '../../src/styles/main.scss';
import './register.scss';
import type { ZooInput } from '../../components/zoo-input/zoo-input.ts';
import type { ApiErrorResponseDto } from '../../src/api/models/common.dto.ts';
import { authService } from '../../src/api/services/auth.service.ts';
import { authTokenStorage } from '../../src/utils/auth-token.ts';
import { authProfileStorage } from '../../src/utils/auth-profile.ts';

const NAME_PATTERN = /^[A-Za-z]{3,}$/;
const LOGIN_PATTERN = /^[A-Za-z][A-Za-z]{2,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[^A-Za-z0-9]).{6,}$/;

type AuthLikeResponse = {
  token?: string;
  access_token?: string;
  data?: {
    token?: string;
    access_token?: string;
  };
};

function extractToken(response: unknown): string {
  const payload = response as AuthLikeResponse;
  return payload.token
    ?? payload.access_token
    ?? payload.data?.token
    ?? payload.data?.access_token
    ?? '';
}

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
  if (!NAME_PATTERN.test(normalized)) return 'Name must contain only English letters and be at least 3 characters.';
  return null;
}

function validateLogin(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Login is required';
  if (!LOGIN_PATTERN.test(normalized)) return 'Login must start with a letter and contain only English letters (min 3).';
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
  if (!PASSWORD_PATTERN.test(value)) return 'Password must be at least 6 chars and include 1 special character.';
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
  const submitBtn = form.querySelector<HTMLElement>('zoo-btn');

  const syncSubmitState = (): void => {
    const valid = Boolean(
      nameInput
      && loginInput
      && emailInput
      && passwordInput
      && confirmPasswordInput
      && validateName(nameInput.value) === null
      && validateLogin(loginInput.value) === null
      && validateEmail(emailInput.value) === null
      && validatePassword(passwordInput.value) === null
      && validateConfirmPassword(passwordInput.value, confirmPasswordInput.value) === null,
    );

    if (!submitBtn) return;
    if (valid) submitBtn.removeAttribute('disabled');
    else submitBtn.setAttribute('disabled', '');
  };

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
      syncSubmitState();
    });

    input.addEventListener('input', () => {
      syncSubmitState();
    });
  });

  passwordInput?.addEventListener('input', () => {
    if (confirmPasswordInput?.value) {
      validateField(confirmPasswordInput);
    }
    syncSubmitState();
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

      const token = extractToken(response);
      if (token) authTokenStorage.set(token);

      authProfileStorage.set({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        login: loginInput.value.trim(),
      });

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

  syncSubmitState();
}
