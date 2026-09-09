import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { STEPS } from "@/quiz/steps";
import { 
  MultiChoiceScreen, 
  SingleChoiceScreen 
} from "@/components/quiz/screens/ChoiceScreens";
import { 
  AudioScreen, 
  AudioOnlyScreen, 
  MechanismScreen, 
  NameScreen,
  CommitmentLoadingScreen,
  LoadingScreen
} from "@/components/quiz/screens/ContentScreens";
import { DiagnosisScreen } from "@/components/quiz/screens/DiagnosisScreen";
import { buildDiagnosis } from "@/quiz/diagnosis";
import { 
  LayoutDashboard, 
  List, 
  ChevronRight, 
  ChevronLeft,
  Settings,
  Eye,
  BarChart3,
  Search,
  Check,
  ShieldCheck,
  ExternalLink,
  Smartphone,
  Monitor,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Funnel,
  FunnelChart,
  LabelList
} from "recharts";
import { generateMockMetrics } from "@/quiz/metrics-mock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Painel Admin | Lomove" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"steps" | "metrics">("metrics");
  const [deviceFilter, setDeviceFilter] = useState<"all" | "mobile" | "desktop">("all");
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const metrics = useMemo(() => generateMockMetrics(deviceFilter), [deviceFilter]);

  const filteredSteps = useMemo(() => {
    return STEPS.map((s, i) => ({ ...s, originalIndex: i })).filter(s => 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.kind === "single" || s.kind === "multi" ? (s as any).question.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    );
  }, [searchTerm]);

  const currentStep = STEPS[selectedStepIndex]!;

  // Mock answers for previewing components that require them
  const mockAnswers = {
    nome: "Visitante",
    idade: "50-59",
    regiao: ["lombar"],
    intensidade: "intensa",
    sono: "ruim",
    investimento: "mais2000"
  };

  const renderStepPreview = () => {
    // We wrap the preview content in the same StepShell to maintain visual fidelity
    const previewContent = () => {
      switch (currentStep.kind) {
        case "intro":
        case "single":
          return (
            <SingleChoiceScreen
              step={currentStep as any}
              value={undefined}
              onAnswer={() => {}}
              onNext={() => {}}
              isFirstStep={currentStep.id === "intro"}
            />
          );
        case "multi":
          return (
            <MultiChoiceScreen
              step={currentStep as any}
              value={[]}
              onAnswer={() => {}}
              onNext={() => {}}
              showBodyMap={currentStep.id === "regiao"}
            />
          );
        case "audio":
          return <AudioScreen step={currentStep} onNext={() => {}} answers={mockAnswers} />;
        case "audio_only":
          return <AudioOnlyScreen step={currentStep} onNext={() => {}} />;
        case "name":
          return (
            <NameScreen
              step={currentStep as any}
              value=""
              onAnswer={() => {}}
              onNext={() => {}}
            />
          );
        case "mechanism":
          return <MechanismScreen step={currentStep} name="Visitante" onNext={() => {}} />;
        case "commitment_loading":
          return <CommitmentLoadingScreen name="Visitante" onDone={() => {}} />;
        case "loading":
          return <LoadingScreen name="Visitante" onDone={() => {}} />;
        case "diagnosis":
          return (
            <DiagnosisScreen
              diagnosis={buildDiagnosis(mockAnswers)}
              name="Visitante"
              answers={mockAnswers}
              onAccept={() => {}}
              onDoubts={() => {}}
            />
          );
        default:
          return <div className="p-8 text-center text-muted-foreground">Preview não disponível para este tipo de etapa.</div>;
      }
    };

    return (
      <div className="admin-preview-shell">
        {currentStep.kind !== "loading" && currentStep.kind !== "commitment_loading" && (
          <div className="max-w-xl mx-auto px-4 pt-6 pb-16">
            {previewContent()}
          </div>
        )}
        {(currentStep.kind === "loading" || currentStep.kind === "commitment_loading") && previewContent()}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">L</div>
            <h1 className="text-xl font-bold font-display tracking-tight text-primary">Lomove Admin</h1>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Painel de Controle v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("steps")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
              activeTab === "steps" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <List className="size-5" />
            Navegação de Etapas
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
              activeTab === "metrics" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary"
            )}
          >
            <BarChart3 className="size-5" />
            Métricas de Desempenho
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
            <p className="text-xs font-bold text-muted-foreground mb-1">LOGGED AS</p>
            <p className="text-sm font-semibold truncate">Administrador Lomove</p>
          </div>
        </div>
      </aside>

       {/* Main Content */}
       <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
         <p className="sr-only">
           Na página de loading ainda não dá para arrastar para o lado para os outros depoimentos. Quero que o comportamento dos carrosséis de depoimentos sejam iguais.
         </p>
        {/* Header */}
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-primary">
              {activeTab === "steps" ? "Visualizador de Etapas" : "Dashboard de Métricas"}
            </h2>
            {activeTab === "steps" && (
              <span className="text-[10px] font-bold bg-secondary px-2 py-1 rounded text-muted-foreground uppercase tracking-wider">
                Etapa {selectedStepIndex + 1} de {STEPS.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
             <a 
               href="/"
               className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg"
             >
               <Eye className="size-4" /> Início do Quiz
             </a>
             <button 
               onClick={() => {
                 window.location.href = `/#step-${selectedStepIndex}`;
               }}
               className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-primary text-white hover:bg-primary/90 transition-colors rounded-lg shadow-sm"
             >
               <ExternalLink className="size-4" /> Abrir no Quiz Real
             </button>
             <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Settings className="size-5" /></button>
          </div>
        </header>

        {activeTab === "steps" ? (
          <div className="flex flex-1 overflow-hidden">
            {/* Steps List */}
            <div className="w-80 border-r border-border bg-white overflow-y-auto shrink-0 flex flex-col">
              <div className="p-4 sticky top-0 bg-white z-10 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Filtrar etapas..." 
                    className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1">
                {filteredSteps.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStepIndex(s.originalIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 px-6 py-4 text-left border-b border-border transition-colors group",
                      selectedStepIndex === s.originalIndex ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-secondary/30"
                    )}
                  >
                    <div className={cn(
                      "size-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                      selectedStepIndex === s.originalIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    )}>
                      {s.originalIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{s.id}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter truncate opacity-70">Tipo: {s.kind}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/#step-${s.originalIndex}`;
                        }}
                        title="Ir para esta etapa no Quiz Real"
                        className="p-1.5 rounded-md hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink className="size-3.5" />
                      </button>
                      <ChevronRight className={cn("size-4 text-muted-foreground/30", selectedStepIndex === s.originalIndex && "text-primary")} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-secondary/20 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
              <div className="w-full max-w-[400px] bg-white rounded-[3rem] shadow-2xl shadow-black/10 overflow-hidden border-[8px] border-slate-900 flex flex-col relative aspect-[9/19.5]">
                {/* Simulated Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50"></div>
                
                {/* Progress Bar in Preview */}
                <div className="h-14 bg-white border-b border-border flex items-end px-6 pb-2 shrink-0">
                   <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500" 
                        style={{ width: `${((selectedStepIndex + 1) / STEPS.length) * 100}%` }}
                      />
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide bg-background">
                  <div className="p-0">
                    {renderStepPreview()}
                  </div>
                </div>
              </div>

              {/* External Controls for better UX */}
              <div className="mt-8 flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-border">
                <button 
                  disabled={selectedStepIndex === 0}
                  onClick={() => setSelectedStepIndex(i => i - 1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft className="size-5" /> Anterior
                </button>
                
                <div className="h-4 w-px bg-border"></div>
                
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Controle de Navegação</p>
                
                <div className="h-4 w-px bg-border"></div>

                <button 
                  disabled={selectedStepIndex === STEPS.length - 1}
                  onClick={() => setSelectedStepIndex(i => i + 1)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:text-primary/80 disabled:opacity-30 transition-colors"
                >
                  Próxima <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8 pb-20">
              {/* Controls Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Período de Análise</h3>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
                      <Calendar className="size-4 text-primary" /> Últimos 7 dias
                    </button>
                    <div className="h-8 w-px bg-border mx-2"></div>
                    <button className="text-xs font-bold text-primary hover:underline">Ver mês completo</button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Segmentar por:</span>
                  <div className="bg-secondary/30 p-1 rounded-xl flex items-center gap-1">
                    <button 
                      onClick={() => setDeviceFilter("all")}
                      className={cn("px-3 py-1.5 rounded-lg text-xs font-bold transition-all", deviceFilter === "all" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                    >Todos</button>
                    <button 
                      onClick={() => setDeviceFilter("mobile")}
                      className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all", deviceFilter === "mobile" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                    ><Smartphone className="size-3.5" /> Mobile</button>
                    <button 
                      onClick={() => setDeviceFilter("desktop")}
                      className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all", deviceFilter === "desktop" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground")}
                    ><Monitor className="size-3.5" /> Desktop</button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Visitas Totais" value={metrics.totalVisitors.toLocaleString()} change="+12%" icon={<Eye className="text-blue-500" />} />
                <MetricCard title="Taxa de Conclusão" value={`${(metrics.completionRate * 100).toFixed(1)}%`} change="+5.2%" icon={<Check className="text-emerald-500" />} />
                <MetricCard title="Tempo Médio" value={metrics.avgTotalTime} icon={<Clock className="text-amber-500" />} />
                <MetricCard title="Leads Gerados" value={Math.round(metrics.totalVisitors * 0.68).toLocaleString()} change="+18%" icon={<BarChart3 className="text-indigo-500" />} />
              </div>

              {/* Full Funnel View (Priority #3) */}
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold font-display">Funil de Conversão Completo</h3>
                    <p className="text-sm text-muted-foreground">Desempenho desde a primeira interação até a compra</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <TrendingUp className="size-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">Conversão Final: 4.2%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {metrics.funnel.map((step, i) => (
                    <div key={step.name} className="relative flex flex-col items-center group">
                      <div className="w-full aspect-[4/3] bg-secondary/30 rounded-2xl flex flex-col items-center justify-center p-4 transition-all group-hover:bg-primary/5 group-hover:border-primary/20 border border-transparent">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 text-center">{step.name}</p>
                        <p className="text-2xl font-black text-primary">{step.value.toLocaleString()}</p>
                        <div className="mt-1 px-2 py-0.5 bg-white/80 rounded-full text-[10px] font-bold shadow-sm">
                          {step.percent}% do início
                        </div>
                      </div>
                      {i < metrics.funnel.length - 1 && (
                        <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-sm border border-border">
                          <ArrowRight className="size-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Abandonment Rate and Time per Step (Priority #1 & #2) */}
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-xl font-bold font-display">Desempenho por Etapa (1-22)</h3>
                    <p className="text-sm text-muted-foreground">Identifique exatamente onde as usuárias estão saindo</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5"><div className="size-2 bg-primary rounded-full"></div> Taxa de Abandono (%)</div>
                    <div className="flex items-center gap-1.5"><div className="size-2 bg-amber-400 rounded-full"></div> Tempo Médio (s)</div>
                    <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                      <AlertTriangle className="size-3.5" /> Alerta Crítico ({" > "}7%)
                    </div>
                  </div>
                </div>

                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.stepMetrics} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="stepId" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fontWeight: 700 }}
                        dy={10}
                      />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} hide />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = (payload[0] as any).payload;
                            return (
                              <div className="bg-white p-4 rounded-2xl shadow-2xl border border-border min-w-[200px]">
                                <p className="text-xs font-black uppercase text-primary mb-3 border-b border-border pb-2">{data.label}</p>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Chegaram na etapa:</span>
                                    <span className="text-xs font-bold">{data.reached.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Abandonaram aqui:</span>
                                    <span className="text-xs font-bold text-rose-600">{data.abandoned.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                                    <span className="text-xs font-bold">Taxa de Abandono:</span>
                                    <span className={cn("text-sm font-black", data.isAlert ? "text-rose-600" : "text-primary")}>
                                      {data.abandonRate.toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold">Tempo Médio:</span>
                                    <span className="text-sm font-black text-amber-600">{data.avgTime.toFixed(1)}s</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar yAxisId="left" dataKey="abandonRate" radius={[6, 6, 0, 0]} barSize={24}>
                        {metrics.stepMetrics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isAlert ? "#e11d48" : "#000000"} fillOpacity={entry.isAlert ? 1 : 0.8} />
                        ))}
                      </Bar>
                      <Bar yAxisId="left" dataKey="avgTime" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Response Distribution (Priority #4) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {metrics.distributions.map((dist) => (
                  <div key={dist.questionId} className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-6">{dist.question}</h3>
                    <div className="space-y-5">
                      {dist.options.map((opt) => (
                        <div key={opt.label} className="space-y-1.5 group">
                          <div className="flex justify-between text-sm font-bold">
                            <span className="group-hover:text-primary transition-colors">{opt.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-muted-foreground">{opt.count.toLocaleString()} resp.</span>
                              <span className="text-primary">{opt.percent}%</span>
                            </div>
                          </div>
                          <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                              style={{ width: `${opt.percent}%` }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Fixed "Regiões de Dor" Card (Priority #4 note) */}
                <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                  <h3 className="text-lg font-bold mb-6">Regiões de Dor mais Citadas</h3>
                  <div className="space-y-4">
                    <RegionMetric label="Lombar" percent={42} color="bg-primary" />
                    <RegionMetric label="Cervical" percent={28} color="bg-blue-500" />
                    <RegionMetric label="Ciática" percent={15} color="bg-indigo-500" />
                    <RegionMetric label="Hérnia" percent={10} color="bg-amber-500" />
                    <RegionMetric label="Outras" percent={5} color="bg-secondary-foreground/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MetricCard({ title, value, change, icon }: { title: string; value: string; change?: string; icon: React.ReactNode }) {
  const isPositive = change?.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-secondary/50 rounded-2xl group-hover:bg-primary/10 transition-colors">{icon}</div>
        {change && (
          <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", isPositive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black font-display tracking-tighter text-primary">{value}</p>
    </div>
  );
}

function RegionMetric({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span className="text-muted-foreground">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
