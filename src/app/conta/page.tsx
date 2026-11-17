import type { Metadata } from "next";
import { AccountForm } from "@/components/AccountForm";
import { Ornament } from "@/components/ui";

export const metadata: Metadata = { title: "Minha conta" };

export default function ContaPage() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-16">
      <div className="text-center">
        <p className="eyebrow text-cream">Minha conta</p>
        <h1 className="mt-3 font-display text-5xl text-cream">
          Bem-vindo <span className="font-script text-cream">de volta</span>
        </h1>
        <Ornament className="mt-6" />
      </div>
      <AccountForm />
    </div>
  );
}
