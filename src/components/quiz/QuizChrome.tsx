import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/Logo_horizontal_preta.png";


interface ProgressHeaderProps {
  percent: number;
  stepLabel: string;
  onBack?: (() => void) | undefined;
  canGoBack: boolean;
}

/** Cabeçalho fixo com barra de progresso — visível em todas as etapas. */
export function ProgressHeader({
  percent,
  stepLabel,
  onBack,
  canGoBack,
}: ProgressHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur flex flex-col items-center">
      <div className="pt-4 pb-2 w-full max-w-xl relative flex justify-center items-center">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Voltar para a etapa anterior"
            className="absolute left-4 p-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
        )}
        {logoAsset?.url && <img src={logoAsset.url} alt="Lomove" className="h-8 w-auto" />}
      </div>

      {percent > 0 && (
        <div className="mx-auto flex w-full max-w-xl items-center px-4 pb-4">
          <div className="flex flex-1 flex-col gap-1.5 pt-2">
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-secondary"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso do diagnóstico"
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/** Badge de feedback empático (💡) — reforça que a pessoa está sendo ouvida. */
export function InsightBadge({
  children,
  icon = "💡",
  className,
}: {
  children: ReactNode;
  icon?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 flex gap-3 rounded-2xl border border-insight-border bg-insight px-4 py-4 duration-500",
        className,
      )}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        {icon}
      </span>
      <p className="text-base leading-relaxed font-medium text-insight-foreground sm:text-lg text-left">
        {children}
      </p>
    </div>
  );
}

/** Área de conteúdo padrão de cada etapa, com animação de entrada. */
export function StepShell({
  children,
  stepKey,
  className,
}: {
  children: ReactNode;
  stepKey: string;
  className?: string | undefined;
}) {
  return (
    <main
      key={stepKey}
      className={cn(
        "mx-auto w-full max-w-xl px-4 pt-6 pb-16 transition-all duration-300 flex flex-col items-center min-h-[calc(100vh-64px)]",
        className,
      )}
    >
      {children}
    </main>
  );
}

/** Título da pergunta — tipografia grande e legível para o público-alvo. */
export function StepQuestion({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string | undefined;
}) {
  return (
    <div className="mb-6 flex flex-col items-center">
      <h2 className="font-display text-2xl font-bold leading-tight text-center text-foreground sm:text-3xl">
        {children}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-lg text-muted-foreground text-center">{subtitle}</p>
      ) : null}
    </div>
  );
}

/** Botão de opção: alvo de toque grande, estado selecionado bem evidente. */
export function OptionButton({
  selected,
  emoji,
  image,
  label,
  hint,
  onClick,
  multi = false,
}: {
  selected: boolean;
  emoji?: string | undefined;
  image?: string | undefined;
  label: string;
  hint?: string | undefined;
  onClick: () => void;
  multi?: boolean | undefined;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-4 rounded-2xl border-2 bg-card px-4 py-4 text-left transition-all",
        "min-h-[68px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        "active:scale-[0.99]",
        selected
          ? "border-[3px] border-primary bg-accent/5 text-foreground shadow-sm"
          : "border-border hover:border-primary/50 hover:bg-secondary/40",
      )}
    >
      {image ? (
        <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          <img src={image} alt="" key={image} onError={(e) => {
            console.error("Image failed to load:", image);
            // Tentativa de fallback se for um path relativo simples que o Vite pode não estar resolvendo
            if (!image.startsWith('/') && !image.startsWith('http')) {
              (e.target as HTMLImageElement).src = `/src/assets/${image}`;
            }
          }} className="h-full w-full object-cover" />
        </div>
      ) : emoji ? (
        <span aria-hidden="true" className="text-2xl leading-none">
          {emoji}
        </span>
      ) : null}

      <span className="flex-1">
        <span className={cn("block text-lg font-bold leading-snug", "text-foreground")}>
          {label}
        </span>
        {hint ? (
          <span className={cn("mt-0.5 block text-base", selected ? "text-muted-foreground" : "text-muted-foreground")}>{hint}</span>
        ) : null}
      </span>

      {!multi && (
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground/50 transition-colors group-hover:border-primary/30 group-hover:text-primary/50"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-4">
            <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}

      {multi ? (
        <span
          aria-hidden="true"
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
            selected ? "border-primary bg-primary" : "border-input bg-background",
          )}
        >
          {selected ? (
            <svg viewBox="0 0 20 20" className="size-4 fill-primary-foreground">
              <path d="M7.6 14.2 3.8 10.4l1.4-1.4 2.4 2.4 6-6 1.4 1.4z" />
            </svg>
          ) : null}
        </span>
      ) : null}
    </button>
  );
}

/** CTA principal — grande, com rótulo sempre explícito sobre o próximo passo. */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  disabled?: boolean | undefined;
  type?: "button" | "submit" | undefined;
  className?: string | undefined;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-primary-foreground shadow-sm transition-all",
        "hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      {String(children).toUpperCase() === "QUERO COMEÇAR AGORA" ? "COMEÇAR AGORA" : children}
    </button>
  );
}
