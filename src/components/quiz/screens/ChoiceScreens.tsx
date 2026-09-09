import { useEffect, useState, useMemo } from "react";
import antesDepoisAsset from "@/assets/antesxdepois.webp";
import {
  InsightBadge,
  OptionButton,
  PrimaryButton,
  StepQuestion,
} from "@/components/quiz/QuizChrome";
import { BodyMap } from "@/components/quiz/BodyMap";
import type { BodyMapStep, MultiChoiceStep, SingleChoiceStep } from "@/quiz/types";

/** Tempo que o badge de feedback fica na tela antes de avançar (ms). */
const BADGE_DWELL_MS = 2200;
const AUTO_ADVANCE_MS = 320;

interface SingleProps {
  step: SingleChoiceStep;
  value?: string | undefined;
  prevAnswerBadge?: string | null;
  onAnswer: (value: string) => void;
  onNext: () => void;
  isFirstStep?: boolean;
  /** Pergunta e opções da etapa seguinte para exibir na tela de abertura. */
  mergedQuestion?: string;
  mergedOptions?: SingleChoiceStep["options"];
}

/**
 * Escolha única com avanço automático.
 * Removido o badge de feedback visual para permitir transição imediata conforme solicitado.
 */
export function SingleChoiceScreen({ step, value, prevAnswerBadge, onAnswer, onNext, isFirstStep, mergedQuestion, mergedOptions }: SingleProps) {
  const [selected, setSelected] = useState<string | undefined>(value);
  const [pending, setPending] = useState<string | null>(null);
  
  const displayQuestion = isFirstStep && mergedQuestion ? mergedQuestion : step.question;
  const displayOptions = isFirstStep && mergedOptions ? mergedOptions : step.options;
  
  return (
    <div className="flex flex-col items-center">
      {isFirstStep && (
        <div className="mb-4 flex flex-col items-center text-center">
          <h1 className="font-display text-3xl leading-tight font-bold text-balance text-foreground sm:text-4xl">
            Descubra em 2 minutos qual é o músculo invisível que está causando a sua dor
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Ao finalizar o diagnóstico você recebe um plano de alongamentos personalizado para acabar com sua dor em até 28 dias
          </p>
          <img
            src={antesDepoisAsset.url}
            alt="Hoje vs Daqui 28 dias - Transformação Lomove"
            key={antesDepoisAsset.url}
            loading="eager"
            fetchPriority="high"
            className="mt-6 mb-4 w-full rounded-3xl object-cover"
          />
          <div className="mb-4 flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-sm font-bold flex items-center gap-1.5">
                📊 Mais de 8.700 diagnósticos gerados essa semana
              </span>
            </div>
          </div>
        </div>
      )}

      {prevAnswerBadge && step.id !== "resultado" && step.id !== "tempo" ? (
        <InsightBadge className="mb-6" icon="🔍">
          {prevAnswerBadge}
        </InsightBadge>
      ) : null}
      
      {isFirstStep ? null : (
        <>
          {step.openingBadge ? (
            <InsightBadge className="mb-6">{step.openingBadge}</InsightBadge>
          ) : null}

          <div className="text-center w-full">
            <StepQuestion subtitle={step.subtitle}>{step.question}</StepQuestion>
          </div>
        </>
      )}

      <div className="flex flex-col gap-3 w-full">
        {isFirstStep ? (
          <div className="mt-4">
            {mergedQuestion ? (
              <>
                <div className="text-center w-full mb-5">
                  <StepQuestion>{displayQuestion}</StepQuestion>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  {displayOptions.map((option) => (
                    <OptionButton
                      key={option.value}
                      selected={selected === option.value}
                      label={option.label}
                      onClick={() => {
                        setSelected(option.value);
                        setPending(option.value);
                        onAnswer(option.value);
                        onNext();
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 flex justify-center px-4">
                  <div className="rounded-full bg-destructive/5 border border-destructive/10 px-4 py-2 flex items-center gap-2">
                    <p className="text-[12px] text-destructive font-bold text-center leading-tight">
                      ⚠️ Limite de 1 diagnóstico por pessoa. Ao sair todo o progresso será perdido.
                    </p>
                  </div>
                </div>
                <PrimaryButton
                  onClick={() => {
                    onNext();
                  }}
                >
                  Começar diagnóstico gratuito
                </PrimaryButton>
              </>
            )}
          </div>
        ) : (
          displayOptions.map((option) => (
            <OptionButton
              key={option.value}
              selected={selected === option.value}
              emoji={option.emoji}
              image={option.image}
              label={option.label}
              hint={option.hint}
              onClick={() => {
                setSelected(option.value);
                setPending(option.value);
                onAnswer(option.value);
                onNext();
              }}
            />
          ))
        )}
      </div>
      {/* Feedback badge removed to allow immediate transition as per user request */}
    </div>
  );
}

interface MultiProps {
  step: MultiChoiceStep;
  value?: string[] | undefined;
  prevAnswerBadge?: string | null;
  onAnswer: (value: string[]) => void;
  onNext: () => void;
  showBodyMap?: boolean;
}

/** Múltipla escolha: confirma com "Continuar" e avança imediatamente. */
export function MultiChoiceScreen({ step, value, prevAnswerBadge, onAnswer, onNext, showBodyMap }: MultiProps) {
  const [selected, setSelected] = useState<string[]>(value ?? []);

  useEffect(() => {
    setSelected(value ?? []);
  }, [step.id, value]);

  const toggle = (optionValue: string) => {
    setSelected((current) =>
      current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue],
    );
  };

  const confirm = () => {
    onAnswer(selected);
    onNext();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {prevAnswerBadge && step.id !== "resultado" ? (
        <InsightBadge className="mb-6" icon="🔍">
          {prevAnswerBadge}
        </InsightBadge>
      ) : null}

      <div className="text-center w-full">
        <StepQuestion subtitle={step.subtitle}>{step.question}</StepQuestion>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {step.options.map((option) => (
          <OptionButton
            key={option.value}
            multi
            selected={selected.includes(option.value)}
            emoji={option.emoji}
            image={option.image}
            label={option.label}
            onClick={() => toggle(option.value)}
          />
        ))}
      </div>

      <div className="mt-8">
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/80 p-4 backdrop-blur-md sm:relative sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-none">
          <div className="mx-auto max-w-xl">
            <PrimaryButton onClick={confirm} disabled={selected.length === 0}>
              Continuar
            </PrimaryButton>
          </div>
        </div>
        {/* Spacer to prevent content from being hidden behind the fixed button on mobile */}
        <div className="h-24 sm:hidden" />
      </div>
    </div>
  );
}

interface BodyMapProps {
  step: BodyMapStep;
  value?: string | undefined;
  onAnswer: (value: string) => void;
  onNext: () => void;
}

/** Etapa 3: mapa corporal clicável + lista equivalente (à prova de erro). */
export function BodyMapScreen({ step, value, onAnswer, onNext }: BodyMapProps) {
  const [selected, setSelected] = useState<string | undefined>(value);

  const choose = (optionValue: string) => {
    setSelected(optionValue);
    onAnswer(optionValue);
    onNext();
  };

  return (
    <>
      <div className="text-center w-full">
        <StepQuestion subtitle={step.subtitle}>{step.question}</StepQuestion>
      </div>

      <BodyMap value={selected} onSelect={choose} />

      <div className="flex flex-col gap-3">
        {step.options.map((option) => (
          <OptionButton
            key={option.value}
            selected={selected === option.value}
            label={option.label}
            onClick={() => choose(option.value)}
          />
        ))}
      </div>
    </>
  );
}
