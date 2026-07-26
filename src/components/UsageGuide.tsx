import React from 'react';
import { HelpCircle, Smartphone, Printer, Monitor, Layers, CheckCircle2, QrCode } from 'lucide-react';

export const UsageGuide: React.FC = () => {
  return (
    <div id="usage-guide" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium mb-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Guía de Implementación Física</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          ¿Cómo utilizar y colocar tu Código QR de Acceso?
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
          Para lograr que los usuarios entren fácilmente a tu plataforma web sin escribir direcciones URL, te recomendamos los siguientes formatos de impresión:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Option 1: Display de Mesa */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">1. Expositores / Acrílicos de Mesa</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ideal para restaurantes, mostradores, salas de espera o stands de atención. El cliente escanea el QR desde su mesa y entra de inmediato a la web.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mayor tasa de escaneo instantáneo</span>
          </div>
        </div>

        {/* Option 2: Afiches y Posters */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">2. Afiches, Banners y Carteles</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Ubica el código QR a la altura de los ojos en la entrada del local o en zonas transitadas. Añade una frase clara como "Escanea aquí para acceder".
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Excelente visibilidad para público general</span>
          </div>
        </div>

        {/* Option 3: Tarjetas de Presentación y Flyers */}
        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">3. Tarjetas, Volantes o Etiquetas</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Imprime el QR en material físico entregable (folletos, empaques, comprobantes de pago) para que los usuarios ingresen a la plataforma desde su hogar u oficina.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Retención y acceso recurrente</span>
          </div>
        </div>

      </div>
    </div>
  );
};
