import React, { useState } from 'react';
import { Layers, Store, Calendar, Users, ClipboardList, CreditCard, Sparkles, ArrowRight, Smartphone, MessageSquare } from 'lucide-react';

interface PlatformPlaceholderProps {
  appUrl: string;
}

export const PlatformPlaceholder: React.FC<PlatformPlaceholderProps> = ({ appUrl }) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'catalogo' | 'asistencia' | 'eventos' | 'encuestas'>('welcome');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Infraestructura Web Lista</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            ¿De qué tratará tu Plataforma Digital?
          </h2>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            El sistema de entrada por QR ya está completamente operativo. A continuación puedes explorar algunos ejemplos de cómo responderá la plataforma según la temática que elijas.
          </p>
        </div>

        {/* Message Prompt box */}
        <div className="bg-slate-900 text-white p-4 rounded-xl text-xs max-w-xs shrink-0 shadow-sm">
          <p className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Próximo Paso:
          </p>
          <p className="text-slate-300 leading-normal">
            Escribe en el chat la temática exacta (menú, tienda, eventos, inventario, reservas, citas, etc.) para programar la lógica completa.
          </p>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 no-scrollbar">
        {[
          { id: 'welcome', label: 'Bienvenida Web', icon: Layers },
          { id: 'catalogo', label: 'Menú / Catálogo', icon: Store },
          { id: 'asistencia', label: 'Registro / Asistencia', icon: Users },
          { id: 'eventos', label: 'Eventos & Entradas', icon: Calendar },
          { id: 'encuestas', label: 'Portal / Encuestas', icon: ClipboardList },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Mockups */}
      <div className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80">
        {activeTab === 'welcome' && (
          <div className="text-center py-6 max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Portal Web Optimizado para Móviles
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cuando tus clientes o usuarios escaneen el código QR desde su celular, serán recibidos por una interfaz ultrarrápida que no requiere descargar apps de la Play Store o App Store.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>¡Listo para recibir tus componentes y datos!</span>
            </div>
          </div>
        )}

        {activeTab === 'catalogo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-indigo-600" />
                Ejemplo: Menú Digital o Catálogo Interactivo
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Muestra de Interfaz Móvil</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Platillo / Producto A', category: 'Destacados', price: '$12.50' },
                { title: 'Platillo / Producto B', category: 'Populares', price: '$18.00' },
                { title: 'Servicio / Opción C', category: 'Especiales', price: '$25.00' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="w-full h-24 bg-slate-100 rounded-lg mb-2.5 flex items-center justify-center text-slate-400 text-xs font-medium">
                    [ Imagen del Producto ]
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-xs font-bold text-slate-900 mt-1">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'asistencia' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Ejemplo: Sistema de Registro y Control de Asistencia
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Muestra de Formulario de Ingreso</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs max-w-md mx-auto space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input type="text" placeholder="Juan Pérez" disabled className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico / Identificación</label>
                <input type="email" placeholder="usuario@ejemplo.com" disabled className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-400" />
              </div>
              <button disabled className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold opacity-80 cursor-not-allowed">
                Marcar Asistencia mediante QR
              </button>
            </div>
          </div>
        )}

        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Ejemplo: Entradas a Eventos y Verificación de Pases
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Tique Digital</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full" />
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">Pase de Entrada</span>
              <h4 className="text-base font-bold text-slate-900 mt-2">Conferencia / Evento Especial 2026</h4>
              <p className="text-xs text-slate-500 mt-0.5">Válido para 1 Asistente • Acceso Prioritario</p>
              <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Estado del Pase:</span>
                <span className="font-semibold text-emerald-600">Activo / Escaneable</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'encuestas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-violet-600" />
                Ejemplo: Encuestas de Satisfacción & Opinión
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Feedback Rápido</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs max-w-md mx-auto text-center space-y-3">
              <p className="text-xs font-semibold text-slate-800">¿Cómo evaluarías tu experiencia hoy?</p>
              <div className="flex justify-center gap-2 text-xl">
                {['⭐', '⭐', '⭐', '⭐', '⭐'].map((star, i) => (
                  <span key={i} className="cursor-pointer hover:scale-125 transition-transform">{star}</span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">Tus respuestas quedan registradas al instante al escanear el QR en mesa/mostrador.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
