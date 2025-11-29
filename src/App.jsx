import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  // Estados de la conversación actual
  const [userInput, setUserInput] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uxPrinciple, setUxPrinciple] = useState('');
  const resultRef = useRef(null);

  // Estados del sidebar y conversaciones
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Cargar conversaciones desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('ideaboost-conversations');
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      // Seleccionar la última conversación si existe
      if (parsed.length > 0) {
        setCurrentConversationId(parsed[0].id);
        loadConversation(parsed[0]);
      }
    }
  }, []);

  // Guardar conversaciones en localStorage cuando cambian
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('ideaboost-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Cargar datos de una conversación
  const loadConversation = (conv) => {
    setUserInput(conv.userInput || '');
    setGeneratedIdea(conv.generatedIdea || '');
    setUxPrinciple(conv.uxPrinciple || '');
    setError('');
  };

  // Guardar conversación actual
  const saveCurrentConversation = (idea, principle, input) => {
    if (!currentConversationId) {
      // Crear nueva conversación
      const newConv = {
        id: Date.now(),
        title: input.substring(0, 50) || 'Nueva conversación',
        date: new Date().toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'short' 
        }),
        userInput: input,
        generatedIdea: idea,
        uxPrinciple: principle,
        timestamp: Date.now()
      };
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversationId(newConv.id);
    } else {
      // Actualizar conversación existente
      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { 
              ...conv, 
              userInput: input,
              generatedIdea: idea, 
              uxPrinciple: principle,
              title: input.substring(0, 50) || conv.title,
              timestamp: Date.now()
            }
          : conv
      ));
    }
  };

  // Nueva conversación
  const handleNewChat = () => {
    setCurrentConversationId(null);
    setUserInput('');
    setGeneratedIdea('');
    setUxPrinciple('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seleccionar conversación
  const handleSelectConversation = (id) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentConversationId(id);
      loadConversation(conv);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    }
  };

  // Eliminar conversación
  const handleDeleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === currentConversationId) {
      handleNewChat();
    }
    // Limpiar localStorage si no quedan conversaciones
    const remaining = conversations.filter(c => c.id !== id);
    if (remaining.length === 0) {
      localStorage.removeItem('ideaboost-conversations');
    }
  };

  // Renombrar conversación
  const handleRenameConversation = (id, newTitle) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, title: newTitle } : conv
    ));
  };

  // Ejemplos de prompts guiados - Ley de Miller (máximo 3 opciones para mejor comprensión)
  const promptExamples = [
    { 
      id: 1, 
      text: "Campaña de marketing para redes sociales", 
      icon: "📱",
      // Respuesta con Ley de Jakob + Estilo Conversacional guiado
      response: `📱 **Campaña de Marketing para Redes Sociales**\n\n**Tu estrategia personalizada:**\n\nCrea "Los 7 Días del Cambio" - una campaña donde cada día de la semana reveles un beneficio diferente de tu producto usando el formato que ya funciona en redes:\n\n• **Lunes**: Video corto tipo TikTok mostrando el problema\n• **Martes**: Carrusel de Instagram con la solución paso a paso\n• **Miércoles**: Stories interactivos con encuestas\n• **Jueves**: Testimonial real de un cliente (contenido generado por usuarios)\n• **Viernes**: Behind the scenes en Reels\n• **Sábado**: Infografía compartible en formato PDF\n• **Domingo**: Live Q&A respondiendo dudas\n\n**¿Por qué funciona?** Usa formatos que tu audiencia ya conoce y ama (Ley de Jakob: los usuarios prefieren lo familiar), mantiene expectativa diaria, y genera contenido para todo un mes con una sola idea central.\n\n**Próximo paso:** Elige tu día 1 y crea el primer video de 30 segundos.`,
      principle: "Ley de Jakob + Conversacional guiado"
    },
    { 
      id: 2, 
      text: "Nombre creativo para una startup", 
      icon: "💡",
      // Respuesta con Ley de Prägnanz + Estilo Minimalista
      response: `💡 **Nombre Creativo para tu Startup**\n\n**Aquí tienes 3 opciones poderosas:**\n\n1. **"Flowly"** - Para apps de productividad\n   → Simple, memorable, sugiere fluidez\n   → Disponible en .com, .io, .app\n\n2. **"Zento"** - Para soluciones B2B\n   → Zen + momentum, profesional pero accesible\n   → Fácil de pronunciar en cualquier idioma\n\n3. **"Sparkkit"** - Para herramientas creativas\n   → Evoca creatividad e innovación\n   → "Kit" sugiere un conjunto completo de herramientas\n\n**Criterios aplicados:**\n✓ Máximo 2-3 sílabas (Ley de Prägnanz: preferimos lo simple)\n✓ Fácil de escribir sin errores\n✓ Sin significados negativos en otros idiomas\n✓ Evoca el beneficio, no la función técnica\n\n**Mi recomendación:** Flowly - es el más memorable y tiene mejor disponibilidad de dominio.\n\n**Valídalo:** Busca el dominio ahora y pregúntale a 5 personas si lo pueden deletrear después de escucharlo una vez.`,
      principle: "Ley de Prägnanz + Minimalista"
    },
    { 
      id: 3, 
      text: "Ideas para contenido de blog", 
      icon: "✍️",
      // Respuesta con Ley de Hick + Estilo Contextual adaptativo
      response: `✍️ **Ideas para Contenido de Blog que Convierte**\n\n**Estrategia de 3 pilares (Ley de Hick - pocas opciones, mejor decisión):**\n\n**PILAR 1: Resuelve problemas urgentes**\n• "Cómo resolver [problema específico] en menos de 10 minutos"\n• "5 errores que cometes con [tema] (y cómo evitarlos)"\n• "Guía paso a paso: [proceso complejo] simplificado"\n\n**PILAR 2: Cuenta historias reales**\n• "Cómo pasamos de [punto A] a [punto B]: nuestra historia"\n• "El día que todo salió mal y qué aprendimos"\n• "Cliente destacado: [nombre] y su transformación"\n\n**PILAR 3: Posiciónate como experto**\n• "Tendencias de [tu industria] para 2026: mi análisis"\n• "Mi proceso exacto para [logro específico]"\n• "Herramientas que uso diariamente (y por qué)"\n\n**Plan de acción:**\n→ Semana 1: Escribe 1 artículo del Pilar 1 (genera tráfico)\n→ Semana 2: Comparte 1 historia del Pilar 2 (genera conexión)\n→ Semana 3: Publica expertise del Pilar 3 (genera autoridad)\n\n**Repite el ciclo.** En 3 meses tendrás 12 artículos balanceados que atraen, conectan y convierten.\n\n**Empieza hoy:** Elige el problema más frecuente que te preguntan tus clientes y escribe 300 palabras sobre cómo resolverlo.`,
      principle: "Ley de Hick + Contextual adaptativo"
    }
  ];

  const handlePromptClick = (promptText, promptId) => {
    setUserInput(promptText);
    setError('');
    
    // Precargar la respuesta específica del prompt
    const selectedPrompt = promptExamples.find(p => p.id === promptId);
    if (selectedPrompt) {
      // Auto-submit cuando seleccionan un prompt recomendado
      setTimeout(() => {
        handleSubmitWithPrompt(selectedPrompt);
      }, 100);
    }
  };

  const handleSubmitWithPrompt = (prompt) => {
    setError('');
    setIsLoading(true);

    // Simulación de generación de IA con respuesta específica
    setTimeout(() => {
      setGeneratedIdea(prompt.response);
      setUxPrinciple(prompt.principle);
      setIsLoading(false);
      // Guardar en conversaciones
      saveCurrentConversation(prompt.response, prompt.principle, userInput);
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación - Mensaje de error claro y útil (Estilo: Conversacional guiado)
    if (!userInput.trim()) {
      setError('Necesito saber qué tipo de idea buscas. Escribe algo o elige un ejemplo.');
      return;
    }

    if (userInput.trim().length < 5) {
      setError('Cuéntame un poco más. Necesito al menos 5 caracteres para generar una buena idea.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulación de generación de IA para texto personalizado
    setTimeout(() => {
      const ideas = [
        `💡 **Idea creativa basada en "${userInput}"**\n\n**Tu propuesta personalizada:**\n\nCrea una experiencia interactiva donde los usuarios puedan explorar este concepto a través de storytelling visual. Aquí está tu plan de acción:\n\n**Fase 1 - Investigación (Semana 1)**\n• Identifica las 3 necesidades principales de tu audiencia\n• Analiza qué hace tu competencia (y encuentra el hueco)\n• Crea un mapa de empatía de tu usuario ideal\n\n**Fase 2 - Conceptualización (Semana 2)**\n• Desarrolla 3 conceptos diferentes\n• Valida con 5-10 usuarios potenciales\n• Elige el concepto que genere más emoción\n\n**Fase 3 - Ejecución (Semana 3-4)**\n• Crea un MVP (Mínimo Producto Viable)\n• Lanza con early adopters\n• Itera según feedback real\n\n**¿Por qué funciona?** Utiliza elementos gamificados para aumentar el engagement y considera implementar un sistema de recompensas que motive la participación continua.\n\n**Tu próximo paso:** Define hoy mismo quién es tu usuario ideal y qué problema específico le resuelves.`,
        `🚀 **Propuesta innovadora para "${userInput}"**\n\n**Estrategia multi-canal lista para implementar:**\n\nDesarrolla una campaña que combine contenido generado por usuarios con IA generativa. Este es tu roadmap:\n\n**CANAL 1: Redes Sociales**\n→ Crea un hashtag único y memorable\n→ Incentiva a usuarios a compartir sus experiencias\n→ Republica el mejor contenido diariamente\n\n**CANAL 2: Email Marketing**\n→ Serie de 5 emails contando una historia progresiva\n→ Cada email revela una nueva capa del concepto\n→ Call-to-action claro en cada mensaje\n\n**CANAL 3: Contenido Educativo**\n→ Mini-curso gratuito de 3 días\n→ Webinar interactivo semanal\n→ Guía descargable en PDF premium\n\n**El factor diferenciador:** Enfócate en crear momentos memorables que conecten emocionalmente con tu audiencia y genera conversaciones auténticas.\n\n**Métricas de éxito:** Mide engagement rate, shares orgánicos, y tasa de conversión de asistentes a webinar.\n\n**Lanza en:** 2 semanas con el contenido del Canal 1, luego escala.`,
        `✨ **Concepto original inspirado en "${userInput}"**\n\n**Transformación paso a paso:**\n\nDiseña una serie de micro-experiencias que transformen lo ordinario en extraordinario. Aquí está tu framework:\n\n**EXPERIENCIA 1: El Primer Contacto**\n• Crea un onboarding interactivo de 60 segundos\n• Personaliza el mensaje según de dónde viene el usuario\n• Sorprende con un detalle inesperado (un GIF, un easter egg)\n\n**EXPERIENCIA 2: El Momento "Ajá"**\n• Identifica el momento donde el usuario entiende el valor\n• Amplifica ese momento con animaciones, sonido, o celebración\n• Hazlo compartible socialmente (screenshot-worthy)\n\n**EXPERIENCIA 3: La Conexión Continua**\n• Implementa notificaciones inteligentes (no spam)\n• Recompensas por logros pequeños pero significativos\n• Contenido exclusivo para usuarios recurrentes\n\n**Principios aplicados:**\n✓ Diseño centrado en el usuario (Don Norman)\n✓ Feedback inmediato en cada interacción\n✓ Reducción de fricción cognitiva (Ley de Tesler)\n\n**Touchpoints estratégicos:** Mapea cada punto de contacto y pregúntate "¿cómo puedo hacer esto 10% más memorable?"\n\n**Implementa primero:** La Experiencia 1 - tienes una sola oportunidad para la primera impresión.`
      ];
      
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
      setGeneratedIdea(randomIdea);
      setUxPrinciple("Ley de Tesler + Tono empático");
      setIsLoading(false);
      // Guardar en conversaciones
      saveCurrentConversation(randomIdea, "Ley de Tesler + Tono empático", userInput);
    }, 2000);
  };

  // Efecto para scroll automático cuando se genera una idea
  useEffect(() => {
    if (generatedIdea && !isLoading && resultRef.current) {
      // Pequeño delay para asegurar que el contenido se renderizó
      setTimeout(() => {
        resultRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [generatedIdea, isLoading]);

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App */}
      <div className={`app-container ${sidebarOpen ? 'with-sidebar' : ''}`}>
        {/* Fondo animado futurista */}
        <div className="animated-background"></div>
        
        <div className="content-wrapper">
          {/* 1. Título de la aplicación - Estilo: Minimalista */}
          <header className="app-header">
            <div className="logo-container">
              <span className="logo-icon">⚡</span>
              <h1 className="app-title">IdeaBoost</h1>
            </div>
            <p className="app-subtitle">Impulsa tu creatividad con IA</p>
          </header>

          <main className="main-content">
            <form onSubmit={handleSubmit} className="idea-form">
              {/* 2. Microcopy del campo de entrada - Estilo: Conversacional guiado */}
              <div className="input-section">
                <label htmlFor="userInput" className="input-label">
                  ¿Qué idea necesitas generar hoy?
                </label>
              <textarea
                id="userInput"
                className={`input-field ${error ? 'input-error' : ''}`}
                placeholder="Ejemplo: 'Una campaña publicitaria para un producto ecológico' o elige una sugerencia abajo..."
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  setError('');
                }}
                rows={4}
              />
              
              {/* 5. Mensaje de error claro y útil - Estilo: Tono empático */}
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* 3. Microcopy de 3 ejemplos de prompts guiados - Ley de Hick (reducir opciones) */}
            <div className="prompts-section">
              <p className="prompts-label">O elige una de estas ideas populares:</p>
              <div className="prompts-grid">
                {promptExamples.map((prompt) => (
                  <button
                    key={prompt.id}
                    type="button"
                    className="prompt-card"
                    onClick={() => handlePromptClick(prompt.text, prompt.id)}
                  >
                    <span className="prompt-icon">{prompt.icon}</span>
                    <span className="prompt-text">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Texto para un botón principal (CTA) - Ley de Fitts (accesibilidad) */}
            <button 
              type="submit" 
              className={`cta-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generando tu idea...
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  Generar idea creativa
                </>
              )}
            </button>
          </form>

          {/* 6. Mensaje de retroalimentación después de generar una idea - Estilo: Contextual adaptativo */}
          {generatedIdea && !isLoading && (
            <div className="result-section" ref={resultRef}>
              <div className="result-header">
                <h2 className="result-title">¡Tu idea está lista! 🎉</h2>
                <p className="result-subtitle">Aquí está tu propuesta personalizada:</p>
                {uxPrinciple && (
                  <div className="ux-badge">
                    <span className="badge-icon">📚</span>
                    <span className="badge-text">Aplicando: {uxPrinciple}</span>
                  </div>
                )}
              </div>
              
              <div className="result-content">
                <div className="idea-card">
                  <p className="idea-text">{generatedIdea}</p>
                </div>
                
                <div className="result-actions">
                  <button 
                    className="secondary-button"
                    onClick={handleNewChat}
                  >
                    Generar otra idea
                  </button>
                  <button 
                    className="secondary-button"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedIdea);
                      // Feedback visual de copiado
                      const btn = event.target;
                      const originalText = btn.textContent;
                      btn.textContent = '✓ ¡Copiado!';
                      setTimeout(() => {
                        btn.textContent = originalText;
                      }, 2000);
                    }}
                  >
                    📋 Copiar idea
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Potenciado por IA • Diseñado con principios de UX Writing</p>
        </footer>
      </div>
    </div>
    </>
  );
}

export default App;
