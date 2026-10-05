import React from 'react';
import { AssetRecord } from '../types/asset';
import { generateSvgQrMatrix } from '../utils/formatters';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';

interface AssetQrModalProps {
  asset: AssetRecord | null;
  onClose: () => void;
}

export const AssetQrModal: React.FC<AssetQrModalProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  const qrDataString = `BMD|ID:${asset.id}|KD:${asset.kodeBarang}|REG:${asset.register}|OPD:${asset.opd}`;
  const svgQr = generateSvgQrMatrix(qrDataString, 140);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Label Registrasi Fisik BMD</h3>
            <p className="text-[11px] text-slate-500">Stiker Inventarisasi Standar Permendagri No. 47/2021</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Official Sticker Card Preview */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-100/50">
          <div
            id="print-asset-label"
            className="w-full max-w-sm bg-white border-2 border-slate-900 rounded-md p-3.5 shadow-sm text-slate-900 font-sans"
          >
            {/* Government Label Header */}
            <div className="border-b-2 border-slate-900 pb-2 mb-2.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Pemerintah Daerah</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-700 uppercase tracking-widest mt-0.5">
                Barang Milik Daerah (BMD)
              </div>
            </div>

            {/* Content: QR and Metadata */}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 p-1 bg-white border border-slate-200 rounded"
                dangerouslySetInnerHTML={{ __html: svgQr }}
              />

              <div className="space-y-1 text-[11px] leading-snug">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Kode Barang:</span>
                  <span className="font-mono font-bold text-slate-900">{asset.kodeBarang}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">No. Register:</span>
                  <span className="font-mono font-bold text-slate-900">{asset.register}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Nama Barang:</span>
                  <span className="font-semibold text-slate-900 line-clamp-2">{asset.namaBarang}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Pengguna / OPD:</span>
                  <span className="text-slate-700 truncate block max-w-[170px]">{asset.opd}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase font-bold">Tahun Perolehan:</span>
                  <span className="font-mono font-semibold text-slate-900">{asset.tahunPerolehan}</span>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-2.5 pt-1.5 border-t border-slate-300 text-[9px] text-center text-slate-600 font-mono">
              DILARANG MERUSAK / MEMINDAHKAN TANPA IZIN PENGELOLA BARANG
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            Tutup
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Stiker Label</span>
          </button>
        </div>
      </div>
    </div>
  );
};
