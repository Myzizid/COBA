import React, { useState } from 'react';
import { AssetRecord } from '../types/asset';
import { formatIndoDate, formatRupiah, calculateDepreciationSchedule } from '../utils/formatters';
import { KIB_DEFINITIONS } from '../data/mockAssets';
import { 
  X, 
  QrCode, 
  MapPin, 
  Calendar, 
  Building, 
  ShieldCheck, 
  FileText, 
  Wrench, 
  Table, 
  Printer 
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: AssetRecord | null;
  onClose: () => void;
  onOpenQr: (asset: AssetRecord) => void;
  onEdit: (asset: AssetRecord) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onOpenQr,
  onEdit,
}) => {
  const [showDepreciationTable, setShowDepreciationTable] = useState(false);

  if (!asset) return null;

  const depreciationSchedule = calculateDepreciationSchedule(
    asset.hargaPerolehan,
    asset.tahunPerolehan,
    asset.masaManfaatTahun
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-200 shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>{KIB_DEFINITIONS[asset.kibType]?.title}</span>
              <span>·</span>
              <span>Kode: {asset.kodeBarang}</span>
              <span>·</span>
              <span>Reg: {asset.register}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {asset.namaBarang}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Kuasa Pengguna Barang: {asset.opd}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Visual & Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 flex items-center justify-center relative">
              <img
                src={asset.fotoUrl}
                alt={asset.namaBarang}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white p-2 rounded text-[11px] font-mono tabular-nums">
                Kondisi: <span className="font-semibold text-emerald-400">{asset.kondisi}</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Neraca & Valuasi Keuangan (Standar SAP)
              </h3>
              
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500">Harga Perolehan</div>
                  <div className="text-sm font-bold text-slate-900 font-mono tabular-nums mt-0.5">
                    {formatRupiah(asset.hargaPerolehan)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Akum. Penyusutan</div>
                  <div className="text-sm font-bold text-rose-700 font-mono tabular-nums mt-0.5">
                    {formatRupiah(asset.nilaiPenyusutan)}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-500">Nilai Buku Bersih</div>
                  <div className="text-sm font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
                    {formatRupiah(asset.nilaiBuku)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status Legalitas & Dokumen:</span>
                  <span className="font-medium text-slate-900 font-mono tabular-nums">
                    {asset.statusLegalitas} ({asset.nomorDokumen})
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Tahun Pengadaan / Perolehan:</span>
                  <span className="font-medium text-slate-900 font-mono tabular-nums">
                    Tahun {asset.tahunPerolehan} (Masa Manfaat: {asset.masaManfaatTahun} Thn)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status Pemanfaatan:</span>
                  <span className="font-medium text-slate-900">
                    {asset.statusPemanfaatan}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications / Physical Attributes */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Atribut Fisik & Lokasi BMD
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500">Alamat Letak Barang:</span>
                <p className="font-medium text-slate-900 mt-0.5">{asset.lokasiAlamat}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Wilayah: {asset.kecamatan}
                </p>
              </div>

              <div>
                <span className="text-slate-500">Dimensi & Spesifikasi:</span>
                <p className="font-medium text-slate-900 mt-0.5 font-mono tabular-nums">
                  {asset.luasM2 ? `Luas: ${asset.luasM2.toLocaleString('id-ID')} m²` : ''}
                  {asset.panjangKm ? `Panjang: ${asset.panjangKm} km` : ''}
                  {asset.merkModel ? `Merk/Tipe: ${asset.merkModel}` : ''}
                  {!asset.luasM2 && !asset.panjangKm && !asset.merkModel && '-'}
                </p>
                {asset.nomorPolisi && (
                  <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                    No. Pol: {asset.nomorPolisi} · Rangka: {asset.nomorRangkaMesin}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-xs">
              <span className="text-slate-500">Catatan & Histori Pengelolaan:</span>
              <p className="text-slate-700 mt-0.5 italic">{asset.keterangan}</p>
            </div>
          </div>

          {/* Expandable Depreciation Schedule */}
          {asset.masaManfaatTahun > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowDepreciationTable(!showDepreciationTable)}
                className="w-full p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-slate-500" />
                  <span>Jadwal Tabel Penyusutan Garis Lurus (Akuntansi SAP)</span>
                </div>
                <span className="text-emerald-700 text-xs font-medium">
                  {showDepreciationTable ? 'Sembunyikan' : 'Tampilkan Rincian'}
                </span>
              </button>

              {showDepreciationTable && (
                <div className="max-h-56 overflow-y-auto border-t border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Tahun</th>
                        <th className="py-2 px-3 text-right">Nilai Awal (Rp)</th>
                        <th className="py-2 px-3 text-right">Beban Penyusutan (Rp)</th>
                        <th className="py-2 px-3 text-right">Akumulasi (Rp)</th>
                        <th className="py-2 px-3 text-right">Nilai Sisa Buku (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-700">
                      {depreciationSchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50">
                          <td className="py-1.5 px-3 font-semibold text-slate-900">{row.year}</td>
                          <td className="py-1.5 px-3 text-right">{formatRupiah(row.nilaiAwal)}</td>
                          <td className="py-1.5 px-3 text-right text-rose-700">-{formatRupiah(row.bebanPenyusutan)}</td>
                          <td className="py-1.5 px-3 text-right">{formatRupiah(row.akumulasiPenyusutan)}</td>
                          <td className="py-1.5 px-3 text-right font-medium text-emerald-800">{formatRupiah(row.nilaiAkhir)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenQr(asset)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Cetak Label QR BMD</span>
            </button>
            <button
              onClick={() => onEdit(asset)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors shadow-2xs"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Perbarui Data / Kondisi</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
