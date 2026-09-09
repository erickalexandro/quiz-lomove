import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, Mic, Pause, Play } from "lucide-react";
import {
  InsightBadge,
  PrimaryButton,
  StepQuestion,
} from "@/components/quiz/QuizChrome";
import { WhatsAppPlayer } from "@/components/quiz/WhatsAppPlayer";
import type { NameStep } from "@/quiz/types";
import heroImage from "@/assets/hero-alongamento.jpg";
import drElias from "@/assets/dr-elias.jpg";
import mecanismo from "@/assets/mecanismo-musculo.jpg";
import loadingTestimonialOne from "@/assets/etapa-loading-1.webp";
import loadingTestimonialTwo from "@/assets/etapa-loading-2.webp";
import loadingTestimonialThree from "@/assets/etapa-loading-3.webp";

const LOADING_TESTIMONIAL_IMAGES = [
  loadingTestimonialOne.url,
  loadingTestimonialTwo.url,
  loadingTestimonialThree.url,
] as const;

// IntroScreen movida para ser renderizada condicionalmente na SingleChoiceScreen (etapa 1)

const AUDIO_SCRIPT = [
  "Eu sou o Dr. Elias, fisioterapeuta especializado em dores crônicas, e estou aqui pra te ajudar a descobrir o seu músculo invisível — a causa raiz das suas dores — e te guiar num plano pra eliminar essa dor de vez, sem depender de remédio todo dia.",
  "Tudo isso através de um protocolo personalizado de alongamentos que atuam exatamente no músculo fraco e encurtado que está puxando sua coluna pro lugar errado.",
  "Você pode estar se perguntando: por que responder essas perguntas antes de receber o plano? A resposta é simples — esse diagnóstico vai mostrar, de forma detalhada, qual padrão muscular está por trás da sua dor. E com isso, eu consigo te entregar um plano realmente eficaz pro seu caso.",
  "Essas perguntas vão traçar o mapa da sua coluna, e é a partir desse mapa que vou montar o seu plano de 28 dias pra desencurtar e fortalecer os músculos certos.",
  'Então clica em Continuar e vamos descobrir agora a combinação certa de alongamentos pra tratar a causa raiz da sua dor.',
];

/** URL do áudio real do Dr. Elias na etapa de nível de consciência. */
export const INTRO_AUDIO = "/audios/dr-elias-intro.mp3";
const NIVEL_CONSCIENCIA_AUDIO = "/audios/dr-elias-nivel-consciencia.mp3";
const MECANISMO_AUDIO = "/audios/dr-elias-mecanismo.mp3";

/**
 * Etapa 5 — Tranquilização + áudio do expert.
 * O player é um placeholder visual (sem arquivo de áudio ainda): simula a
 * reprodução e exibe o roteiro em texto, para não bloquear o fluxo.
 */
