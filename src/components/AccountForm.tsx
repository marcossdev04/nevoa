"use client";

import { useState } from "react";

/** Login mockado: ainda não existe autenticação. Ligar ao backend aqui. */
export function AccountForm() {
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [sent, setSent] = useState(false);

  return (
    <form
      className="mt-10 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {mode === "criar" && (
        <label className="block">
          <span className="mb-2 block text-xs text-cream/90">Nome completo</span>
          <input className="field" required autoComplete="name" />
        </label>
      )}
      <label className="block">
        <span className="mb-2 block text-xs text-cream/90">E-mail</span>
        <input className="field" type="email" required autoComplete="email" />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs text-cream/90">Senha</span>
        <input className="field" type="password" required minLength={6} autoComplete={mode === "entrar" ? "current-password" : "new-password"} />
      </label>

      <button className="btn btn-primary !mt-7 w-full">{mode === "entrar" ? "Entrar" : "Criar conta"}</button>

      <p aria-live="polite" className="min-h-5 text-center text-sm text-cream">
        {sent && "Contas ainda não estão disponíveis nesta versão de demonstração."}
      </p>

      <p className="text-center text-sm text-cream/85">
        {mode === "entrar" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <button
          type="button"
          className="link-underline text-cream"
          onClick={() => {
            setMode(mode === "entrar" ? "criar" : "entrar");
            setSent(false);
          }}
        >
          {mode === "entrar" ? "Criar conta" : "Entrar"}
        </button>
      </p>
    </form>
  );
}
