
import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { 
  Activity, 
  BrainCircuit, 
  ShieldAlert, 
  Smartphone, 
  Stethoscope, 
  WifiOff, 
  ArrowRight, 
  Loader2,
  AlertTriangle,
  Eye,
  Palette,
  MessageSquareHeart,
  FileText,
  MapPin,
  TrendingUp,
  Star,
  Users,
  ScrollText,
  CheckCircle2,
  Server,
  Zap,
  XCircle,
  Play,
  Network
} from 'lucide-react';

// Initialize Gemini API
// Note: In a real deployment, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- API Test Component ---
const ApiTestDashboard = ({ onBack }: { onBack: () => void }) => {
  const [tests, setTests] = useState([
    { id: 'env', name: 'Configuração de Ambiente', status: 'pending', message: 'Aguardando...', latency: 0 },
    { id: 'network', name: 'Conectividade de Rede', status: 'pending', message: 'Aguardando...', latency: 0 },
    { id: 'gemini', name: 'Google Gemini API (GenAI)', status: 'pending', message: 'Aguardando...', latency: 0 },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (id: string, updates: any) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    
    // Reset tests
    setTests(prev => prev.map(t => ({ ...t, status: 'running', message: 'Testando...', latency: 0 })));

    // 1. Environment Check
    setTimeout(() => {
      const hasKey = !!process.env.API_KEY;
      updateTest('env', { 
        status: hasKey ? 'success' : 'error', 
        message: hasKey ? 'API Key Detectada' : 'API Key Ausente',
        latency: 1 
      });
    }, 500);

    // 2. Network Check
    const startNet = performance.now();
    try {
      await fetch('https://www.google.com', { mode: 'no-cors' });
      const endNet = performance.now();
      updateTest('network', { 
        status: 'success', 
        message: 'Online', 
        latency: Math.round(endNet - startNet) 
      });
    } catch (e) {
      updateTest('network', { status: 'error', message: 'Offline / Bloqueado', latency: 0 });
    }

    // 3. Gemini Real API Call
    const startGemini = performance.now();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Ping. Reply with "Pong" only.',
      });
      const endGemini = performance.now();
      const text = response.text;
      
      if (text) {
        updateTest('gemini', { 
          status: 'success', 
          message: `Resposta: "${text.trim()}"`, 
          latency: Math.round(endGemini - startGemini) 
        });
      } else {
        throw new Error("Resposta vazia");
      }
    } catch (e: any) {
      updateTest('gemini', { 
        status: 'error', 
        message: e.message || 'Falha na conexão', 
        latency: 0 
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-mono">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-700 pb-6">
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold">Diagnóstico de Sistema & API</h1>
          </div>
          <button onClick={onBack} className="text-sm text-slate-400 hover:text-white underline">
            Voltar para Aplicação
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 bg-slate-950/50 border-b border-slate-700 flex justify-between items-center">
            <h2 className="font-semibold text-slate-300">Lista de APIs Instaladas</h2>
            <button 
              onClick={runDiagnostics}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                isRunning 
                ? 'bg-slate-700 text-slate-400 cursor-wait' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
              }`}
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Executando...' : 'Iniciar Teste Real'}
            </button>
          </div>
          
          <div className="divide-y divide-slate-700">
            {tests.map((test) => (
              <div key={test.id} className="p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">
                    {test.status === 'pending' && <div className="w-3 h-3 rounded-full bg-slate-600" />}
                    {test.status === 'running' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                    {test.status === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {test.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-200">{test.name}</h3>
                    <p className={`text-xs ${
                      test.status === 'error' ? 'text-red-300' : 
                      test.status === 'success' ? 'text-emerald-300' : 'text-slate-500'
                    }`}>
                      {test.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {test.latency > 0 && (
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      {test.latency}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <strong className="block text-slate-400 mb-2">Nota Técnica:</strong>
            Esta aplicação utiliza o modelo <code>gemini-3-flash-preview</code>. As funcionalidades de PageSpeed, Vision API e Google Trends na aplicação principal são dados simulados injetados no prompt para fins de demonstração da consultoria.
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
             <strong className="block text-slate-400 mb-2">Status da Sessão:</strong>
             User Agent: {navigator.userAgent}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState<'app' | 'test'>('app');

  // Main App State
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Treatment Plan State (Phase 4)
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const planRef = useRef<HTMLDivElement>(null);

  // Simulated Technical Metrics State (Phase 1)
  const [pageSpeedScore, setPageSpeedScore] = useState(45); // Low score = Anxiety
  const [isSecure, setIsSecure] = useState(true); // SSL Status
  const [mobileFriendly, setMobileFriendly] = useState(false); // Mobile Error

  // Simulated Semiotic Metrics State (Phase 2)
  const [visualStyle, setVisualStyle] = useState<'welcoming' | 'clinical' | 'chaotic'>('clinical');
  const [contentFocus, setContentFocus] = useState<'patient' | 'ego'>('ego');
  const [approachClear, setApproachClear] = useState(false);

  // Simulated Market Metrics State (Phase 3)
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(4.5);
  const [reviewSentiment, setReviewSentiment] = useState<'praise' | 'complaint'>('praise');
  const [trendingTerm, setTrendingTerm] = useState('Burnout');
  const [competitorHasPhotos, setCompetitorHasPhotos] = useState(true);

  const handleDiagnose = async () => {
    if (!name || !url) return;
    setLoading(true);
    setResult('');
    setTreatmentPlan(''); // Reset plan on new diagnosis

    // Mapping simulation state to prompt concepts (Phase 2)
    const visualMapping = {
      welcoming: {
        labels: "'Calm', 'Nature', 'Smile', 'Comfort', 'Warmth'",
        colors: "Tons pastéis, Azul Sereno, Verde Natureza",
        desc: "Acolhedor e Humano"
      },
      clinical: {
        labels: "'Hospital', 'White Room', 'Medical Equipment', 'Cold'",
        colors: "Branco absoluto, Cinza, Azul Institucional",
        desc: "Frio e Distante"
      },
      chaotic: {
        labels: "'Abstract Blur', 'Darkness', 'Crowd', 'Text Overlay'",
        colors: "Vermelho, Preto, Neon, Contraste Excessivo",
        desc: "Confuso e Ansiogênico"
      }
    };

    const contentMapping = {
      patient: {
        sentiment: "Positivo/Empático (0.8)",
        entities: "'Angústia', 'Superação', 'Escuta Ativa', 'Acolhimento'",
        desc: "Foco nas Dores e Sentimentos do Paciente"
      },
      ego: {
        sentiment: "Neutro/Formal (0.1)",
        entities: "'PhD', 'Pós-Doutorado', 'Congressos', 'Publicações Acadêmicas'",
        desc: "Foco no Currículo e Títulos do Terapeuta (Ego)"
      }
    };

    const currentVisual = visualMapping[visualStyle];
    const currentContent = contentMapping[contentFocus];

    // Mapping Market Data (Phase 3)
    const marketCity = city || "Sua Cidade";
    const reviewDetails = reviewSentiment === 'praise' 
      ? "'Me senti ouvido', 'Ótima localização', 'Profissional atencioso'" 
      : "'Atraso no atendimento', 'Frieza', 'Difícil marcar horário'";
    
    const competitorAnalysis = competitorHasPhotos 
      ? "O principal concorrente tem 20+ fotos profissionais de um ambiente acolhedor, gerando alta confiança visual." 
      : "O concorrente tem pouca presença visual, abrindo uma oportunidade.";

    try {
      const prompt = `
        Atue como um Consultor Estratégico para Psicólogos. 
        Analise o perfil do Psicólogo(a) ${name} (${url}) em ${marketCity}.

        --- DADOS TÉCNICOS (Fase 1: Infraestrutura/Corpo) ---
        1. PageSpeed Mobile: ${pageSpeedScore}/100.
           Metáfora: ${pageSpeedScore < 50 ? 'Site Lento = "Quebra de Vínculo"' : 'Site Rápido = "Acolhimento Imediato"'}.
        2. Web Risk: ${isSecure ? 'Seguro' : 'Não Seguro'}.
        3. Mobile: ${mobileFriendly ? 'Responsivo' : 'Falha no Mobile (Ambiente Hostil)'}.

        --- DADOS SEMIÓTICOS (Fase 2: Vínculo/Alma) ---
        1. Visual: ${currentVisual.desc}.
        2. Texto: ${currentContent.desc}.
        3. Clareza: ${approachClear ? 'Abordagem Clara' : 'Abordagem Confusa'}.

        --- DADOS DE MERCADO (Fase 3: O Inconsciente Coletivo) ---
        1. Reputação Local: Nota ${rating}/5.0.
        2. Tendências: Busca por "Psicólogo para ${trendingTerm}" em alta.
        3. Concorrência: ${competitorAnalysis}

        --- INSTRUÇÃO DE SAÍDA (O RELATÓRIO) ---
        Gere um relatório estruturado em 3 seções curtas e impactantes:
        1. **O Diagnóstico do Corpo (Técnica):** Relacione a velocidade/segurança com o estado emocional do paciente.
        2. **A Análise da Alma (Vínculo):** Critique se a identidade visual e o texto conectam ou afastam.
        3. **Oportunidades Ocultas (Mercado):** Revele o "Inconsciente Coletivo" da região e a demanda por **${trendingTerm}**.
        
        Termine com uma **"Prescrição Estratégica"** curta.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResult(response.text);
    } catch (error) {
      console.error("Error generating diagnosis:", error);
      setResult("Ocorreu um erro ao gerar o diagnóstico. Por favor, verifique sua conexão ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!result) return;
    setLoadingPlan(true);
    setTreatmentPlan('');

    try {
      const prompt = `
        Você é um Estrategista de Carreira para Terapeutas. Seu objetivo é vender sua "Supervisão Digital" (Gestão de Marketing/Tráfego).
        
        CONTEXTO:
        Psicólogo: ${name}
        Cidade: ${city || "Região Local"}
        Problema Técnico: ${pageSpeedScore < 50 ? "Site Lento (Gera Ansiedade)" : "Site Rápido, mas..."} ${!mobileFriendly ? "e Falha no Mobile" : ""}.
        Problema Vínculo: ${visualStyle === 'clinical' ? "Visual Frio/Distante" : "Visual Genérico"} e Foco no ${contentFocus === 'ego' ? "Ego (Currículo)" : "Paciente"}.
        Oportunidade Perdida: Demanda alta por "${trendingTerm}" que ele não capta.

        TAREFA:
        Escreva o texto de uma Proposta Comercial / Landing Page Personalizada para o ${name}.
        O tom deve ser empático, ético, mas firme sobre a necessidade de mudança. Nada de "fique rico". Use termos como "ampliar sua capacidade de ajuda".

        ESTRUTURA OBRIGATÓRIA DO TEXTO:

        1. "A Escuta Inicial" (Título H3): Identifique que o consultório digital dele está "vazio" ou "silencioso" apesar da competência dele. Mostre empatia.
        
        2. "Pontos de Tensão" (Título H3): Liste 3 falhas técnicas identificadas como se fossem bloqueios emocionais do site (ex: "A lentidão é o primeiro 'não' que seu paciente ouve").
        
        3. "A Elaboração" (Título H3): Mostre como sua agência vai criar um ambiente seguro para atrair pacientes particulares (valorizando a consulta, não preço social). Fale sobre atrair pacientes comprometidos com o processo terapêutico que buscam especificamente por "${trendingTerm}".

        Seja persuasivo e foque na carreira de longo prazo.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setTreatmentPlan(response.text);
      // Smooth scroll to plan after short delay
      setTimeout(() => {
        planRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
       console.error("Error generating plan:", error);
       setTreatmentPlan("Erro ao gerar o plano. Tente novamente.");
    } finally {
      setLoadingPlan(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Render view switcher
  if (currentView === 'test') {
    return <ApiTestDashboard onBack={() => setCurrentView('app')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <BrainCircuit className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight">PsiTech <span className="font-light text-slate-500">Consultoria</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('test')}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 hover:border-indigo-200 transition-all bg-slate-50"
            >
              <Activity className="w-3 h-3" />
              Status do Sistema
            </button>
            <div className="text-sm text-slate-500 hidden sm:block">
              Diagnóstico 360º para Psicólogos
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        
        {/* Intro Section */}
        <section className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Seu consultório digital está <span className="text-indigo-600">invisível</span> para quem precisa?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Descubra como problemas técnicos, falta de vínculo emocional e cegueira de mercado estão afastando seus pacientes.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Input & Simulation Controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-500" />
                Dados do Profissional
              </h3>
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Dr. Ana Silva"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://seu-site.com.br"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Phase 1: Tech */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Fase 1: Corpo (Infraestrutura)
              </h3>

              {/* PageSpeed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <WifiOff className="w-4 h-4 text-slate-400" />
                    PageSpeed Mobile
                  </label>
                  <span className={`font-mono font-bold ${getScoreColor(pageSpeedScore)}`}>{pageSpeedScore}/100</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={pageSpeedScore}
                  onChange={(e) => setPageSpeedScore(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setIsSecure(!isSecure)}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${isSecure ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">{isSecure ? 'Seguro' : 'Inseguro'}</span>
                </button>
                <button 
                  onClick={() => setMobileFriendly(!mobileFriendly)}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${mobileFriendly ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase">{mobileFriendly ? 'Mobile OK' : 'Mobile Ruim'}</span>
                </button>
              </div>
            </div>

            {/* Phase 2: Semiotics */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Fase 2: Alma (Vínculo & Conteúdo)
              </h3>

              <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'welcoming', label: 'Acolhedor', icon: '🌿' },
                    { id: 'clinical', label: 'Frio', icon: '🏥' },
                    { id: 'chaotic', label: 'Caótico', icon: '⚡' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setVisualStyle(style.id as any)}
                      className={`py-2 px-1 rounded-lg text-[10px] font-medium border transition-all ${
                        visualStyle === style.id 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block text-sm mb-1">{style.icon}</span>
                      {style.label}
                    </button>
                  ))}
              </div>

              <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setContentFocus('patient')}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                      contentFocus === 'patient' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Foco: Paciente
                  </button>
                  <button
                    onClick={() => setContentFocus('ego')}
                    className={`flex-1 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${
                      contentFocus === 'ego' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Foco: Currículo (Ego)
                  </button>
              </div>
            </div>

            {/* Phase 3: Market */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Fase 3: Mercado (Oportunidade)
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Sua Cidade</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo, SP"
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-3 space-y-3 border border-indigo-100">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-indigo-800 uppercase flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Reputação (Google)
                    </label>
                    <span className="text-xs font-bold text-indigo-600">{rating} ★</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setReviewSentiment('praise')}
                      className={`flex-1 py-1 text-[10px] rounded border ${reviewSentiment === 'praise' ? 'bg-white border-indigo-200 text-indigo-700 shadow-sm' : 'border-transparent text-indigo-400'}`}
                    >
                      Elogios
                    </button>
                    <button 
                      onClick={() => setReviewSentiment('complaint')}
                      className={`flex-1 py-1 text-[10px] rounded border ${reviewSentiment === 'complaint' ? 'bg-white border-indigo-200 text-indigo-700 shadow-sm' : 'border-transparent text-indigo-400'}`}
                    >
                      Queixas
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase block">Demanda em Alta (Trends)</label>
                   <select 
                    value={trendingTerm}
                    onChange={(e) => setTrendingTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                   >
                     <option value="Burnout">Burnout / Esgotamento</option>
                     <option value="Autismo Adulto">Autismo em Adultos</option>
                     <option value="Terapia de Casal">Terapia de Casal</option>
                     <option value="Ansiedade Social">Ansiedade Social</option>
                     <option value="Luto">Luto</option>
                   </select>
                </div>

                <button 
                  onClick={() => setCompetitorHasPhotos(!competitorHasPhotos)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    competitorHasPhotos 
                      ? 'bg-orange-50 border-orange-200 text-orange-700' 
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {competitorHasPhotos ? 'Concorrente tem fotos melhores' : 'Concorrente visualmente fraco'}
                </button>

              </div>
            </div>

            <button
              onClick={handleDiagnose}
              disabled={loading || !name}
              className={`w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all shadow-lg shadow-indigo-200 ${
                loading || !name ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando Diagnóstico...
                </>
              ) : (
                <>
                  Gerar Diagnóstico 360º
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          <div className="space-y-6">
            <div className={`h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col ${!result && !loading ? 'justify-center items-center text-center text-slate-400 min-h-[600px]' : ''}`}>
              
              {!result && !loading && (
                <div className="space-y-4 max-w-xs mx-auto">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 relative">
                    <BrainCircuit className="w-8 h-8 absolute" />
                    <Eye className="w-4 h-4 absolute top-4 right-5 text-indigo-300" />
                    <TrendingUp className="w-4 h-4 absolute bottom-4 right-5 text-emerald-400" />
                  </div>
                  <p>Preencha os dados de Infraestrutura, Semiótica e Mercado para obter um diagnóstico completo.</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-pulse">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                    <Activity className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="space-y-2 text-center max-w-xs">
                    <h3 className="text-lg font-semibold text-slate-800">Processando Análise 360º...</h3>
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <span>• Verificando Rapport Digital (PageSpeed)...</span>
                      <span>• Analisando Vínculo Emocional (Semiótica)...</span>
                      <span>• Mapeando Inconsciente Coletivo (Mercado)...</span>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  {/* Diagnosis Result */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <BrainCircuit className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Diagnóstico Estratégico</h3>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">Paciente: {name} | {city || 'Brasil'}</p>
                    </div>
                  </div>

                  <div className="prose prose-slate prose-headings:text-indigo-900 prose-strong:text-slate-900 leading-relaxed text-slate-700 text-sm sm:text-base">
                    <div className="whitespace-pre-line">{result}</div>
                  </div>
                  
                  {/* Call to Action for Treatment Plan */}
                  {!treatmentPlan && (
                    <div className="bg-gradient-to-r from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 mt-6 text-center space-y-4">
                      <div className="text-indigo-900 font-semibold">
                        Gostaria de uma proposta de intervenção personalizada?
                      </div>
                      <button
                        onClick={handleGeneratePlan}
                        disabled={loadingPlan}
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
                      >
                        {loadingPlan ? (
                          <>
                             <Loader2 className="w-4 h-4 animate-spin" />
                             Elaborando Plano...
                          </>
                        ) : (
                          <>
                             <ScrollText className="w-4 h-4" />
                             Prescrever Plano de Tratamento
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Treatment Plan Result */}
                  {treatmentPlan && (
                    <div ref={planRef} className="mt-8 pt-8 border-t-2 border-dashed border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                             <FileText className="w-6 h-6 text-indigo-400" />
                             <div>
                               <h3 className="font-bold text-lg">Proposta de Supervisão Digital</h3>
                               <p className="text-xs text-slate-400">Plano de Tratamento de Carreira</p>
                             </div>
                           </div>
                           <CheckCircle2 className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="p-8 prose prose-slate prose-h3:text-indigo-800 prose-h3:font-bold prose-p:text-slate-600 max-w-none">
                           <div className="whitespace-pre-line">{treatmentPlan}</div>
                        </div>
                        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                           <button className="text-indigo-600 font-medium text-sm hover:underline">
                             Baixar PDF da Proposta
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('app')!);
root.render(<App />);