export function AudioScreen({ 
  step,
  onNext,
  prevAnswerBadge,
  answers = {}
}: { 
  step: any; // Type-check flexível para simplificar a injeção do objeto completo
  onNext: () => void;
  prevAnswerBadge?: string | null;
  answers?: Record<string, any>;
}) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const total = 68; // duração estimada do recado, em segundos
  const [canContinue, setCanContinue] = useState(true); // "deixe normal por enquanto" (true por padrão)

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setElapsed((current) => {
        if (current >= total) {
          setPlaying(false);
          return total;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing]);

  const percent = Math.round((elapsed / total) * 100);
  // Simular ondas de áudio do WhatsApp (tamanhos variados)
  const bars = useMemo(
    () => [
      20, 45, 30, 60, 25, 50, 35, 70, 40, 55, 30, 65, 20, 45, 30, 60, 25, 50, 35, 70, 40, 55, 30, 65, 20, 45, 30, 60, 25, 50, 35, 70, 40, 55
    ],
    [],
  );

  const rawAgeRange = (answers["idade"] as string) || "";
  const ageRange = rawAgeRange.includes("-") 
    ? rawAgeRange.split("-")[0] 
    : rawAgeRange.replace("+", "");
  
  const ageDisplay = ageRange ? `${ageRange} anos` : "(idade)";

  const painLocation = "descobriram a causa raiz das suas dores";

  return (
    <div className="flex flex-col items-center w-full">
      {prevAnswerBadge ? (
        <InsightBadge className="mb-6 w-full" icon="🔍">
          {prevAnswerBadge}
        </InsightBadge>
      ) : null}

      <h1 className="font-display text-2xl leading-snug font-bold text-balance text-foreground sm:text-3xl text-center">
        Mais de 12.500 pessoas na faixa dos {ageDisplay} {painLocation} através desse diagnóstico
      </h1>
      <p className="mt-3 text-lg text-muted-foreground mb-6">
        Ouça um recado rápido do Dr. Elias antes de continuar 🎧
      </p>

      <WhatsAppPlayer 
        avatar={drElias} 
        name="Dr. Elias" 
        duration={total}
        onPlayStateChange={setPlaying}
        isPlaying={playing}
        audioSrc={NIVEL_CONSCIENCIA_AUDIO}
        key={`nivel-${NIVEL_CONSCIENCIA_AUDIO}`}
      />
      {step.script && (
        <details className="mt-4 rounded-2xl border border-border bg-card px-4 py-3">
          <summary className="cursor-pointer text-base font-semibold text-foreground">
            Prefere ler o recado?
          </summary>
          <div className="mt-3 flex flex-col gap-3">
            {step.script.map((paragraph: string) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </details>
      )}

      <div className="mt-8">
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/80 p-4 backdrop-blur-md sm:relative sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-none">
          <div className="mx-auto max-w-xl">
            <PrimaryButton onClick={onNext} disabled={!canContinue}>
              Continuar
            </PrimaryButton>
          </div>
        </div>
        <div className="h-24 sm:hidden" />
      </div>
    </div>
  );
}

/** Etapa de áudio puro com imagem e botão continuar. */
export function AudioOnlyScreen({ step, onNext }: { step: any; onNext: () => void }) {
  const [playing, setPlaying] = useState(false);
  const total = 45; // Duração estimada

  // Carregar imagem dinamicamente se fornecida no step
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (step.image) {
      if (step.image.includes('.asset.json')) {
        import(/* @vite-ignore */ step.image).then(module => {
          setImageSrc(module.default.url);
        }).catch(err => {
          console.error("Erro ao carregar imagem do step:", err);
        });
      } else {
        setImageSrc(step.image);
      }
    }
  }, [step.image]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full mb-6 text-center flex flex-col items-center">
        <p className="text-lg font-bold text-foreground mb-4 text-center">
          Ouça o recado do Dr. Elias 👇
        </p>
        
        <WhatsAppPlayer 
          avatar={drElias} 
          name="Dr. Elias" 
          duration={total}
          onPlayStateChange={setPlaying}
          isPlaying={true}
          key={drElias}
        />

        {imageSrc && (
          <img 
            src={imageSrc} 
            alt="Ciclo da causa raiz" 
            key={imageSrc}
            className="mt-6 mb-6 w-full rounded-3xl border border-border bg-card object-contain shadow-sm"
          />
        )}
      </div>

      <div className="mt-8 w-full">
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/80 p-4 backdrop-blur-md sm:relative sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-none">
          <div className="mx-auto max-w-xl">
            <PrimaryButton onClick={onNext}>
              Continuar
            </PrimaryButton>
          </div>
        </div>
        <div className="h-24 sm:hidden" />
      </div>
    </div>
  );
}

/** Etapa 19 — Nome. */
export function NameScreen({
  step,
  value,
  onAnswer,
  onNext,
}: {
  step: NameStep;
  value?: string | undefined;
  onAnswer: (value: string) => void;
  onNext: () => void;
}) {
  const [name, setName] = useState(value ?? "");
  const trimmed = name.trim();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (trimmed.length < 2) return;
        onAnswer(trimmed);
        onNext();
      }}
    >
      <StepQuestion>{step.question}</StepQuestion>

      <label htmlFor="primeiro-nome" className="sr-only">
        Primeiro nome
      </label>
      <input
        id="primeiro-nome"
        type="text"
        autoComplete="given-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={step.placeholder}
        maxLength={40}
        className="w-full rounded-2xl border-2 border-input bg-card px-5 py-5 text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      />
      <p className="mt-3 text-base text-muted-foreground">{step.helper}</p>

      <div className="mt-8">
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/80 p-4 backdrop-blur-md sm:relative sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-none">
          <div className="mx-auto max-w-xl">
            <PrimaryButton type="submit" disabled={trimmed.length < 2}>
              Ver meu diagnóstico
            </PrimaryButton>
          </div>
        </div>
        <div className="h-24 sm:hidden" />
      </div>
    </form>
  );
}

