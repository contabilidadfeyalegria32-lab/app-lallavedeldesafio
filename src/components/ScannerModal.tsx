import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Camera, ScanLine, CheckCircle2, ShieldCheck, Smartphone, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { AccessLog } from '../types';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl: string;
  onSuccessfulScan: (log: AccessLog) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, appUrl, onSuccessfulScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<AccessLog | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsScanning(true);
      setScannedResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerScanSimulation = (badgeName: string = 'Entrada Usuario Web') => {
    setIsScanning(false);
    
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#059669', '#3b82f6', '#10b981']
    });

    const newLog: AccessLog = {
      id: Math.random().toString(36).substring(2, 9),
      badgeTitle: badgeName,
      userType: 'Acceso Normal',
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      deviceInfo: `${navigator.platform || 'Navegador Web'} - Movil Compatible`,
      status: 'authorized',
    };

    setScannedResult(newLog);
    onSuccessfulScan(newLog);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ScanLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Escáner de Código QR</h3>
              <p className="text-[11px] text-slate-500">Simulador de Acceso en Tiempo Real</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isScanning ? (
            <div className="flex flex-col items-center text-center">
              
              {/* Animated Scanner Frame */}
              <div className="relative w-64 h-64 bg-slate-900 rounded-2xl p-4 flex items-center justify-center overflow-hidden shadow-inner border-2 border-indigo-500/30">
                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-indigo-400 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-indigo-400 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-indigo-400 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-indigo-400 rounded-br-lg" />

                {/* Laser Animation */}
                <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 shadow-[0_0_15px_#10b981] animate-[bounce_2.5s_infinite]" />

                <div className="flex flex-col items-center text-slate-400 gap-2">
                  <Camera className="w-10 h-10 animate-pulse text-indigo-400" />
                  <span className="text-xs text-slate-300 font-medium">Buscando código QR...</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                Apunta la cámara al código QR de la plataforma o usa el botón de simulación instantánea a continuación.
              </p>

              {/* Simulation Quick Buttons */}
              <div className="mt-5 w-full space-y-2">
                <button
                  onClick={() => triggerScanSimulation('Acceso Plataforma Web')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Simular Lectura QR Exitosa</span>
                </button>

                <button
                  onClick={() => triggerScanSimulation('Pase Especial de Invitado')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Simular Lectura Pase Invitado</span>
                </button>
              </div>

            </div>
          ) : scannedResult ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-1">
                <Sparkles className="w-3 h-3" />
                ¡Acceso Confirmado!
              </span>

              <h4 className="text-xl font-bold text-slate-900 mt-1">
                Bienvenido a la Plataforma
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Has ingresado exitosamente mediante la simulación de lectura del código QR.
              </p>

              {/* Log Details Box */}
              <div className="w-full bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-left text-xs space-y-2 mt-5">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Tipo de Entrada:</span>
                  <span className="font-semibold text-slate-800">{scannedResult.badgeTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Hora de Ingreso:</span>
                  <span className="font-mono text-slate-800">{scannedResult.scannedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estado de Red:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Conectado / Web Viva
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 w-full mt-6">
                <button
                  onClick={() => setIsScanning(true)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Escanear Otro</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Ir a la Plataforma</span>
                </button>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
};
