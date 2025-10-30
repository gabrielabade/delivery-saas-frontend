import { useState, useEffect } from 'react';
import { Menu, X, Check, ArrowRight, Smartphone, TrendingUp, Shield, Zap, Store, CreditCard, ChefHat, Bell, Rocket, Users, LineChart, Clock, Percent, Star, CheckCircle2, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '97',
      oldPrice: '147',
      description: 'Perfeito para começar',
      popular: false,
      features: [
        '100 pedidos/mês inclusos',
        'Cardápio digital ilimitado',
        'Painel administrativo completo',
        'Subdomínio personalizado',
        'Pagamento via Pix',
        'Suporte por email',
        'App mobile responsivo',
        'Relatórios básicos'
      ],
      cta: 'Começar Agora',
      badge: '34% OFF'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '197',
      oldPrice: '297',
      description: 'O mais escolhido',
      popular: true,
      features: [
        '✨ Pedidos ILIMITADOS',
        '✨ Tudo do plano Starter +',
        'Logo e cores personalizadas',
        'Integração WhatsApp automática',
        'Múltiplas formas de pagamento',
        'Relatórios avançados + BI',
        'Suporte prioritário (4h)',
        'Cardápio com combos',
        'Sistema de cupons/descontos',
        'Taxa 0% por pedido'
      ],
      cta: 'Testar 14 Dias Grátis',
      badge: '🔥 MAIS POPULAR'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '397',
      oldPrice: '597',
      description: 'Escale seu negócio',
      popular: false,
      features: [
        '🚀 Tudo do Professional +',
        'Múltiplas lojas (até 5)',
        'API personalizada',
        'Gestão completa de entregadores',
        'Integração com iFood/Rappi',
        'Sistema de fidelidade',
        'Domínio próprio incluso',
        'App nativo iOS + Android',
        'Gerente de conta dedicado',
        'Consultoria mensal 2h'
      ],
      cta: 'Agendar Demonstração',
      badge: '33% OFF'
    }
  ];

  const socialProof = [
    { icon: <Users className="w-5 h-5" />, value: '2.847', label: 'Estabelecimentos' },
    { icon: <TrendingUp className="w-5 h-5" />, value: '127K', label: 'Pedidos/Mês' },
    { icon: <Star className="w-5 h-5" />, value: '4.9/5', label: 'Avaliação' },
    { icon: <Rocket className="w-5 h-5" />, value: '3x', label: 'Mais Vendas' }
  ];

  const benefits = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Cardápio Mobile Perfeito',
      description: '94% dos pedidos vêm do celular. Seu cardápio carrega em 0.8s e converte 3x mais.',
      color: 'from-red-500 to-orange-500',
      metric: '+340% conversão'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Online em 8 Minutos',
      description: 'Sem complicação. Cadastre produtos, tire foto e comece a vender hoje mesmo.',
      color: 'from-orange-500 to-yellow-500',
      metric: '8 min setup'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Dashboard que Vende Mais',
      description: 'Veja produtos campeões, horários de pico e tome decisões que aumentam lucro.',
      color: 'from-green-500 to-emerald-500',
      metric: '+R$ 4.3k/mês'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Pagamento Seguro',
      description: 'Pix, cartão, dinheiro. Receba na hora com certificado SSL e PCI Compliance.',
      color: 'from-blue-500 to-cyan-500',
      metric: '100% seguro'
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: 'Sua Marca, Suas Regras',
      description: 'Logo, cores, domínio próprio. White-label completo sem aparecer nossa marca.',
      color: 'from-purple-500 to-pink-500',
      metric: '100% seu'
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: 'Taxa 0% nos Pedidos',
      description: 'Diferente do iFood que cobra 27%, aqui você paga apenas a mensalidade fixa.',
      color: 'from-pink-500 to-rose-500',
      metric: 'Economize 27%'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Eduardo',
      business: 'Pizzaria Don Carlo',
      city: 'São Paulo - SP',
      text: 'Saí do iFood e economizei R$ 3.200/mês em comissões. O ClickFome pagou sozinho em 1 semana.',
      result: '+R$ 3.2k economizado',
      image: '👨‍🍳',
      rating: 5
    },
    {
      name: 'Juliana Santos',
      business: 'Açaí da Ju',
      city: 'Rio de Janeiro - RJ',
      text: 'Montei meu delivery em 10 minutos no celular. Já recebi 47 pedidos no primeiro mês!',
      result: '47 pedidos em 30 dias',
      image: '👩‍💼',
      rating: 5
    },
    {
      name: 'Roberto Oliveira',
      business: 'Burger House',
      city: 'Belo Horizonte - MG',
      text: 'O painel mostra exatamente o que mais vende. Aumentei meu ticket médio em 45% focando nos combos certos.',
      result: '+45% ticket médio',
      image: '👨‍🍳',
      rating: 5
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Cadastre em 5 Minutos',
      description: 'Preencha dados básicos, escolha seu subdomínio e pronto.',
      icon: <Rocket className="w-6 h-6" />
    },
    {
      step: '2',
      title: 'Monte Seu Cardápio',
      description: 'Adicione produtos com fotos direto do celular. Simples assim.',
      icon: <ChefHat className="w-6 h-6" />
    },
    {
      step: '3',
      title: 'Personalize Sua Marca',
      description: 'Logo, cores e configure pagamentos em poucos cliques.',
      icon: <Store className="w-6 h-6" />
    },
    {
      step: '4',
      title: 'Comece a Faturar!',
      description: 'Compartilhe seu link e receba pedidos instantaneamente.',
      icon: <LineChart className="w-6 h-6" />
    }
  ];

  const faqs = [
    {
      q: 'Quanto tempo leva para configurar?',
      a: 'Em média 8-12 minutos. Nosso recorde é 4 minutos! Você só precisa cadastrar produtos e já está vendendo.'
    },
    {
      q: 'Preciso pagar taxa por pedido como no iFood?',
      a: 'NÃO! Você paga apenas a mensalidade fixa. Sem comissões, sem taxas escondidas. Todo o lucro é seu.'
    },
    {
      q: 'E se eu quiser cancelar?',
      a: 'Pode cancelar quando quiser, sem burocracia e sem multa. Mas garantimos: você não vai querer.'
    },
    {
      q: 'Funciona no celular do cliente?',
      a: 'Perfeitamente! 94% dos pedidos vêm do celular. Seu cardápio é otimizado para mobile desde o início.'
    },
    {
      q: 'Vocês cobram taxa de setup ou instalação?',
      a: 'Zero! Sem custos iniciais. Você começa com 14 dias grátis para testar tudo sem riscos.'
    },
    {
      q: 'Como recebo os pagamentos?',
      a: 'Direto na sua conta! Pix cai na hora, cartão em até 2 dias. Você tem total controle do seu dinheiro.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {/* Schema.org JSON-LD para SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ClickFome",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "97",
            "priceCurrency": "BRL"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2847"
          }
        })}
      </script>

      {/* Header Fixo com Efeito de Scroll */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-white/95 backdrop-blur-sm py-4'
        }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent hidden sm:block">
                ClickFome
              </span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#beneficios" className="text-slate-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
                Recursos
              </a>
              <a href="#planos" className="text-slate-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
                Planos
              </a>
              <a href="#depoimentos" className="text-slate-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
                Casos de Sucesso
              </a>
              <Link to="/login" className="text-slate-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">
                Entrar
              </Link>

              <Link to="/login" className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all font-bold text-sm lg:text-base">
                Teste Grátis
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
              <div className="flex flex-col gap-3">
                <a href="#beneficios" className="text-slate-700 font-medium px-4 py-3 hover:bg-slate-50 rounded-lg transition-all">
                  Recursos
                </a>
                <a href="#planos" className="text-slate-700 font-medium px-4 py-3 hover:bg-slate-50 rounded-lg transition-all">
                  Planos
                </a>
                <a href="#depoimentos" className="text-slate-700 font-medium px-4 py-3 hover:bg-slate-50 rounded-lg transition-all">
                  Casos de Sucesso
                </a>
                <Link to="/login" className="text-slate-700 font-medium px-4 py-3 hover:bg-slate-50 rounded-lg transition-all">
                  Entrar
                </Link>
                <a href="#planos" className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-bold text-center">
                  Teste Grátis 14 Dias
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section - Above the Fold Otimizado */}
      <section id="home" className="relative pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Badge de Urgência */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-slate-900 text-xs sm:text-sm font-bold shadow-xl animate-pulse">
              <Bell className="w-4 h-4" />
              <span>🔥 Últimas 7 vagas com desconto de lançamento</span>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            {/* Headline Persuasiva */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
              Saia do iFood e
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                Economize 27% em Comissões
              </span>
            </h1>

            {/* Subheadline com Benefício Claro */}
            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto">
              Sua própria plataforma de delivery <strong className="text-white">sem pagar taxas por pedido</strong>.
              Configure em 8 minutos e comece a faturar mais hoje mesmo.
            </p>

            {/* CTAs Estratégicos */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 sm:mb-16">
              <a href="#planos" className="group px-8 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl text-base sm:text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl">
                Começar Teste Grátis Agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#demo" className="px-8 py-4 sm:py-5 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white rounded-xl text-base sm:text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                Ver Como Funciona (2 min)
              </a>
            </div>

            {/* Prova Social Imediata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {socialProof.map((item, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 transition-all">
                  <div className="flex justify-center mb-2 text-orange-400">
                    {item.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>Suporte em português</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios (F-Pattern Layout) */}
      <section id="beneficios" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-20">
            <span className="text-red-600 font-bold text-sm sm:text-base uppercase tracking-wider">Por que ClickFome?</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 mt-2">
              Chega de Pagar 27% de Taxa
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Tudo que você precisa para <strong>vender mais</strong> e <strong>lucrar mais</strong>. Sem complicação, sem taxas por pedido.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group relative bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 rounded-2xl border-2 border-slate-100 hover:border-red-200 hover:shadow-2xl transition-all duration-300"
              >
                {/* Métrica em Destaque */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {benefit.metric}
                </div>

                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg text-white`}>
                  {benefit.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  {benefit.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Secundário */}
          <div className="text-center mt-12 sm:mt-16">
            <a href="#planos" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-base sm:text-lg group">
              Ver todos os recursos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Como Funciona - Redução de Fricção */}
      <section id="como-funciona" className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-red-600 font-bold text-sm sm:text-base uppercase tracking-wider">Simples e Rápido</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 mt-2">
              Online em Apenas 4 Passos
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Sem complicação. Sem tecniquês. Apenas resultados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-orange-200 h-full">
                  {/* Número do Passo */}
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center mb-6 text-white font-black text-2xl shadow-lg">
                    {step.step}
                  </div>

                  {/* Ícone */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-red-600">
                      {step.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Seta Conectora (Desktop) */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-orange-300 to-red-300 z-10"></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <p className="text-slate-600 mb-6 text-base sm:text-lg">
              <strong className="text-slate-900">Tempo médio de configuração:</strong> 8-12 minutos
            </p>
            <a href="#planos" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-base sm:text-lg">
              Quero Começar Agora
              <Rocket className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Planos - Ancoragem de Preços */}
      <section id="planos" className="py-16 sm:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-400 font-bold text-sm sm:text-base uppercase tracking-wider">Preços Transparentes</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6 mt-2">
              Invista Menos, Lucre Mais
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">
              Sem taxas por pedido. Sem surpresas. <strong className="text-white">Economize até R$ 3.200/mês</strong> em comissões.
            </p>

            {/* Comparação com iFood */}
            <div className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-slate-400">iFood cobra 27% =</span>
              <span className="text-red-400 font-bold text-lg">R$ 270 a cada R$ 1.000</span>
              <span className="text-slate-400">vs</span>
              <span className="text-green-400 font-bold text-lg">R$ 197 fixo aqui</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl transition-all duration-300 ${plan.popular
                  ? 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 scale-105 shadow-2xl ring-4 ring-orange-400/50'
                  : 'bg-white hover:scale-105 hover:shadow-xl'
                  }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className={`px-4 py-1.5 rounded-full shadow-xl font-bold text-sm ${plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900'
                      : 'bg-green-500 text-white'
                      }`}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Header do Plano */}
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`mb-6 ${plan.popular ? 'text-white/90' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>

                  {/* Preços */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-2xl line-through ${plan.popular ? 'text-white/50' : 'text-slate-400'}`}>
                        R$ {plan.oldPrice}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                        R$ {plan.price}
                      </span>
                      <span className={plan.popular ? 'text-white/80' : 'text-slate-600'}>
                        /mês
                      </span>
                    </div>
                    <p className={`text-sm mt-2 ${plan.popular ? 'text-white/70' : 'text-slate-500'}`}>
                      Sem taxa por pedido • Sem fidelidade
                    </p>
                  </div>

                  {/* CTA */}
                  <a
                    href="#"
                    className={`block w-full py-4 rounded-xl font-bold mb-8 transition-all text-center ${plan.popular
                      ? 'bg-white text-red-600 hover:shadow-2xl hover:scale-105'
                      : 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-xl hover:scale-105'
                      }`}
                  >
                    {plan.cta}
                  </a>

                  {/* Features */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${plan.popular ? 'bg-white/20' : 'bg-green-100'
                          }`}>
                          <Check className={`w-3.5 h-3.5 ${plan.popular ? 'text-white' : 'text-green-600'
                            }`} strokeWidth={3} />
                        </div>
                        <span className={`${plan.popular ? 'text-white' : 'text-slate-700'} leading-relaxed text-sm`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Garantia */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-500/10 border-2 border-green-500/30 rounded-xl">
              <Shield className="w-6 h-6 text-green-400" />
              <div className="text-left">
                <p className="text-white font-bold">Garantia de 14 Dias</p>
                <p className="text-slate-400 text-sm">Não gostou? Devolvemos 100% do seu dinheiro</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos - Prova Social */}
      <section id="depoimentos" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-red-600 font-bold text-sm sm:text-base uppercase tracking-wider">Casos Reais</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 mt-2">
              Quem Usa, Aprova (e Lucra Mais)
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
              Veja resultados reais de quem já está faturando com o ClickFome
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 rounded-2xl border-2 border-slate-100 hover:border-orange-200 hover:shadow-2xl transition-all"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Resultado em Destaque */}
                <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-sm mb-4">
                  {testimonial.result}
                </div>

                {/* Depoimento */}
                <p className="text-slate-700 mb-6 leading-relaxed italic text-base">
                  "{testimonial.text}"
                </p>

                {/* Autor */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.business}</div>
                    <div className="text-xs text-slate-500">{testimonial.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA com Urgência */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-slate-600 mb-6 text-base sm:text-lg">
              Mais de <strong className="text-slate-900">2.847 estabelecimentos</strong> já estão economizando com ClickFome
            </p>
            <a href="#planos" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all text-base sm:text-lg">
              Eu Também Quero Economizar
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ - Reduzir Objeções */}
      <section id="faq" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-red-600 font-bold text-sm sm:text-base uppercase tracking-wider">Perguntas Frequentes</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 mt-2">
              Dúvidas? A Gente Responde
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-xl border-2 border-slate-200 hover:border-orange-200 transition-all overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-base sm:text-lg">
                  {faq.q}
                  <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Ainda tem dúvidas?</p>
            <a href="#" className="text-red-600 hover:text-red-700 font-bold text-lg">
              Fale com nosso time no WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final - Última Chamada */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-red-600 via-orange-500 to-pink-600 relative overflow-hidden">
        {/* Pattern de Fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-yellow-400 text-slate-900 rounded-full font-bold text-sm mb-6">
            ⏰ Oferta por tempo limitado
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Comece Hoje e Economize<br />R$ 3.200 no Primeiro Mês
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
            Teste <strong>14 dias grátis</strong>, sem cartão de crédito. Se não gostar, cancele com 1 clique.
          </p>

          <a
            href="#planos"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-600 rounded-xl text-lg font-black hover:shadow-2xl hover:scale-105 transition-all mb-6"
          >
            Criar Minha Loja Grátis Agora
            <Rocket className="w-6 h-6" />
          </a>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-300" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-300" />
              <span>Configure em 8 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-300" />
              <span>Suporte em português</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Otimizado para SEO */}
      <footer className="bg-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
            {/* Sobre */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">ClickFome</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Plataforma de delivery sem taxas por pedido. Economize até 27% em comissões.
              </p>
              <p className="text-slate-500 text-sm">
                CNPJ: XX.XXX.XXX/0001-XX
              </p>
            </div>

            {/* Produto */}
            <div>
              <h4 className="font-bold text-lg mb-4">Produto</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#beneficios" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#planos" className="hover:text-white transition-colors">Planos e Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentação</a></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-bold text-lg mb-4">Empresa</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#depoimentos" className="hover:text-white transition-colors">Casos de Sucesso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>

            {/* Suporte */}
            <div>
              <h4 className="font-bold text-lg mb-4">Suporte</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm text-center sm:text-left">
                © 2024 ClickFome. Todos os direitos reservados.
              </p>
              <div className="flex items-center gap-6 text-slate-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4 text-center">
              Desenvolvido com 🧡 por <a href="https://gbconnect.digital" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">GBConnect Digital</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;