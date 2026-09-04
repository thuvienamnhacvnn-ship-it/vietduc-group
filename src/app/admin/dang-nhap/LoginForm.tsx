"use client";

import { useActionState } from "react";
import { signIn } from "../actions";
import styles from "../admin.module.css";

/**
 * Sign-in for the editor area. The action returns one message for every
 * failure, so the form cannot be used to discover which addresses exist.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, undefined);

  return (
    <form className={styles.login} action={formAction}>
      <h1>Đăng nhập quản trị</h1>
      <p>Khu vực dành cho biên tập viên và cán bộ tuyển sinh Việt Đức Group.</p>

      {state?.error ? (
        <p className={styles.loginError} role="alert">
          {state.error}
        </p>
      ) : null}

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required autoComplete="username" />

      <label htmlFor="password">Mật khẩu</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />

      <button type="submit" className={styles.loginButton} disabled={pending}>
        {pending ? "Đang kiểm tra…" : "Đăng nhập"}
      </button>
    </form>
  );
}
