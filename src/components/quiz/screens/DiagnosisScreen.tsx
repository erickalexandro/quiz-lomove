import { ShieldCheck } from "lucide-react";
import { PrimaryButton } from "@/components/quiz/QuizChrome";
import { WhatsAppPlayer } from "@/components/quiz/WhatsAppPlayer";
import type { Diagnosis } from "@/quiz/diagnosis";
import drElias from "@/assets/dr-elias.jpg";
import musculoInvisivelAsset from "@/assets/quiz/diagnosis/iliopsoas.webp";
import { cn } from "@/lib/utils";

interface Props {
  diagnosis: Diagnosis;
  name: string;
  onAccept: () => void;

  onDoubts: () => void;
  answers?: Record<string, any>;
}

/** Etapa 22 — Diagnóstico personalizado. Replicação fiel do design final lomove-diagnostico.html. */
export function DiagnosisScreen({ diagnosis, name, onAccept }: Props) {
  const greeting = name || "Você";
  const muscle = diagnosis.muscle || "Iliopsoas";
  const score = diagnosis.score; // Agora usa o score dinâmico calculado pelo motor de diagnóstico

  return (
    <div className="w-full max-w-[420px] mx-auto text-left font-sans text-foreground">
      {/* 1. HERO: alerta + nível (única caixa colorida) */}
      <section className="bg-destructive/5 rounded-[20px] p-[26px_22px] mb-11 border border-destructive/10">
        <div className="flex items-start gap-3 mb-[22px]">
          <div className="flex-shrink-0 w-[34px] h-[34px] rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-[19px] font-extrabold">
            !
          </div>
          <p className="m-0 mt-1 text-[18px] font-bold leading-[1.4] text-foreground">
            <strong className="text-destructive">{greeting.toUpperCase()}</strong>, pelas suas respostas o músculo encurtado que está causando suas dores é o <span className="text-destructive">Iliopsoas</span>, e seu nível de comprometimento está em <span className="text-destructive">estado de alerta</span>.
          </p>
        </div>

        <div className="flex justify-between items-baseline mb-2.5">
          <span className="text-[13px] font-bold tracking-[0.04em] uppercase text-muted-foreground">
            Nível de comprometimento
          </span>
          <span className="text-[30px] font-extrabold text-destructive leading-none">
            {score}%
          </span>
        </div>
        <div className="relative h-[14px] rounded-[7px] bg-[linear-gradient(90deg,#6FAF5C_0%,#D9C24C_25%,#E8A23F_50%,#E63946_75%,#8B0000_100%)]">
          <div 
            className="absolute top-[-5px] w-1.5 h-6 rounded-sm bg-foreground"
            style={{ left: `${score}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {["Leve", "Moderado", "Alto", "Alerta", "Irreversível"].map((label) => (
            <span 
              key={label}
              className={cn(
                "text-[11px] font-bold tracking-[0.01em] text-muted-foreground",
                (label === "Alerta" && score >= 70) && "text-destructive underline decoration-accent decoration-2"
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* 2. Áudio + 3. Imagem anatômica (flui no fundo) */}
      <section className="mb-11">
        <h2 className="m-0 mb-[22px] text-[22px] font-extrabold leading-[1.3] text-foreground font-display text-center">
          Ouça seu diagnóstico personalizado feito pelo Dr. Elias&nbsp;
        </h2>

        <WhatsAppPlayer 
          avatar={drElias} 
          name="Dr. Elias" 
          duration={120} 
          onPlayStateChange={() => {}}
          isPlaying={true}
        />
        <p className="m-0 mt-2.5 text-[13px] text-[#5C5648] text-center">
          Toque no play para ouvir seu diagnóstico&nbsp;
        </p>

        <div className="mt-6 rounded-2xl overflow-hidden border border-[#ECE2CE] bg-white">
          <img 
            src={musculoInvisivelAsset.url} 
            alt={`Ilustração do ${muscle} encurtado`} 
            key={musculoInvisivelAsset.url}
            className="w-full h-auto block"
          />
        </div>
      </section>

      {/* 4. Título de evolução + 5. Texto do plano + gráfico */}
      <section className="mb-11">
        <h2 className="m-0 mb-[18px] text-[22px] font-extrabold text-foreground leading-[1.25] font-display">
          Como reverter esse quadro
        </h2>

        <p className="m-0 mb-[30px] text-[16px] leading-[1.55] text-foreground whitespace-pre-line">
          O Dr. Elias já criou o seu plano de alongamentos personalizados, com aulas demonstrativas dos exercicíos certos na ordem certa para desencurtar e fortalecer esse músculo.{"\n\n\n"}Fazendo esses exercícios que duram 10 minutos durante 28 dias, irá reverter esse quadro e acabar com as suas dores.
        </p>

        <div className="flex items-center gap-3.5 mb-[30px]">
          <div className="flex-1">
            <span className="block text-[13px] font-bold tracking-[0.06em] text-[#5C5648] uppercase mb-1">Hoje</span>
            <span className="block text-[22px] font-extrabold leading-[1.15] text-destructive">Dor forte</span>
          </div>
          <div className="text-[22px] text-[#5C5648] flex-shrink-0">→</div>
          <div className="flex-1">
            <span className="block text-[13px] font-bold tracking-[0.06em] text-[#5C5648] uppercase mb-1">Em 28 dias</span>
            <span className="block text-[22px] font-extrabold leading-[1.15] text-success">Dor leve</span>
          </div>
        </div>

        <svg className="w-full h-auto block" viewBox="0 0 380 210" xmlns="http://www.w3.org/2000/svg" role="img"
             aria-label="Gráfico mostrando a dor caindo de nível forte hoje para nível leve em 28 dias">
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor="var(--color-destructive)" />
              <stop offset="45%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-success)" />
            </linearGradient>
            <linearGradient id="irreversibleGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-destructive)" />
              <stop offset="100%" stopColor="var(--color-destructive)" />
            </linearGradient>
            <linearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity="0.05" />
              <stop offset="45%" stopColor="var(--color-accent)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Fundo com degradê leve */}
          <rect x="0" y="0" width="380" height="210" fill="url(#bgGradient)" rx="20" />

          <line x1="8" y1="182" x2="372" y2="182" stroke="var(--color-border)" strokeWidth="2" strokeDasharray="2 6" />
          <text x="8" y="26" fontSize="12" fontWeight="700" fill="var(--color-muted-foreground)" letterSpacing="0.03em">DOR FORTE</text>
          <text x="8" y="200" fontSize="12" fontWeight="700" fill="var(--color-muted-foreground)" letterSpacing="0.03em">SEM DOR</text>

          <path d="M30,60 C66.67,60 103.33,92 140,92 C176.67,92 213.33,135 250,135 C283.33,135 316.67,167 350,167"
                fill="none" stroke="url(#lineGradient)" strokeWidth="6" strokeLinecap="round" />
          
          <path d="M30,60 C50,60 70,68 90,75"
                fill="none" stroke="url(#irreversibleGradient)" strokeWidth="6" strokeLinecap="round" opacity="0.8" />

          <circle cx="30" cy="60" r="20" fill="var(--color-destructive)" opacity="0.16" />
          <circle cx="30" cy="60" r="8" fill="var(--color-destructive)" stroke="var(--color-background)" strokeWidth="3" />

          <circle cx="140" cy="92" r="6" fill="var(--color-accent)" stroke="var(--color-background)" strokeWidth="3" />
          <circle cx="250" cy="135" r="6" fill="var(--color-success)" stroke="var(--color-background)" strokeWidth="3" />

          <circle cx="350" cy="167" r="22" fill="var(--color-success)" opacity="0.16" />
          <circle cx="350" cy="167" r="9" fill="var(--color-success)" stroke="var(--color-background)" strokeWidth="3" />
          <path d="M345,167 l3,4 l7,-8" stroke="var(--color-background)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

          {/* Indicador VOCÊ movido para baixo da bolinha */}
          <line x1="30" y1="68" x2="30" y2="78" stroke="var(--color-foreground)" strokeWidth="2" opacity="0.35" />
          <rect x="4" y="78" width="52" height="28" rx="14" fill="var(--color-accent)" />
          <text x="30" y="97" fontSize="15" fontWeight="800" fill="var(--color-accent-foreground)" textAnchor="middle" letterSpacing="0.02em">VOCÊ</text>
        </svg>

        <div className="flex justify-between mt-1.5 px-1">
          <span className="text-[13px] font-bold text-[#5C5648]">Hoje</span>
          <span className="text-[13px] font-bold text-[#5C5648]">Semana 2</span>
          <span className="text-[13px] font-bold text-[#5C5648]">Semana 3</span>
          <span className="text-[13px] font-bold text-success">28 dias</span>
        </div>

        <p className="m-0 mt-5 text-[13px] leading-[1.5] text-[#5C5648]">
          *Estimativa baseada Padrão de encurtamento muscular e no nível de dor relatado ({score}%).
        </p>
      </section>

      {/* 6. CTA final */}
      <section className="text-center">
        <h2 className="m-0 mb-6 text-[22px] font-extrabold leading-[1.35] text-foreground font-display">
          Você está pronto para acessar seu plano de alongamentos personalizado?
        </h2>
        <PrimaryButton
          className="w-full p-[18px] bg-primary hover:bg-primary/90 text-primary-foreground text-[17px] font-extrabold tracking-[0.01em] rounded-2xl h-auto min-h-[60px]"
          onClick={() => {
            console.log("Diagnosis accepted, calling onAccept");
            onAccept();
          }}
        >
          SIM! Acessar meu plano
        </PrimaryButton>

        <p className="m-0 mt-3.5 flex items-center justify-center gap-1 text-[13px] font-semibold text-[#5C5648]">
          <ShieldCheck className="size-4 text-success" />
          Diagnóstico gratuito · Acesso imediato
        </p>
      </section>
    </div>
  );
}
