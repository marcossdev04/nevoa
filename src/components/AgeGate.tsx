"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Ornament } from "@/components/ui";

const KEY = "nevoa:maior-de-idade";

/** Verificação de idade exigida para a venda de artigos de tabacaria. */
export function AgeGate() {
  const [state, setState] = useState<"checking" | "ask" | "denied" | "ok">("checking");

  useEffect(() => {
    let ok = false;
    try {
      ok = localStorage.getItem(KEY) === "sim";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do storage
    setState(ok ? "ok" : "ask");
  }, []);

  useEffect(() => {
    if (state !== "ask" && state !== "denied") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  const confirm = () => {
    try {
      localStorage.setItem(KEY, "sim");
    } catch {}
    setState("ok");
  };

  return (
    <AnimatePresence>
      {(state === "ask" || state === "denied") && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-title"
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-brown-deep/95 p-4 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="label-frame w-full max-w-md bg-brown px-8 py-12 text-center"
          >
            <p className="eyebrow text-sky">Tabacaria fina</p>
            <p className="mt-1 font-script text-7xl leading-none text-cream">Névoa</p>
            <Ornament className="my-6" />
            {state === "ask" ? (
              <>
                <h2 id="age-title" className="font-display text-2xl text-cream">
                  Você tem 18 anos ou mais?
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream-soft/70">
                  Esta loja vende artigos de tabacaria, destinados exclusivamente a adultos.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button onClick={confirm} className="btn btn-primary">
                    Sim, tenho 18+
                  </button>
                  <button onClick={() => setState("denied")} className="btn btn-ghost">
                    Não
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 id="age-title" className="font-display text-2xl text-cream">
                  Volte quando tiver 18
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-cream-soft/70">
                  A venda de produtos de tabacaria é proibida para menores de idade.
                </p>
                <button onClick={() => setState("ask")} className="eyebrow mt-8 text-cream-soft/60 hover:text-cream">
                  Respondi errado
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
