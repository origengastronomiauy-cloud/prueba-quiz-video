import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Server, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { FRONTEND_HTML_CODE, BACKEND_APPS_SCRIPT_CODE } from '../data/templates.ts';

export const CodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'frontend' | 'backend' | 'guide'>('frontend');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copiarTexto = (texto: string, tabId: string) => {
    navigator.clipboard.writeText(texto);
    setCopiedTab(tabId);
    setTimeout(() => {
      setCopiedTab(null);
    }, 2000);
  };

  const descargarArchivo = (contenido: string, nombreArchivo: string, tipoMime: string) => {
    const blob = new Blob([contenido], { type: tipoMime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#121218]/90 rounded-2xl border border-[#dfb763]/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
      {/* Encabezado de pestañas */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#dfb763]/15 px-4 py-3 bg-[#0d0d12]">
        <div className="flex items-center gap-1.5 p-1 bg-[#181822] rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('frontend')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'frontend'
                ? 'bg-[#dfb763] text-[#0b0b0e] shadow-sm font-semibold'
                : 'text-[#a3a3b2] hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Frontend (index.html)</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'backend'
                ? 'bg-[#dfb763] text-[#0b0b0e] shadow-sm font-semibold'
                : 'text-[#a3a3b2] hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Backend (Code.gs)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'guide'
                ? 'bg-[#dfb763] text-[#0b0b0e] shadow-sm font-semibold'
                : 'text-[#a3a3b2] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía de Despliegue</span>
          </button>
        </div>

        {/* Acciones de descarga y copia */}
        {activeTab !== 'guide' && (
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => {
                if (activeTab === 'frontend') {
                  descargarArchivo(FRONTEND_HTML_CODE, 'index.html', 'text/html');
                } else {
                  descargarArchivo(BACKEND_APPS_SCRIPT_CODE, 'Code.gs', 'text/javascript');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#dfb763] border border-[#dfb763]/30 hover:bg-[#dfb763]/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar {activeTab === 'frontend' ? 'index.html' : 'Code.gs'}</span>
            </button>

            <button
              onClick={() => {
                const codeToCopy = activeTab === 'frontend' ? FRONTEND_HTML_CODE : BACKEND_APPS_SCRIPT_CODE;
                copiarTexto(codeToCopy, activeTab);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0b0b0e] bg-gradient-to-r from-[#ecd189] to-[#dfb763] hover:from-[#f3df9f] hover:to-[#ecd189] transition-all shadow-sm"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Contenido según pestaña */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs text-[#d1d1dc]">
        {activeTab === 'frontend' && (
          <div>
            <div className="mb-3 p-3 bg-[#181824] rounded-xl border border-[#dfb763]/20 flex items-start gap-2 text-xs font-sans text-[#a3a3b2]">
              <Sparkles className="w-4 h-4 text-[#dfb763] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Instrucciones para GitHub Pages:</strong>
                Guarda este archivo como <code className="text-[#dfb763]">index.html</code> en la raíz de tu repositorio de GitHub. 
                Solo debes reemplazar <code className="text-[#dfb763]">const API_URL = "URL_AQUI";</code> en la línea 320 con la URL de tu Web App de Apps Script.
              </div>
            </div>
            <pre className="p-4 bg-[#0a0a0d] rounded-xl border border-white/5 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {FRONTEND_HTML_CODE}
            </pre>
          </div>
        )}

        {activeTab === 'backend' && (
          <div>
            <div className="mb-3 p-3 bg-[#181824] rounded-xl border border-[#dfb763]/20 flex items-start gap-2 text-xs font-sans text-[#a3a3b2]">
              <Sparkles className="w-4 h-4 text-[#dfb763] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Instrucciones para Google Apps Script:</strong>
                Pega este código en el archivo <code className="text-[#dfb763]">Code.gs</code> de tu proyecto de Apps Script. 
                Despliega como <strong className="text-white">Aplicación web</strong> con acceso configurado para <strong className="text-white">"Cualquier persona"</strong>.
              </div>
            </div>
            <pre className="p-4 bg-[#0a0a0d] rounded-xl border border-white/5 overflow-x-auto whitespace-pre leading-relaxed select-all">
              {BACKEND_APPS_SCRIPT_CODE}
            </pre>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="font-sans text-sm text-[#c5c5d2] space-y-6 p-2 max-w-3xl">
            {/* Paso 1 */}
            <div className="bg-[#161620] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#dfb763]/20 text-[#dfb763] font-bold flex items-center justify-center text-xs border border-[#dfb763]/40">
                  1
                </span>
                <h4 className="text-base font-semibold text-white">
                  Desplegar el Backend en Google Apps Script (REST API)
                </h4>
              </div>
              <p className="text-xs text-[#a3a3b2] leading-relaxed pl-10">
                1. Abre tu hoja de cálculo vinculada a ORIGEN y ve a <strong>Extensiones → Apps Script</strong>.<br />
                2. Reemplaza todo el contenido de <code>Code.gs</code> con el código de la pestaña <strong>Backend (Code.gs)</strong>.<br />
                3. Haz clic en el botón azul superior <strong>Implementar → Nueva implementación</strong>.<br />
                4. En el ícono de engranaje selecciona <strong>Tipo: Aplicación web</strong>.<br />
                5. En <em>"Ejecutar como"</em> elige <strong>Yo</strong>.<br />
                6. En <em>"Quién tiene acceso"</em> elige <strong>Cualquier persona (Anyone)</strong>. <em>(¡Crítico para que GitHub Pages pueda comunicarse sin solicitar inicio de sesión en Google!)</em><br />
                7. Haz clic en <strong>Implementar</strong> y copia la <strong>URL de la aplicación web</strong> (termina en <code>/exec</code>).
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-[#161620] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#dfb763]/20 text-[#dfb763] font-bold flex items-center justify-center text-xs border border-[#dfb763]/40">
                  2
                </span>
                <h4 className="text-base font-semibold text-white">
                  Configurar el Frontend para GitHub Pages
                </h4>
              </div>
              <p className="text-xs text-[#a3a3b2] leading-relaxed pl-10">
                1. Descarga o copia el código de la pestaña <strong>Frontend (index.html)</strong>.<br />
                2. Abre el archivo y busca la línea donde dice: <code className="text-[#dfb763]">const API_URL = "URL_AQUI";</code><br />
                3. Reemplaza <code>"URL_AQUI"</code> con la URL de Apps Script que copiaste en el Paso 1.<br />
                4. Sube el archivo con el nombre <code>index.html</code> a un repositorio público en GitHub.<br />
                5. En tu repositorio, entra a <strong>Settings → Pages</strong>, y bajo <em>Build and deployment</em>, selecciona <strong>Source: Deploy from a branch</strong> (rama <code>main</code>, carpeta <code>/ (root)</code>).<br />
                6. En un minuto tendrás tu URL pública, por ejemplo: <code>https://tu-usuario.github.io/origen/</code>
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-[#161620] p-5 rounded-2xl border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#dfb763]/20 text-[#dfb763] font-bold flex items-center justify-center text-xs border border-[#dfb763]/40">
                  3
                </span>
                <h4 className="text-base font-semibold text-white">
                  Cómo utilizar los parámetros de Parada y Trivia en GitHub Pages
                </h4>
              </div>
              <p className="text-xs text-[#a3a3b2] leading-relaxed pl-10">
                Al migrar de Apps Script HtmlService a GitHub Pages, los parámetros dinámicos (que antes eran <code>&lt;?= parada ?&gt;</code> y <code>&lt;?= modo ?&gt;</code>) se leen automáticamente desde los query parameters de la URL:<br /><br />
                • <strong>Para acceder a un video por parada:</strong><br />
                <code className="text-[#dfb763]">https://tu-usuario.github.io/origen/?parada=1</code><br />
                (El script detectará si el visitante usa iPhone para entregar WebM o MP4 según tu columna).<br /><br />
                • <strong>Para acceder a la trivia con premio:</strong><br />
                <code className="text-[#dfb763]">https://tu-usuario.github.io/origen/?modo=trivia</code><br />
                (Validará si el código ya jugó para evitar repeticiones en la hoja Resultados).
              </p>
            </div>

            {/* Resumen de cambios estéticos */}
            <div className="p-4 bg-[#1b1b24] rounded-2xl border border-[#dfb763]/30">
              <h5 className="text-xs font-bold text-[#dfb763] uppercase tracking-wider mb-2">
                Garantías de Diseño y Fidelidad Funcional
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#a3a3b2]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2ecc71] shrink-0 mt-0.5" />
                  <span><strong>Paleta #0b0b0e + Oro:</strong> Se conservaron todos los tonos y acentos dorados.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2ecc71] shrink-0 mt-0.5" />
                  <span><strong>Glassmorphism & Profundidad:</strong> Superficies esmeriladas con borde capilar de luz.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2ecc71] shrink-0 mt-0.5" />
                  <span><strong>Botones Físicos de Lujo:</strong> Bisel metálico, relieve táctil y animaciones suaves.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2ecc71] shrink-0 mt-0.5" />
                  <span><strong>Cero impacto funcional:</strong> Todos los IDs de elementos y reglas se mantuvieron 100% exactos.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
