import React from 'react';
import { AssetRecord } from '../types/asset';
import { formatIndoDate, formatRupiah } from '../utils/formatters';
import { KIB_DEFINITIONS } from '../data/mockAssets';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';

interface ReportPrintViewProps {
  assets: AssetRecord[];
  onBack: () => void;
}

export const ReportPrintView: React.FC<ReportPrintViewProps> = ({ assets, onBack }) => {
  const totalPerolehan = assets.reduce((s, a) => s + a.hargaPerolehan, 0);
  const totalPenyusutan = assets.reduce((s, a) => s + a.nilaiPenyusutan, 0);
  const totalNilaiBuku = assets.reduce((s, a) => s + a.nilaiBuku, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control Actions bar (hidden when printed) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Aplikasi</span>
        </button>

        <div className="text-xs text-slate-500 hidden sm:block">
          Format Dokumen Standar Lampiran Permendagri No. 47 Tahun 2021
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Official Government Print Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 text-slate-900 font-sans">
        {/* Kop Surat Resmi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
          <div className="text-base font-bold uppercase tracking-wider text-slate-900">
            Pemerintah Daerah Provinsi / Kabupaten
          </div>
          <div className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
            Badan Pengelolaan Keuangan dan Aset Daerah (BPKAD)
          </div>
          <div className="text-xs text-slate-600 font-normal">
            Kompleks Perkantoran Pemerintah Daerah Gedung B, Jl. Merdeka Praja No. 1
          </div>
          <div className="text-xs text-slate-600 font-normal">
            Telepon (021) 8891-xxxx · Faksimile (021) 8891-xxxx · Laman Resmi: bpkad.daerah.go.id
          </div>
        </div>

        {/* Title */}
        <div className="my-6 text-center space-y-1">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide underline underline-offset-4">
            Buku Rekapitulasi Inventarisasi Barang Milik Daerah (BMD)
          </h2>
          <p className="text-xs text-slate-600 font-mono">
            Per Tanggal: {formatIndoDate(new Date().toISOString().split('T')[0])}
          </p>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto my-6">
          <table className="w-full text-left text-[11px] border-collapse border border-slate-900">
            <thead>
              <tr className="bg-slate-100 text-slate-900 border-b border-slate-900 font-bold text-center">
                <th className="p-2 border border-slate-900 w-10">No</th>
                <th className="p-2 border border-slate-900 min-w-[120px]">Kode Barang</th>
                <th className="p-2 border border-slate-900 min-w-[80px]">No. Reg</th>
                <th className="p-2 border border-slate-900 min-w-[200px]">Nama Barang / Spesifikasi</th>
                <th className="p-2 border border-slate-900">KIB</th>
                <th className="p-2 border border-slate-900 min-w-[140px]">SKPD Pengguna</th>
                <th className="p-2 border border-slate-900 w-14">Tahun</th>
                <th className="p-2 border border-slate-900 w-16">Kondisi</th>
                <th className="p-2 border border-slate-900 min-w-[120px] text-right">Harga Perolehan</th>
                <th className="p-2 border border-slate-900 min-w-[120px] text-right">Akum. Penyusutan</th>
                <th className="p-2 border border-slate-900 min-w-[120px] text-right">Nilai Buku</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {assets.map((asset, index) => (
                <tr key={asset.id} className="text-slate-800">
                  <td className="p-1.5 border border-slate-900 text-center font-mono">{index + 1}</td>
                  <td className="p-1.5 border border-slate-900 font-mono">{asset.kodeBarang}</td>
                  <td className="p-1.5 border border-slate-900 font-mono text-center">{asset.register}</td>
                  <td className="p-1.5 border border-slate-900 font-medium">
                    {asset.namaBarang}
                    <div className="text-[10px] text-slate-500 font-normal">{asset.lokasiAlamat}</div>
                  </td>
                  <td className="p-1.5 border border-slate-900 text-center font-mono">
                    {asset.kibType.replace('KIB_', '')}
                  </td>
                  <td className="p-1.5 border border-slate-900">{asset.opd}</td>
                  <td className="p-1.5 border border-slate-900 text-center font-mono">{asset.tahunPerolehan}</td>
                  <td className="p-1.5 border border-slate-900 text-center font-semibold">
                    {asset.kondisi === 'Baik' ? 'B' : asset.kondisi === 'Kurang Baik' ? 'KB' : 'RB'}
                  </td>
                  <td className="p-1.5 border border-slate-900 text-right font-mono tabular-nums">
                    {formatRupiah(asset.hargaPerolehan)}
                  </td>
                  <td className="p-1.5 border border-slate-900 text-right font-mono tabular-nums">
                    {formatRupiah(asset.nilaiPenyusutan)}
                  </td>
                  <td className="p-1.5 border border-slate-900 text-right font-mono tabular-nums font-bold">
                    {formatRupiah(asset.nilaiBuku)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-900 font-bold text-slate-900">
                <td colSpan={8} className="p-2 border border-slate-900 text-center uppercase">
                  Jumlah Total Nilai Neraca Barang Milik Daerah
                </td>
                <td className="p-2 border border-slate-900 text-right font-mono tabular-nums">
                  {formatRupiah(totalPerolehan)}
                </td>
                <td className="p-2 border border-slate-900 text-right font-mono tabular-nums">
                  {formatRupiah(totalPenyusutan)}
                </td>
                <td className="p-2 border border-slate-900 text-right font-mono tabular-nums">
                  {formatRupiah(totalNilaiBuku)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Keterangan Singkatan */}
        <div className="text-[10px] text-slate-500 font-mono space-y-0.5 mb-8">
          <div>* Keterangan Kondisi: B = Baik; KB = Kurang Baik; RB = Rusak Berat</div>
          <div>* Klasifikasi KIB: A = Tanah; B = Peralatan & Mesin; C = Gedung & Bangunan; D = Jalan, Irigasi & Jaringan; E = Aset Tetap Lainnya; F = Konstruksi dalam Pengerjaan</div>
        </div>

        {/* Lembar Tanda Tangan Pejabat Pengelola */}
        <div className="grid grid-cols-2 gap-8 text-xs text-center mt-12 pt-4 break-inside-avoid">
          <div className="space-y-16">
            <div>
              <p>Mengetahui,</p>
              <p className="font-bold uppercase">Sekretaris Daerah Selaku Pengelola Barang</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">Drs. H. M. Ridwan, M.Si.</p>
              <p className="font-mono text-[11px] text-slate-600">NIP. 19740512 199903 1 004</p>
            </div>
          </div>

          <div className="space-y-16">
            <div>
              <p>Disiapkan Oleh,</p>
              <p className="font-bold uppercase">Kepala Badan Pengelolaan Keuangan & Aset Daerah</p>
            </div>
            <div>
              <p className="font-bold underline uppercase">Dr. Hj. Sri Wahyuni, S.E., M.Ak.</p>
              <p className="font-mono text-[11px] text-slate-600">NIP. 19780820 200212 2 001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
