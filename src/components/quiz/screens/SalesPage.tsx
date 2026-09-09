import { ShieldCheck, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Star, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { PrimaryButton } from "@/components/quiz/QuizChrome";
import { WhatsAppPlayer } from "@/components/quiz/WhatsAppPlayer";
import { INTRO_AUDIO } from "./ContentScreens";
import drElias from "@/assets/dr-elias.jpg";
import guaranteeSealAsset from "@/assets/selo-garantia.png";
import mockupAsset from "@/assets/mockup_do_produto.png";
import testimonial1 from "@/assets/testimonial-1.webp";
import testimonial2 from "@/assets/testimonial-2.webp";
import testimonial3 from "@/assets/testimonial-3.webp";
import testimonial4 from "@/assets/testimonial-4.webp";
import testimonial5 from "@/assets/testimonial-5.webp";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#ECE2CE]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left font-bold text-foreground"
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="size-5 text-[#5C5648]" /> : <ChevronDown className="size-5 text-[#5C5648]" />}
      </button>
      {isOpen && (
        <div className="pb-4 text-[15px] leading-relaxed text-[#5C5648]">
          {answer}
        </div>
      )}
    </div>
  );
}

export function SalesPage({ name, diagnosis }: { name: string; diagnosis: any }) {
  const greeting = name || "Você";

  const onCheckout = () => {
    window.location.href = "https://pay.cakto.com.br/s4wgcmb_775702";
  };

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const testimonials = [
    testimonial1.url,
    testimonial2.url,
    testimonial3.url,
    testimonial4.url,
    testimonial5.url
  ];

  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [testimonials.length, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const current = scrollRef.current;
    if (!current) return;
    setIsDragging(true);
    setStartX(e.pageX - current.offsetLeft);
    setScrollLeft(current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Snap to closest slide
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setCurrentTestimonial(newIndex);
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
    setIsDragging(false);
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollRef.current.scrollLeft / slideWidth);
      setCurrentTestimonial(newIndex);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const current = scrollRef.current;
    if (!isDragging || !current || !e.touches[0]) return;
    const x = e.touches[0].pageX - current.offsetLeft;
    const walk = (x - startX);
    current.scrollLeft = scrollLeft - walk;
  };

  // Sync scroll position when currentTestimonial changes automatically
  useEffect(() => {
    if (!isDragging && scrollRef.current) {
      scrollRef.current.scrollTo({
        left: currentTestimonial * scrollRef.current.offsetWidth,
        behavior: "smooth"
      });
    }
  }, [currentTestimonial, isDragging]);

  return (
    <div className="w-full max-w-[420px] mx-auto text-center font-sans text-foreground bg-white pb-32">
      {/* O botão flutuante e seus elementos foram removidos conforme solicitado */}
      {/* SEÇÃO 1: ALERTA E CONEXÃO */}
      <section className="px-5 pt-8 pb-16">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-destructive/5 border border-destructive/10 px-4 py-2 flex items-center gap-2">
            <p className="text-[12px] text-destructive font-bold text-center leading-tight">
              ⚠️ Limite de 1 diagnóstico por pessoa. Ao sair você perde tudo.
            </p>
          </div>
        </div>

        <h2 className="text-[22px] font-extrabold text-foreground mb-8 text-center font-display leading-[1.3]">
          Escute o áudio do Dr. Elias e veja o que você vai receber:
        </h2>

        <div className="mb-12 flex justify-end">
          <div className="w-full max-w-sm">
            <WhatsAppPlayer
              avatar={drElias}
              name="Dr. Elias"
              duration={125}
              isPlaying={true}
              audioSrc={INTRO_AUDIO}
              key={`intro-${INTRO_AUDIO}`}
            />
          </div>
        </div>

        {/* CARROSSEL DE DEPOIMENTOS ABAIXO DO ÁUDIO */}
        <h2 className="text-[20px] font-bold text-foreground mb-6 text-center">
          Alguns depoimentos de quem aplicou o protocolo
        </h2>
        <div className="relative mb-16 border border-[#ECE2CE] rounded-[2rem] overflow-hidden bg-white shadow-sm">
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
            {testimonials.map((url, i) => (
              <div key={i} className="w-full flex-shrink-0 snap-center p-4">
                <img 
                  src={url} 
                  alt={`Depoimento ${i + 1}`}
                  className="w-full h-auto rounded-2xl object-contain shadow-sm pointer-events-none"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md text-foreground/50 hover:text-foreground z-10"
          >
            <ChevronLeft className="size-5" />
          </button>
          
          <button 
            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md text-foreground/50 hover:text-foreground z-10"
          >
            <ChevronRight className="size-5" />
          </button>
          
          <div className="flex justify-center gap-2 pb-4">
            {testimonials.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={cn(
                  "size-1.5 rounded-full transition-all",
                  i === currentTestimonial ? "bg-primary w-4" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* OFERTA IMEDIATA */}
        <div className="mb-12">
          <div className="rounded-2xl border-2 border-foreground overflow-hidden">
            <div className="bg-foreground text-background py-2.5 text-[14px] font-bold uppercase tracking-wide">
              Primeiro lote · 49% de desconto
            </div>
            <div className="flex items-center justify-center gap-4 bg-white px-4 py-5">
              <span className="text-[22px] font-black text-destructive line-through leading-none whitespace-nowrap">
                DE R$ 57,00
              </span>
              <div className="rounded-xl bg-muted px-4 py-2 text-center">
                <div className="text-[30px] font-black text-foreground leading-none">
                  <span className="text-[16px] align-top">R$</span>29
                </div>
                <div className="text-[11px] text-muted-foreground">à vista</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <p className="text-[14px] font-normal text-muted-foreground mb-1">
              Clique no botão e faça o pagamento para acessar seu plano de exercícios
            </p>

            <PrimaryButton 
              onClick={onCheckout}
              className="bg-primary hover:bg-primary/90 text-primary-foreground py-7 text-[18px] w-full font-black uppercase tracking-tight"
            >
              ACESSAR MEU PLANO AGORA
            </PrimaryButton>

            <div className="flex items-center justify-center gap-2 text-success font-bold text-[14px] pt-1">
              <MessageCircle className="size-4 fill-success/20" />
              <span>Acesso imediato via WhatsApp</span>
            </div>
          </div>
        </div>


        {/* FOTO DO PRODUTO E ENTREGÁVEIS */}
        <div className="mt-8 space-y-12">
          <div className="text-left">
            <h2 className="text-[22px] font-bold text-foreground mb-8 text-center">
              O que você vai ganhar:
            </h2>
            <div className="flex items-center justify-center mb-12">
              {mockupAsset?.url && (
                <img 
                  src={mockupAsset.url} 
                  alt="Mockup do Produto Lomove" 
                  className="w-full h-auto max-w-[340px] mx-auto"
                />
              )}
            </div>

            <div className="space-y-5 max-w-[320px] mx-auto">
              {[
                "Acesso ao app com exercícios simples e específicos para acabar com a sua dor em até 28 dias",
                "Ferramentas de alívio - uma lista de produtos selecionados pelo dr Elias para melhorar seu bem estar",
                "Suporte direto com o Dr Elias pelo Whatsapp",
                "Você poderá voltar a fazer o que ama sem incômodo e aproveitar cada momento importante que não volta mais"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 className="size-5 text-success shrink-0" />
                  <span className="text-[16px] font-bold text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: GARANTIA E FAQ */}
      <section className="px-5 py-16 bg-[#F9F9F9]">
        <div className="mb-12">
          <div className="inline-block text-[#EFAE3F] font-bold text-[14px] uppercase tracking-widest mb-4">
            SATISFAÇÃO GARANTIDA
          </div>
          <div className="flex justify-center mb-6">
            {guaranteeSealAsset?.url && (
              <img src={guaranteeSealAsset.url} alt="Garantia Blindada" className="w-32 h-32 object-contain" />
            )}
          </div>
          <h2 className="text-[24px] font-bold text-foreground mb-6">30 Dias de garantia</h2>
          <p className="text-[16px] leading-relaxed text-[#5C5648] max-w-[340px] mx-auto">
            Acreditamos tanto no nosso método, que se você testar o protocolo por 30 dias e não sentir a evolução, nós devolvemos 100% do seu dinheiro na hora e sem burocracia
          </p>
        </div>
        
        <div className="max-w-[360px] mx-auto">
          <div className="rounded-2xl border-2 border-foreground overflow-hidden bg-white">
            <div className="bg-foreground text-background py-2.5 text-[14px] font-bold uppercase tracking-wide">
              Primeiro lote · 49% de desconto
            </div>
            <div className="flex items-center justify-center gap-4 px-4 py-5">
              <span className="text-[20px] font-black text-destructive line-through leading-none whitespace-nowrap">
                DE R$ 57,00
              </span>
              <div className="rounded-xl bg-muted px-4 py-2 text-center">
                <div className="text-[30px] font-black text-foreground leading-none">
                  <span className="text-[16px] align-top">R$</span>29
                </div>
                <div className="text-[11px] text-muted-foreground">à vista</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <p className="text-[13px] font-normal text-muted-foreground">
              Clique no botão e faça o pagamento para acessar seu plano de exercícios
            </p>
            <PrimaryButton 
              onClick={onCheckout}
              className="bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-[18px] w-full font-black"
            >
              COMEÇAR AGORA
            </PrimaryButton>
            <div className="flex items-center justify-center gap-2 text-success font-bold text-[13px]">
              <MessageCircle className="size-4 fill-success/20" />
              <span>Acesso imediato via WhatsApp</span>
            </div>
          </div>
        </div>

      </section>

      {/* FAQ */}
      <section className="px-5 py-20 bg-white">
        <h2 className="text-[28px] font-black text-foreground mb-4 text-center font-display leading-tight">
          Perguntas Frequentes
        </h2>
        <p className="text-[15px] text-muted-foreground mb-12 text-center max-w-[300px] mx-auto">
          Tire suas dúvidas e veja por que o Lomove é diferente de tudo que você já tentou
        </p>
        
        <div className="space-y-2 text-left max-w-[360px] mx-auto">
          <FAQItem 
            question="Já tentei alongamento antes e não funcionou. Por que esse seria diferente?" 
            answer="Você fez alongamento genérico — o mesmo vídeo que qualquer pessoa faria. O diagnóstico identifica exatamente qual músculo está puxando a sua coluna, e o plano trabalha especificamente nele. Não é mais alongamento — é o alongamento certo, pro seu caso." 
            key="faq1"
          />
          <FAQItem 
            question="Já gastei dinheiro com remédio, fisioterapia, consulta... por que seria diferente dessa vez?" 
            answer="A maioria desses tratamentos trata o sintoma, não a causa. O seu dinheiro não foi desperdiçado — só faltava a peça que estava faltando: saber exatamente qual é o seu músculo-causa. É isso que o diagnóstico te entrega." 
            key="faq2"
          />
          <FAQItem 
            question="Não tenho tempo pra mais um compromisso na rotina." 
            answer="São 15 minutos por dia — o tempo que o seu café leva pra passar. Você prefere gastar 15 minutos por dia agora, ou continuar convivendo com essa dor pelos próximos 5, 10 anos?" 
            key="faq3"
          />
          <FAQItem 
            question="Tenho medo de piorar fazendo exercício sozinha, sem um fisioterapeuta do lado." 
            answer="Esse medo é normal. Por isso o plano não é um vídeo genérico — são aulas demonstrativas passo a passo, com movimentos leves e progressivos, pensados especificamente pra quem lida com dor crônica, não para atletas." 
            key="faq4"
          />
          <FAQItem 
            question="Minha dor é mais grave — hérnia de disco, já fiz cirurgia. Isso funciona?" 
            answer="O diagnóstico já leva em conta o seu tipo específico de dor, incluindo hérnia. O programa trabalha o fortalecimento muscular ao redor da coluna. Se você tem um laudo médico, o ideal é seguir o plano em conjunto com a orientação dele." 
            key="faq5"
          />
          <FAQItem 
            question="Não sou muito boa com tecnologia. Vou conseguir usar?" 
            answer="Fica tranquila — o aplicativo foi pensado pra ser simples, sem complicação. Você só precisa abrir, escolher o exercício do dia e seguir o vídeo. Não tem nada para configurar." 
            key="faq6"
          />
          <FAQItem 
            question="Quanto tempo até eu sentir alguma diferença?" 
            answer="A maioria sente os primeiros sinais de alívio entre 3 e 7 dias. A melhora mais consistente costuma acontecer entre 21 e 60 dias — por isso o plano é estruturado em ciclos de 28 dias." 
            key="faq7"
          />
          <FAQItem 
            question="Como eu sei que não vou gastar à toa de novo?" 
            answer="Você tem 30 dias de garantia. Se por qualquer motivo achar que não é pra você, é só mandar uma mensagem no WhatsApp pedindo o reembolso — devolvemos o valor na hora, sem burocracia." 
            key="faq8"
          />
          <FAQItem 
            question="Já tenho mais de 60 anos, ainda funciona pra mim?" 
            answer="Funciona — o plano é ajustado com base na sua idade e nível de atividade física. A causa da dor (músculo encurtado) não tem idade, e o alongamento certo funciona em qualquer fase da vida." 
            key="faq9"
          />
        </div>

        <div className="mt-20 max-w-[360px] mx-auto p-8 rounded-3xl bg-foreground text-background shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
          
          <h2 className="text-[20px] font-black leading-tight mb-6 relative z-10">
            Volte a viver bem e em paz por bem menos que uma pizza por mês
          </h2>

          <p className="text-[13px] font-normal text-background/60 mb-6 relative z-10">
            Clique no botão e faça o pagamento para acessar seu plano de exercícios
          </p>

          <PrimaryButton 
            onClick={onCheckout}
            className="bg-accent hover:bg-accent/90 text-black py-7 text-[18px] w-full font-black uppercase relative z-10 border-b-4 border-accent/50 shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:border-b-0"
          >
            Acessar meu plano
          </PrimaryButton>

          <div className="flex items-center justify-center gap-2 text-primary font-bold text-[14px] mt-6 relative z-10">
            <MessageCircle className="size-4 fill-primary/20" />
            <span>Acesso imediato via WhatsApp</span>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 opacity-40 relative z-10">
            <ShieldCheck className="size-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Compra Segura · SSL Encrypted</span>
          </div>
        </div>
      </section>
    </div>
  );
}