/** Etapa de Entrada Numérica (Altura/Peso). */
export function NumericScreen({
  step,
  value,
  onAnswer,
  onNext,
}: {
  step: any;
  value?: string | undefined;
  onAnswer: (value: string) => void;
  onNext: () => void;
}) {
  const [inputValue, setInputValue] = useState(value ?? "");

  const handleNext = () => {
    if (!inputValue) return;
    onAnswer(inputValue);
    onNext();
  };

  return (
    <div className="flex flex-col items-center w-full">
      <StepQuestion subtitle={step.subtitle}>{step.question}</StepQuestion>

      <div className="relative w-full max-w-xs mt-4">
        <input
          type="number"
          inputMode="numeric"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={step.placeholder}
          className="w-full rounded-2xl border-2 border-input bg-card px-5 py-6 text-2xl font-bold text-center text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none transition-all"
        />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
          {step.unit}
        </span>
      </div>

      <div className="mt-12 w-full">
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/80 p-4 backdrop-blur-md sm:relative sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-none">
          <div className="mx-auto max-w-xl">
            <PrimaryButton onClick={handleNext} disabled={!inputValue}>
              Continuar
            </PrimaryButton>
          </div>
        </div>
        <div className="h-24 sm:hidden" />
      </div>
    </div>
  );
}

/** Etapa 20 — Mecanismo + segundo SIM. */

export function MechanismScreen({
  step,
  name,
  onNext,
}: {
  step: any;
  name: string;
  onNext: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (step.image) {
      if (step.image.includes('.asset.json')) {
        import(/* @vite-ignore */ step.image).then(module => {
          setImageSrc(module.default.url);
        }).catch(err => {
          console.error("Erro ao carregar imagem do step:", err);
        });
      } else {
        setImageSrc(step.image);
      }
    }
  }, [step.image]);

  return (
    <div className="flex flex-col items-center w-full">
      {step.showAudio && (
        <div className="w-full mb-6 flex flex-col items-center">
          <p className="text-lg font-bold text-foreground mb-4 text-center">
            É por isso que nada funcionou até agora 👇
          </p>
          <WhatsAppPlayer 
            avatar={drElias} 
            name="Dr. Elias" 
            duration={45}
            onPlayStateChange={() => {}}
            isPlaying={true}
            audioSrc={MECANISMO_AUDIO}
            key={`mecanismo-${MECANISMO_AUDIO}`}
          />
        </div>
      )}

      {imageSrc && (
        <img 
          src={imageSrc} 
          alt="Ciclo da causa raiz" 
          key={imageSrc}
          className="my-6 w-full rounded-3xl border border-border bg-card object-contain shadow-sm"
        />
      )}

      <h2 className="font-display mt-8 text-xl leading-snug font-bold text-foreground sm:text-2xl text-center">
        {name ? `${name}, quer` : "Quer"} descobrir qual é o seu músculo invisível e ver seu
        plano personalizado?
      </h2>

      <div className="mt-8 w-full">
        <PrimaryButton onClick={onNext}>
          ✅ Sim, quero ver meu diagnóstico
        </PrimaryButton>
      </div>
    </div>
  );
}

