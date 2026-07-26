import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, QrCode, ScanLine, Copy, Check, Download, ExternalLink, Smartphone } from 'lucide-react';
import { ScannerModal } from './ScannerModal';
import { AccessLog } from '../types';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, appUrl }) => {
  const [copied, setCopied] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <QrCode className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Acceso QR a la Plataforma
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QR Render */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <QRCodeSVG
                value={appUrl}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-xs font-semibold text-slate-800">
              Escanea este código para ingresar desde tu teléfono móvil
            </p>
            <p className="text-[11px] font-mono text-slate-500 truncate max-w-full px-2">
              {appUrl}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleCopy}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? '¡URL Copiada al Portapapeles!' : 'Copiar URL de la Web'}</span>
            </button>

            <button
              onClick={() => setShowScanner(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Probar Escáner QR Interactivo</span>
            </button>
          </div>

        </div>
      </div>

      <ScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        appUrl={appUrl}
        onSuccessfulScan={() => {}}
      />
    </>
  );
};
