import '../../src/styles/main.scss';
import './login.scss';
import type { ZooInput } from '../../components/zoo-input/zoo-input.ts';
import { authService } from '../../src/api/services/auth.service.ts';
import { authTokenStorage } from '../../src/utils/auth-token.ts';
import { authProfileStorage } from '../../src/utils/auth-profile.ts';

const LOGIN_PATTERN = /^[A-Za-z][A-Za-z]{2,}$/;
const PASSWORD_PATTERN = /^(?=.*[^A-Za-z0-9]).{6,}$/;

function validateLogin(value: string): string | null {
  const normalized = value.trim();
  if (!normalized) return 'Login is required';
  if (!LOGIN_PATTERN.test(normalized)) return 'Login must start with a letter and contain only English letters (min 3).';
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return 'Password is required';
  if (!PASSWORD_PATTERN.test(value)) return 'Password must be at least 6 chars and include 1 special character.';
  return null;
}

const form = document.querySelector<HTMLFormElement>('.auth-page__form');

if (form) {
  const loginInput = form.querySelector<ZooInput>('zoo-input[name="login"]');
  const passwordInput = form.querySelector<ZooInput>('zoo-input[name="password"]');
  const errorEl = form.querySelector<HTMLElement>('#login-form-error');
  const submitBtn = form.querySelector<HTMLElement>('zoo-btn');

  const syncSubmitState = (): void => {
    const canSubmit = Boolean(
      loginInput
      && passwordInput
      && validateLogin(loginInput.value) === null
      && validatePassword(passwordInput.value) === null,
    );

    if (!submitBtn) return;
    if (canSubmit) submitBtn.removeAttribute('disabled');
    else submitBtn.setAttribute('disabled', '');
  };

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
      syncSubmitState();
    });

    input.addEventListener('input', () => {
      syncSubmitState();
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

      // Prime header identity data right after successful auth.
      try {
        const profileResponse = await authService.getProfile(response.token);
        const profile = profileResponse.data;
        authProfileStorage.set({
          name: (profile.name || profile.login).trim(),
          email: profile.email.trim(),
          login: profile.login,
        });
      } catch {
        authProfileStorage.set({
          name: loginInput.value.trim(),
          email: '',
          login: loginInput.value.trim(),
        });
      }

      window.location.href = '../landing/index.html';
    } catch {
      if (errorEl) errorEl.textContent = 'Incorrect login or password';
    }
  };

  submitBtn?.addEventListener('zoo-click', () => {
    void submit();
  });

  syncSubmitState();
}