/** Etapa 21 — Loading de Compromisso com Carrossel de Depoimentos. */
export function CommitmentLoadingScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const [percent, setPercent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const duration = 20000; // 20 segundos conforme solicitado
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const started = Date.now();
    const tick = setInterval(() => {
      const value = Math.min(100, ((Date.now() - started) / duration) * 100);
      setPercent(value);
      if (value >= 100) {
        clearInterval(tick);
        setShowQuestion(true);
      }
    }, 100);
    return () => clearInterval(tick);
  }, []);

  // Rolar para o fim quando a pergunta aparecer
  useEffect(() => {
    if (showQuestion) {
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [showQuestion]);

  // Carrossel simples com 10 segundos
  useEffect(() => {
    if (showQuestion || isDragging) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % LOADING_TESTIMONIAL_IMAGES.length);
    }, 10000);
    return () => clearInterval(slideInterval);
  }, [showQuestion, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const current = scrollRef.current;
    if (!current) return;
    setIsDragging(true);
    setStartX(e.pageX - current.offsetLeft);
    setScrollLeft(current.scrollLeft);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setCurrentSlide(newIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const current = scrollRef.current;
    if (!isDragging || !current) return;
    e.preventDefault();
    const x = e.pageX - current.offsetLeft;
    const walk = (x - startX);
    current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const current = scrollRef.current;
    if (!current || !e.touches[0]) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - current.offsetLeft);
    setScrollLeft(current.scrollLeft);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setCurrentSlide(newIndex);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const current = scrollRef.current;
    if (!isDragging || !current || !e.touches[0]) return;
    const x = e.touches[0].pageX - current.offsetLeft;
    const walk = (x - startX);
    current.scrollLeft = scrollLeft - walk;
  };

  // Sync scroll position
  useEffect(() => {
    if (!isDragging && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentSlide * scrollRef.current.offsetWidth,
        behavior: "smooth"
      });
    }
  }, [currentSlide, isDragging]);

  return (
    <div className="pt-8 text-center flex flex-col w-full">
      <h1 className="font-display text-2xl leading-snug font-bold text-foreground sm:text-3xl">
        Estamos gerando seu diagnóstico{name ? `, ${name}` : ""}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-md">
        Enquanto isso, deixa eu te mostrar o resultado que algumas pessoas que aplicaram o plano de alongamentos personalizados tiveram
      </p>

      <div
        className="mt-8 h-3 w-full overflow-hidden rounded-full bg-secondary max-w-md mx-auto"
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-linear"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="relative mt-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm mx-auto">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-y cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseLeave={() => setIsDragging(false)}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          {LOADING_TESTIMONIAL_IMAGES.map((image, index) => (
            <div key={image} className="w-full flex-shrink-0 snap-center p-3 sm:p-4">
              <img
                src={image}
                alt={`Depoimento de cliente ${index + 1}`}
                className="h-auto w-full rounded-2xl object-contain pointer-events-none"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 pb-4" aria-label="Depoimentos">
          {LOADING_TESTIMONIAL_IMAGES.map((image, index) => (
            <button
              key={image}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "size-2 rounded-full transition-all",
                index === currentSlide ? "bg-primary w-4" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {showQuestion && (
        <div className="animate-in fade-in slide-in-from-bottom-4 mt-12 w-full duration-700 fill-mode-both">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl mb-8">
            O que eles tem em comum é que todos se comprometeram a dedicar 10 minutos por dia à sua saúde. Você também se compromete?
          </h2>
          
          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-background/80 p-4 backdrop-blur-md sm:relative sm:mt-8 sm:border-none sm:bg-transparent sm:p-0 sm:backdrop-none" ref={endRef}>
            <div className="mx-auto max-w-xl">
              <PrimaryButton onClick={onDone}>
                Sim, me comprometo
              </PrimaryButton>
            </div>
          </div>
          <div className="h-24 sm:hidden" />
        </div>
      )}
    </div>
  );
}

/** Etapa 22 — Loading clássico (se necessário para outros fluxos). */
export function LoadingScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const [percent, setPercent] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const started = Date.now();
    const duration = 5000; // Loading mais rápido para a transição final
    const tick = setInterval(() => {
      const value = Math.min(100, ((Date.now() - started) / duration) * 100);
      setPercent(value);
      if (value >= 100) {
        clearInterval(tick);
        setTimeout(() => doneRef.current(), 500);
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="pt-8 text-center flex flex-col items-center">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Finalizando diagnóstico...
      </h1>
      <div className="mt-6 h-3 w-64 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200 ease-linear"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
