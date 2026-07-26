import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Ticket, Users, Sparkles, Download, Check, ShieldAlert, Tag } from 'lucide-react';
import { QrAccessBadge } from '../types';

interface AccessBadgeGeneratorProps {
  appUrl: string;
}

export const AccessBadgeGenerator: React.FC<AccessBadgeGeneratorProps> = ({ appUrl }) => {
  const [badges, setBadges] = useState<QrAccessBadge[]>([
    {
      id: '1',
      title: 'Portal de Bienvenida General',
      userType: 'guest',
      timestamp: 'Acceso Directo',
      code: 'inicio',
    },
    {
      id: '2',
      title: 'Acceso Registro de Usuarios',
      userType: 'member',
      timestamp: 'Auto-Registro',
      code: 'registro',
    },
    {
      id: '3',
      title: 'Pase VIP / Zona Especial',
      userType: 'vip',
      timestamp: 'Prioritario',
      code: 'vip-pass',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<QrAccessBadge['userType']>('guest');

  const handleAddBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: QrAccessBadge = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      userType: newType,
      timestamp: 'Generado Ahora',
      code: newCode.trim() ? newCode.trim().toLowerCase().replace(/\s+/g, '-') : 'acceso',
    };

    setBadges([created, ...badges]);
    setNewTitle('');
    setNewCode('');
  };

  const getBadgeColor = (type: QrAccessBadge['userType']) => {
    switch (type) {
      case 'vip':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'staff':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'member':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 text-xs font-medium mb-1.5">
            <Ticket className="w-3.5 h-3.5" />
            <span>Generador de Pases y Puntos de Entradas QR</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Crea códigos QR para secciones o áreas específicas
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Puedes generar accesos QR diferenciados para distintas páginas o tipos de usuarios.
          </p>
        </div>
      </div>

      {/* Form to create new badge */}
      <form onSubmit={handleAddBadge} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Entrada / Sección</label>
            <input
              type="text"
              placeholder="Ej. Menú Digital, Registro de Asistencia, Catálogo"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ruta / Parámetro URL</label>
            <input
              type="text"
              placeholder="Ej. menu, evento, mesa-01"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Crear QR</span>
            </button>
          </div>
        </div>
      </form>

      {/* Badge List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {badges.map((b) => {
          const badgeUrl = `${appUrl.replace(/\/$/, '')}/${b.code}`;
          return (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-indigo-300 transition-all shadow-xs flex flex-col items-center text-center group"
            >
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getBadgeColor(b.userType)} mb-3 uppercase tracking-wider`}>
                <Tag className="w-3 h-3" />
                {b.userType}
              </span>

              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{b.title}</h4>
              <p className="text-[11px] font-mono text-slate-400 truncate max-w-full my-1">/{b.code}</p>

              <div className="my-3 p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:scale-105 transition-transform duration-200">
                <QRCodeSVG
                  value={badgeUrl}
                  size={110}
                  level="M"
                />
              </div>

              <a
                href={badgeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline mt-auto pt-1"
              >
                <span>Probar Enlace Directo</span>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
