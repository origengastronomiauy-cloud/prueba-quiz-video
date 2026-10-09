import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, Volume2, Shield, Award, CheckCircle2, AlertTriangle, ExternalLink, Sparkles, Film, HelpCircle } from 'lucide-react';

interface OrigenMobilePreviewProps {
  customApiUrl?: string;
  useLiveApi?: boolean;
}

interface Question {
  pregunta: string;
  A: string;
  B: string;
  C: string;
  correct: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    pregunta: "¿Qué variedad de uva autóctona protagoniza nuestro maridaje insignia?",
    A: "Criolla Grande",
    B: "Malbec de Altura",
    C: "Torrontés Riojano",
    correct: "B"
  },
  {
    pregunta: "¿En qué siglo se originaron las vasijas de fermentación utilizadas en esta parada?",
    A: "Siglo XVIII",
    B: "Siglo XIX",
    C: "Siglo XX",
    correct: "B"
  },
  {
    pregunta: "¿Cuál es el tiempo de maduración en barrica de roble francés para nuestra reserva?",
    A: "6 meses",
    B: "12 meses",
    C: "18 meses",
    correct: "C"
  }
];

export const OrigenMobilePreview: React.FC<OrigenMobilePreviewProps> = ({
  customApiUrl = '',
  useLiveApi = false,
}) => {
  // Configuración de prueba
  const [modoPrueba, setModoPrueba] = useState<'trivia' | 'video'>('trivia');
  const [paradaPrueba, setParadaPrueba] = useState<string>('1');

  // Estados internos del flujo ORIGEN (idénticos a la app real)
  const [currentScreen, setCurrentScreen] = useState<'login' | 'video' | 'instrucciones' | 'trivia' | 'premios' | 'error' | 'final'>('login');
  const [claveInput, setClaveInput] = useState('ORIGEN2026');
  const [msgText, setMsgText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Trivia states
  const [preguntas, setPreguntas] = useState<Question[]>(MOCK_QUESTIONS);
  const [indice, setIndice] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: { opc: string; isCorrect: boolean } }>({});
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // Video data state
  const [videoData, setVideoData] = useState<{ lugar: string; url: string }>({
    lugar: "Parada 1: Cava Histórica subterránea",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  });

  // Final screen states
  const [premioElegido, setPremioElegido] = useState<string>('');
  const [premioUrl, setPremioUrl] = useState<string>('');

  // Reiniciar flujo
  const reiniciar = () => {
    setCurrentScreen('login');
    setMsgText('');
    setIndice(0);
    setAciertos(0);
    setSelectedOption({});
    setButtonsDisabled(false);
  };

  const manejarInicio = async () => {
    if (!claveInput.trim()) {
      setMsgText('Ingresa tu código de acceso.');
      return;
    }

    setMsgText('Validando código...');
    setIsLoading(true);

    if (useLiveApi && customApiUrl && customApiUrl !== 'URL_AQUI') {
      try {
        const resp = await fetch(customApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'validarClave',
            clave: claveInput.trim(),
            parada: paradaPrueba,
            modo: modoPrueba
          })
        });
        const res = await resp.json();
        setIsLoading(false);
        renderRespuesta(res);
        return;
      } catch (err: any) {
        setIsLoading(false);
        setMsgText('Error al conectar con la API de Apps Script: ' + err.message);
        return;
      }
    }

    // Modo Simulación instantánea para validación visual
    setTimeout(() => {
      setIsLoading(false);
      if (claveInput.trim().toUpperCase() === 'ERROR') {
        setMsgText('Código incorrecto.');
        return;
      }

      if (modoPrueba === 'video') {
        renderRespuesta({
          tipo: 'video',
          lugar: `Parada ${paradaPrueba}: Cava de Reserva ORIGEN`,
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          urlIphone: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        });
      } else {
        renderRespuesta({
          tipo: 'trivia',
          data: MOCK_QUESTIONS
        });
      }
    }, 450);
  };

  const renderRespuesta = (res: any) => {
    if (res.error) {
      setMsgText(res.error);
      return;
    }
    setMsgText('');

    if (res.tipo === 'video') {
      const isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      setVideoData({
        lugar: res.lugar || 'Parada Cultural ORIGEN',
        url: isIphone && res.urlIphone ? res.urlIphone : res.url
      });
      setCurrentScreen('video');
    } else if (res.tipo === 'trivia') {
      setPreguntas(res.data && res.data.length > 0 ? res.data : MOCK_QUESTIONS);
      setIndice(0);
      setAciertos(0);
      setCurrentScreen('instrucciones');
    }
  };

  const evaluarRespuesta = (opc: string) => {
    if (buttonsDisabled) return;
    setButtonsDisabled(true);

    const q = preguntas[indice];
    const esCorrecta = opc === q.correct;
    let nuevosAciertos = aciertos;

    if (esCorrecta) {
      nuevosAciertos = aciertos + 1;
      setAciertos(nuevosAciertos);
    }

    setSelectedOption(prev => ({
      ...prev,
      [indice]: { opc, isCorrect: esCorrecta }
    }));

    setTimeout(() => {
      setButtonsDisabled(false);
      const siguienteIndice = indice + 1;
      if (siguienteIndice < preguntas.length) {
        setIndice(siguienteIndice);
      } else {
        if (nuevosAciertos === preguntas.length) {
          setCurrentScreen('premios');
        } else {
          setCurrentScreen('error');
        }
      }
    }, 850);
  };

  const finalizarPremio = (premio: string, url: string) => {
    setPremioElegido(premio);
    setPremioUrl(url);
    setCurrentScreen('final');

    if (useLiveApi && customApiUrl && customApiUrl !== 'URL_AQUI') {
      fetch(customApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'guardarResultado',
          usuario: claveInput,
          aciertos: aciertos,
          premio: premio
        })
      }).catch(console.error);
    }
  };

  const currentQ = preguntas[indice] || MOCK_QUESTIONS[0];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      {/* Controles de depuración e inspección rápida */}
      <div className="w-full mb-3 px-3 py-2.5 rounded-xl bg-[#14141c]/90 border border-[#dfb763]/25 backdrop-blur-md flex items-center justify-between text-xs text-[#a3a3b2]">
        <div className="flex items-center gap-2">
          <span className="text-[#dfb763] font-semibold flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> Simulador:
          </span>
          <select
            value={modoPrueba}
            onChange={(e) => {
              setModoPrueba(e.target.value as any);
              reiniciar();
            }}
            className="bg-[#0b0b0e] text-[#f0f0f4] border border-[#2a2a38] rounded-md px-2 py-0.5 outline-none text-xs focus:border-[#dfb763]"
          >
            <option value="trivia">Modo Trivia (?modo=trivia)</option>
            <option value="video">Modo Video (?parada=1)</option>
          </select>
        </div>

        <button
          onClick={reiniciar}
          className="flex items-center gap-1 text-[#dfb763] hover:text-[#f3df9f] px-2 py-1 rounded-md hover:bg-[#dfb763]/10 transition-colors"
          title="Reiniciar flujo"
        >
          <RefreshCw className="w-3 h-3" /> Reiniciar
        </button>
      </div>

      {/* Frame de Celular Premium */}
      <div className="relative w-full rounded-[38px] p-2.5 bg-gradient-to-b from-[#252530] via-[#16161f] to-[#0c0c11] shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(223,183,99,0.12)] border border-[#dfb763]/30">
        
        {/* Notch / Dynamic Island del smartphone */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#07070a] rounded-full z-30 flex items-center justify-end px-3">
          <div className="w-2 h-2 rounded-full bg-[#1b1b22] border border-[#2a2a35]" />
        </div>

        {/* Pantalla Interna con exactamente el mismo CSS y DOM que la versión estática */}
        <div 
          className="relative w-full min-h-[580px] rounded-[30px] overflow-hidden flex flex-col justify-center items-center p-5 text-center text-white"
          style={{
            background: 'radial-gradient(circle at 50% 12%, rgba(223, 183, 99, 0.14) 0%, transparent 60%), #0b0b0e'
          }}
        >
          {/* Tarjeta Glassmorphic de la app */}
          <div 
            className="w-full rounded-[24px] p-6 sm:p-7 relative transition-all duration-300"
            style={{
              background: 'rgba(18, 18, 24, 0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(223, 183, 99, 0.22)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(223, 183, 99, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Línea superior dorada */}
            <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#dfb763]/60 to-transparent" />

            {/* PANTALLA 1: LOGIN */}
            {currentScreen === 'login' && (
              <div id="pantalla-login" className="animate-fadeIn">
                <img
                  src="https://res.cloudinary.com/f8l7nucq/image/upload/v1784049017/Origen_logo_p1hlex.png"
                  alt="Logo ORIGEN"
                  className="w-44 max-w-[80%] mx-auto mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                />
                <h3 className="font-serif-luxury text-3xl font-semibold tracking-wide text-white mb-4">
                  Acceso
                </h3>
                <input
                  type="text"
                  id="clave"
                  value={claveInput}
                  onChange={(e) => setClaveInput(e.target.value)}
                  placeholder="Ingresa tu código..."
                  className="w-full py-3.5 px-4 mb-4 text-center text-white rounded-xl outline-none font-sans-clean tracking-wider text-base transition-all duration-200 border border-white/10 bg-[#0b0b0e]/90 focus:border-[#dfb763] focus:shadow-[0_0_0_3px_rgba(223,183,99,0.2)]"
                />
                <div id="msg" className="text-[#e05244] font-semibold text-xs mb-3 min-h-[18px]">
                  {msgText}
                </div>
                <button
                  className="btn-luxury w-full py-3.5 px-6 rounded-xl font-sans-clean font-bold text-xs uppercase tracking-widest text-[#0b0b0e] cursor-pointer transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #ecd189 0%, #dfb763 35%, #c29543 85%, #916e28 100%)',
                    boxShadow: '0 6px 20px rgba(223, 183, 99, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onClick={manejarInicio}
                  disabled={isLoading}
                >
                  {isLoading ? 'Verificando...' : 'Acceder'}
                </button>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-[#717182]">
                  <Shield className="w-3 h-3 text-[#dfb763]/70" />
                  <span>Experiencia exclusiva para invitados</span>
                </div>
              </div>
            )}

            {/* PANTALLA 2: REPRODUCTOR DE VIDEO */}
            {currentScreen === 'video' && (
              <div id="pantalla-video" className="animate-fadeIn">
                <div id="video-container">
                  <h3 className="font-serif-luxury text-2xl font-semibold tracking-wide text-white mb-4">
                    {videoData.lugar}
                  </h3>
                  <div className="rounded-2xl overflow-hidden bg-black mb-5 shadow-[0_12px_32px_rgba(0,0,0,0.8)] border border-[#dfb763]/25">
                    <video
                      src={videoData.url}
                      controls
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                      playsInline
                      preload="metadata"
                      className="w-full block"
                    />
                  </div>
                  <button
                    onClick={reiniciar}
                    className="w-full py-3 rounded-xl border border-[#dfb763]/30 text-xs text-[#dfb763] hover:bg-[#dfb763]/10 transition-colors uppercase tracking-wider font-semibold"
                  >
                    Volver al inicio
                  </button>
                </div>
              </div>
            )}

            {/* PANTALLA 3: INSTRUCCIONES DE TRIVIA */}
            {currentScreen === 'instrucciones' && (
              <div id="pantalla-instrucciones" className="animate-fadeIn">
                <img
                  src="https://res.cloudinary.com/f8l7nucq/image/upload/v1784049017/Origen_logo_p1hlex.png"
                  alt="Logo ORIGEN"
                  className="w-32 mx-auto mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                />
                <h3 className="font-serif-luxury text-3xl font-semibold tracking-wide text-white mb-2">
                  ¡Trivia!
                </h3>
                <p className="text-[#a3a3b2] text-sm leading-relaxed mb-6 font-sans-clean">
                  Si acertás todas las preguntas, tenés un premio exclusivo esperándote.
                </p>
                <button
                  className="btn-luxury w-full py-3.5 px-6 rounded-xl font-sans-clean font-bold text-xs uppercase tracking-widest text-[#0b0b0e] cursor-pointer transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #ecd189 0%, #dfb763 35%, #c29543 85%, #916e28 100%)',
                    boxShadow: '0 6px 20px rgba(223, 183, 99, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onClick={() => setCurrentScreen('trivia')}
                >
                  Comenzar Trivia
                </button>
              </div>
            )}

            {/* PANTALLA 4: TRIVIA INTERACTIVA */}
            {currentScreen === 'trivia' && (
              <div id="pantalla-trivia" className="animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-[#a3a3b2] mb-3">
                  <span className="font-serif-luxury tracking-widest text-[#dfb763]">ORIGEN TRIVIA</span>
                  <span className="tabular-nums font-mono">Pregunta {indice + 1} de {preguntas.length}</span>
                </div>

                <h3 id="pregunta-texto" className="font-serif-luxury text-xl font-normal leading-snug text-white mb-5 min-h-[50px] flex items-center justify-center">
                  {currentQ.pregunta}
                </h3>

                <div id="opciones-botones" className="space-y-2.5">
                  {(['A', 'B', 'C'] as const).map((letra) => {
                    const sel = selectedOption[indice];
                    const estaSeleccionada = sel?.opc === letra;
                    
                    let bgStyle = 'rgba(22, 22, 30, 0.85)';
                    let borderStyle = 'rgba(223, 183, 99, 0.22)';
                    let textColor = '#f0f0f4';

                    if (estaSeleccionada) {
                      if (sel.isCorrect) {
                        bgStyle = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                        borderStyle = '#2ecc71';
                        textColor = '#ffffff';
                      } else {
                        bgStyle = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                        borderStyle = '#e74c3c';
                        textColor = '#ffffff';
                      }
                    }

                    return (
                      <button
                        key={letra}
                        disabled={buttonsDisabled}
                        onClick={() => evaluarRespuesta(letra)}
                        className="w-full py-3 px-4 rounded-xl text-left text-sm font-sans-clean transition-all duration-200 flex items-center gap-2"
                        style={{
                          background: bgStyle,
                          border: `1px solid ${borderStyle}`,
                          color: textColor,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                      >
                        <span className="font-bold text-[#dfb763]">{letra})</span>
                        <span className="flex-1">{currentQ[letra]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PANTALLA 5: PREMIOS */}
            {currentScreen === 'premios' && (
              <div id="pantalla-premios" className="animate-fadeIn">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#dfb763]/15 border border-[#dfb763]/40 flex items-center justify-center text-[#dfb763]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-semibold text-white mb-2">
                  ¡Felicitaciones, acertaste todo!
                </h3>
                <p className="text-[#a3a3b2] text-sm mb-4 font-sans-clean">
                  Elige tu premio exclusivo:
                </p>
                <div className="premios-grid flex justify-center gap-3 flex-wrap my-4">
                  <div 
                    onClick={() => finalizarPremio('Premio 1 - Degustación de Copas de Autor', 'https://res.cloudinary.com/f8l7nucq/image/upload/v1784051080/two-dark-alcoholic-drinks-on-rustic-wooden-table-2026-03-24-02-58-58-utc_qf7qfq.jpg')}
                    className="group cursor-pointer text-center"
                  >
                    <img
                      src="https://res.cloudinary.com/f8l7nucq/image/upload/v1784051080/two-dark-alcoholic-drinks-on-rustic-wooden-table-2026-03-24-02-58-58-utc_qf7qfq.jpg"
                      alt="Premio 1"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-[#dfb763]/30 group-hover:border-[#dfb763] group-hover:scale-105 transition-all duration-300 shadow-lg"
                    />
                    <span className="block text-[11px] text-[#a3a3b2] mt-1 group-hover:text-[#dfb763]">Bebida</span>
                  </div>

                  <div 
                    onClick={() => finalizarPremio('Premio 2 - Porción Gastronómica Artesanal', 'https://res.cloudinary.com/f8l7nucq/image/upload/v1784051076/pepperoni-pizza-freshly-sliced-and-ready-to-eat-2026-03-17-04-06-54-utc_ypzkdm.jpg')}
                    className="group cursor-pointer text-center"
                  >
                    <img
                      src="https://res.cloudinary.com/f8l7nucq/image/upload/v1784051076/pepperoni-pizza-freshly-sliced-and-ready-to-eat-2026-03-17-04-06-54-utc_ypzkdm.jpg"
                      alt="Premio 2"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-[#dfb763]/30 group-hover:border-[#dfb763] group-hover:scale-105 transition-all duration-300 shadow-lg"
                    />
                    <span className="block text-[11px] text-[#a3a3b2] mt-1 group-hover:text-[#dfb763]">Plato</span>
                  </div>

                  <div 
                    onClick={() => finalizarPremio('Premio 3 - Distinción Especial ORIGEN', 'https://res.cloudinary.com/f8l7nucq/image/upload/v1784051065/shekel-money-bag-and-shield-on-blue-background-2026-03-24-14-14-10-utc_sotjxd.jpg')}
                    className="group cursor-pointer text-center"
                  >
                    <img
                      src="https://res.cloudinary.com/f8l7nucq/image/upload/v1784051065/shekel-money-bag-and-shield-on-blue-background-2026-03-24-14-14-10-utc_sotjxd.jpg"
                      alt="Premio 3"
                      className="w-24 h-24 object-cover rounded-xl border-2 border-[#dfb763]/30 group-hover:border-[#dfb763] group-hover:scale-105 transition-all duration-300 shadow-lg"
                    />
                    <span className="block text-[11px] text-[#a3a3b2] mt-1 group-hover:text-[#dfb763]">Bono</span>
                  </div>
                </div>
              </div>
            )}

            {/* PANTALLA 6: ERROR TRIVIA */}
            {currentScreen === 'error' && (
              <div id="pantalla-error" className="animate-fadeIn">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#e05244]/15 border border-[#e05244]/40 flex items-center justify-center text-[#e05244]">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-2xl font-semibold text-white mb-2">
                  Casi lo logras...
                </h3>
                <p id="texto-error" className="text-white font-medium text-sm mb-1">
                  Obtuviste {aciertos} de {preguntas.length} aciertos.
                </p>
                <p className="text-[#a3a3b2] text-xs mb-5 font-sans-clean">
                  Para obtener un premio, necesitas acertar todas las preguntas.
                </p>
                <button
                  className="btn-luxury w-full py-3.5 px-6 rounded-xl font-sans-clean font-bold text-xs uppercase tracking-widest text-[#0b0b0e] cursor-pointer transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #ecd189 0%, #dfb763 35%, #c29543 85%, #916e28 100%)',
                    boxShadow: '0 6px 20px rgba(223, 183, 99, 0.28)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                  onClick={reiniciar}
                >
                  Volver a intentar
                </button>
              </div>
            )}

            {/* PANTALLA 7: FINAL (DESCARGA) */}
            {currentScreen === 'final' && (
              <div id="pantalla-final" className="animate-fadeIn">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#27ae60]/20 border border-[#27ae60]/40 flex items-center justify-center text-[#2ecc71]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 id="texto-final" className="font-serif-luxury text-2xl font-semibold text-white mb-3 leading-snug">
                  ¡Has seleccionado: {premioElegido || 'Tu Premio'}!
                </h3>
                <img
                  id="img-final"
                  src={premioUrl}
                  alt="Tu Premio"
                  className="premio-final w-44 h-44 object-cover rounded-2xl mx-auto my-4 border-2 border-[#dfb763] shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_25px_rgba(223,183,99,0.25)]"
                />
                <a
                  id="btn-descarga"
                  href={premioUrl}
                  download="Premio_Origen.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-luxury inline-block w-full py-3.5 px-6 rounded-xl font-sans-clean font-bold text-xs uppercase tracking-widest text-[#0b0b0e] cursor-pointer transition-all duration-200 no-underline"
                  style={{
                    background: 'linear-gradient(135deg, #ecd189 0%, #dfb763 35%, #c29543 85%, #916e28 100%)',
                    boxShadow: '0 6px 20px rgba(223, 183, 99, 0.28)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  Descargar Premio
                </a>
                <button
                  onClick={reiniciar}
                  className="mt-3 text-[11px] text-[#a3a3b2] hover:text-[#dfb763] transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Barra inferior decorativa del teléfono */}
        <div className="w-32 h-1 bg-white/20 rounded-full mx-auto mt-2" />
      </div>
    </div>
  );
};
