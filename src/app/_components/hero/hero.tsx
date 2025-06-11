"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    // For authentication, we'll use a server action
    router.push("/authentication");
  };

  return (
    <div className="bg-background relative isolate gap-10 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="bg-primary/10 text-primary ring-primary/10 rounded-full px-3 py-1 text-sm leading-6 font-semibold ring-1 ring-inset">
                Novidades
              </span>
              <span className="text-muted-foreground inline-flex items-center space-x-2 text-sm leading-6 font-medium">
                <span>Versão 1.0 lançada</span>
              </span>
            </a>
          </div>
          <h1 className="text-foreground mt-10 text-4xl font-bold tracking-tight sm:text-6xl">
            Gerencie sua clínica com facilidade
          </h1>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Otimize as operações da sua clínica com nosso sistema completo de
            gestão. Agende consultas, gerencie pacientes e controle o
            faturamento tudo em um só lugar.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" onClick={handleGetStarted}>
              Começar agora
            </Button>
          </div>
        </div>
        <div className="mx-auto my-4 mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="mx-4 max-w-3xl flex-none sm:mx-8 sm:max-w-5xl lg:max-w-none">
            <img
              src="/mockup-app.png"
              alt="Captura de tela do aplicativo"
              width={1920}
              height={1080}
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
