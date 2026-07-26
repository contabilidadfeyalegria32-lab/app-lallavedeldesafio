import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, Smartphone, ExternalLink, Palette, Printer, Check, Copy, Sparkles, QrCode } from 'lucide-react';
import { QrColorTheme } from '../types';

interface QrViewerProps {
  appUrl: string;
}

const themeColors: Record<QrColorTheme, { fg: string; bg: string; name: string; border: string }> = {
  indigo: { fg: '#4f46e5', bg: '#ffffff', name: 'Índigo Moderno', border: 'border-indigo-200' },
  emerald: { fg: '#059669', bg: '#ffffff', name: 'Esmeralda', border: 'border-emerald-200' },
  slate: { fg: '#0f172a', bg: '#ffffff', name: 'Negro Elegante', border: 'border-slate-300' },
  amber: { fg: '#d97706', bg: '#ffffff', name: 'Ámbar Cálido', border: 'border-amber-200' },
  rose: { fg: '#e11d48', bg: '#ffffff', name: 'Rosa Distintivo', border: 'border-rose-200' },
};

export const QrViewer: React.FC<QrViewerProps> = ({ appUrl }) => {
  const [selectedTheme, setSelectedTheme] = useState<QrColorTheme>('indigo');
  const [customPath, setCustomPath] = useState('');
  const [copied, setCopied] = useState(false);
  const [includeTitle, setIncludeTitle] = useState(true);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const fullTargetUrl = customPath.trim() 
    ? `${appUrl.replace(/\/$/, '')}/${customPath.replace(/^\//, '')}`
    : appUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrContainerRef.current) return;
    const svgElement = qrContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      // Add padding and white background
      const padding = 40;
      canvas.width = image.width + padding * 2;
      canvas.height = image.height + padding * 2 + (includeTitle ? 50 : 0);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw rounded card background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR Image
      ctx.drawImage(image, padding, padding);

      if (includeTitle) {
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText('Escanea para ingresar a la Plataforma', canvas.width / 2, canvas.height - 25);
      }

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `codigo-qr-plataforma.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    image.src = url;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: QR Visual Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative group w-full max-w-xs">
            {/* Soft Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur-md opacity-25 group-hover:opacity-40 transition duration-300" />
            
            <div className="relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col items-center text-center">
              
              {/* Top Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Acceso Móvil Inmediato</span>
              </div>

              {/* QR Render Target */}
              <div ref={qrContainerRef} className="p-4 bg-white rounded-xl shadow-inner border border-slate-100 flex items-center justify-center">
                <QRCodeSVG
                  value={fullTargetUrl}
                  size={200}
                  fgColor={themeColors[selectedTheme].fg}
                  bgColor={themeColors[selectedTheme].bg}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%234f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>',
                    x: undefined,
                    y: undefined,
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />
              </div>

              {/* QR Label */}
              <p className="mt-4 text-xs font-semibold text-slate-700">
                Escanea con la cámara de tu celular
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-full px-2">
                {fullTargetUrl}
              </p>
            </div>
          </div>

          {/* Quick Download & Print Buttons */}
          <div className="flex items-center gap-2 mt-6 w-full max-w-xs">
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title="Imprimir Afiche QR"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Customization & Info */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Código QR Principal de la Web</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Accede a la plataforma escaneando este código
            </h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Tus usuarios no necesitan descargar aplicaciones adicionales. Al apuntar la cámara de su teléfono a este código QR, se abrirá la página web de tu plataforma al instante.
            </p>
          </div>

          {/* URL Box & Custom Path */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Dirección de Destino Web (URL)
            </label>

            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-300 p-2 shadow-2xs">
              <span className="text-xs font-mono text-slate-400 pl-2">https://</span>
              <input
                type="text"
                readOnly
                value={appUrl.replace(/^https?:\/\//, '')}
                className="flex-1 text-xs font-mono text-slate-800 bg-transparent outline-none truncate"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Custom Section Sub-path */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Añadir sección específica (opcional):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">/</span>
                <input
                  type="text"
                  placeholder="ej. menu, registro, bienvenida, catalogo"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="flex-1 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-600" />
              <span>Estilo de Color del QR</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(themeColors) as QrColorTheme[]).map((key) => {
                const theme = themeColors[key];
                const isSelected = selectedTheme === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.fg }}
                    />
                    <span>{theme.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="p-1 bg-emerald-100 text-emerald-700 rounded-md mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">Sin Instalación</span>
                Funciona directamente en el navegador de iOS y Android.
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-600">
              <div className="p-1 bg-indigo-100 text-indigo-700 rounded-md mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">Alta Legibilidad</span>
                Formato SVG vectorial nítido para impresiones profesionales.
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
