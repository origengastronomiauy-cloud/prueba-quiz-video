import React, { useState } from 'react';
import { OrigenMobilePreview } from './components/OrigenMobilePreview.tsx';
import { CodeViewer } from './components/CodeViewer.tsx';
import { 
  Sparkles, 
  Smartphone, 
  Code2, 
  Layout, 
  Globe, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split');
  const [customApiUrl, setCustomApiUrl] = useState<string>('');
  const [useLiveApi, setUseLiveApi] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f4f4f7] flex flex-col font-sans-clean selection:bg-[#dfb763]/30 selection:text-[#f3df9f]">
      {/* Barra de Navegación Superior de Lujo */}
      <header className="border-b border-[#dfb763]/20 bg-[#0f0f14]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Marca / Logotipo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ecd189] via-[#dfb763] to-[#916e28] p-[1px] shadow-[0_0_15px_rgba(223,183,99,0.3)]">
              <div className="w-full h-full bg-[#0b0b0e] rounded-[11px] flex items-center justify-center">
                <span className="font-serif-luxury font-bold text-[#dfb763] text-lg leading-none">O</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xl font-semibold tracking-wider text-white">
                  ORIGEN
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#dfb763] bg-[#dfb763]/10 border border-[#dfb763]/30 px-2 py-0.5 rounded-full">
                  Cultura & Gastronomía
                </span>
              </div>
              <p className="text-[11px] text-[#8e8e9e] hidden sm:block">
                Rediseño Premium para GitHub Pages + Google Apps Script REST API
              </p>
            </div>
          </div>

          {/* Selector de modo de vista */}
          <div className="flex items-center gap-1 p-1 bg-[#15151e] rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('split')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'split'
                  ? 'bg-[#dfb763] text-[#0b0b0e] font-semibold shadow-sm'
                  : 'text-[#9e9eaf] hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Vista Dividida</span>
            </button>

            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-[#dfb763] text-[#0b0b0e] font-semibold shadow-sm'
                  : 'text-[#9e9eaf] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simulador</span>
            </button>

            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'code'
                  ? 'bg-[#dfb763] text-[#0b0b0e] font-semibold shadow-sm'
                  : 'text-[#9e9eaf] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código Listo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Franja de estado informativo & Verificación de requerimientos */}
      <div className="bg-gradient-to-r from-[#14141d] via-[#161622] to-[#14141d] border-b border-[#dfb763]/10 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[#a0a0b0]">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-[#2ecc71]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">IDs de HTML Intactos</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 text-[#2ecc71]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">Migración fetch() lista</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 text-[#2ecc71]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">Estética Obsidian & Oro</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5 text-[#2ecc71]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-medium">Apps Script doPost / doGet API</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#78788a]">Prueba de API Real:</span>
            <input
              type="text"
              placeholder="Pega tu URL de Apps Script (opcional)"
              value={customApiUrl}
              onChange={(e) => {
                setCustomApiUrl(e.target.value);
                if (e.target.value) setUseLiveApi(true);
              }}
              className="bg-[#0b0b0e] border border-[#2a2a35] text-white text-[11px] px-2.5 py-1 rounded-lg w-52 sm:w-64 outline-none focus:border-[#dfb763]"
            />
            {customApiUrl && (
              <label className="flex items-center gap-1 text-[11px] text-[#dfb763] cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLiveApi}
                  onChange={(e) => setUseLiveApi(e.target.checked)}
                  className="rounded accent-[#dfb763]"
                />
                <span>Usar en vivo</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Área de Trabajo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Simulador Móvil Interactivo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white font-serif-luxury tracking-wide">
                    Vista Previa en Tiempo Real
                  </h2>
                  <p className="text-xs text-[#8c8c9e]">
                    Interactúa con el flujo de acceso, trivia y video
                  </p>
                </div>
              </div>

              <OrigenMobilePreview
                customApiUrl={customApiUrl}
                useLiveApi={useLiveApi}
              />
            </div>

            {/* Columna Derecha: Visor y Exportador de Código */}
            <div className="lg:col-span-7 h-[740px] flex flex-col">
              <div className="mb-3">
                <h2 className="text-base font-semibold text-white font-serif-luxury tracking-wide">
                  Código Listo para Producción
                </h2>
                <p className="text-xs text-[#8c8c9e]">
                  Copia y pega directamente en GitHub y Google Apps Script
                </p>
              </div>

              <CodeViewer />
            </div>
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="max-w-md mx-auto py-4">
            <OrigenMobilePreview
              customApiUrl={customApiUrl}
              useLiveApi={useLiveApi}
            />
          </div>
        )}

        {viewMode === 'code' && (
          <div className="h-[780px]">
            <CodeViewer />
          </div>
        )}
      </main>

      {/* Pie de página con créditos y guía rápida */}
      <footer className="border-t border-[#dfb763]/15 bg-[#0a0a0d] py-5 px-4 text-center text-xs text-[#6e6e7d]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-[#dfb763] font-semibold text-sm">ORIGEN</span>
            <span>· Experiencia Gastronómica & Cultural</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#8e8e9e]">
            <span>Optimizado para GitHub Pages + Google Apps Script API</span>
            <span aria-hidden="true">·</span>
            <span>Estilos Modo Oscuro Profundo (#0b0b0e) y Oro (#dfb763)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
