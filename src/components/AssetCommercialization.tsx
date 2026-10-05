import React, { useState } from 'react';
import { UtilizationItem } from '../types/asset';
import { formatRupiah, formatRupiahShort } from '../utils/formatters';
import { 
  Building, 
  Calculator, 
  Coins, 
  FileCheck, 
  Handshake, 
  ArrowRight, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

interface AssetCommercializationProps {
  utilizations: UtilizationItem[];
}

export const AssetCommercialization: React.FC<AssetCommercializationProps> = ({
  utilizations,
}) => {
  // Calculator state
  const [selectedItemForCalc, setSelectedItemForCalc] = useState<string>(utilizations[0]?.id || '');
  const [calcDuration, setCalcDuration] = useState<number>(1);
  const [calcUnitCount, setCalcUnitCount] = useState<number>(1);

  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [applyItem, setApplyItem] = useState<UtilizationItem | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantCompany, setApplicantCompany] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [applicantPurpose, setApplicantPurpose] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const activeCalcItem = utilizations.find((u) => u.id === selectedItemForCalc) || utilizations[0];
  const calculatedEstimate = activeCalcItem
    ? activeCalcItem.tarifDasar * calcDuration * calcUnitCount
    : 0;

  const totalPotensiPAD = utilizations.reduce((sum, u) => sum + u.potensiPADTahunan, 0);

  const handleOpenApply = (item: UtilizationItem) => {
    setApplyItem(item);
    setApplicantName('');
    setApplicantCompany('');
    setApplicantContact('');
    setApplicantPurpose('');
    setSubmittedSuccess(false);
    setShowApplyModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantContact) return;
    setSubmittedSuccess(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Pemanfaatan & Optimalisasi Aset Daerah (Pendapatan Asli Daerah / PAD)
          </h1>
          <p className="text-xs text-slate-500">
            Peluang sewa, Kerjasama Pemanfaatan (KSP), dan Bangun Guna Serah (BGS) sesuai Permendagri No. 19/2016
          </p>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono tabular-nums">
          <span className="text-slate-600">Target Potensi PAD BMD:</span>{' '}
          <strong className="text-emerald-800 text-sm">{formatRupiahShort(totalPotensiPAD)}/Tahun</strong>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Katalog Objek Aset Idle & Fasilitas Siap Pemanfaatan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {utilizations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                  <img
                    src={item.fotoUrl}
                    alt={item.namaAset}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-medium">
                    {item.satuanTarif}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[11px] text-slate-500 font-medium">{item.jenisAset}</span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.namaAset}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{item.lokasi}</p>

                  <div className="pt-2 border-t border-slate-100 text-xs font-mono tabular-nums">
                    <span className="text-slate-400 block text-[10px] uppercase">Tarif Retribusi Daerah:</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(item.tarifDasar)}
                    </span>
                    <span className="text-slate-500 text-[11px] ml-1">/{item.satuanTarif.toLowerCase().replace('per ', '')}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleOpenApply(item)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors"
                >
                  Ajukan Pemanfaatan / Sewa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Rent & PAD Calculator Section */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 text-white shadow-md">
        <div className="max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Simulasi Tarif Retribusi Sewa Daerah</span>
          </div>

          <h2 className="text-lg font-bold text-white">
            Hitung Estimasi Nilai Kontribusi Sewa BMD Sesuai Perda Tarif
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">
                Pilih Objek BMD
              </label>
              <select
                value={selectedItemForCalc}
                onChange={(e) => setSelectedItemForCalc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                {utilizations.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.namaAset}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">
                Durasi Sewa ({activeCalcItem?.satuanTarif})
              </label>
              <input
                type="number"
                min={1}
                max={25}
                value={calcDuration}
                onChange={(e) => setCalcDuration(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">
                Jumlah Unit / Lot Pemanfaatan
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={calcUnitCount}
                onChange={(e) => setCalcUnitCount(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Estimasi Total Pendapatan Asli Daerah (PAD):</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                {formatRupiah(calculatedEstimate)}
              </div>
              <p className="text-[11px] text-slate-400">
                Formula: Tarif Dasar × {calcDuration} periode × {calcUnitCount} unit (Belum termasuk PPN 11% & jaminan sewa)
              </p>
            </div>

            <button
              onClick={() => handleOpenApply(activeCalcItem)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              Ajukan Permohonan Resmi
            </button>
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      {showApplyModal && applyItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Formulir Minat Pemanfaatan / Sewa BMD
                </h3>
                <p className="text-xs text-slate-500">{applyItem.namaAset}</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                ✕
              </button>
            </div>

            {submittedSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">
                  Permohonan Minat Berhasil Diterima
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Terima kasih <strong>{applicantName}</strong>. Berkas permohonan sewa untuk <strong>{applyItem.namaAset}</strong> telah masuk ke Bidang Pengelolaan Aset BPKAD untuk verifikasi kelayakan teknis dan administratif.
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-600">
                  Nomor Registrasi Minat: BMD-PAD-{Date.now().toString().slice(-6)}
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nama Pemohon / Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Nama lengkap sesuai KTP"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nama Badan Usaha / Komunitas / UMKM
                  </label>
                  <input
                    type="text"
                    value={applicantCompany}
                    onChange={(e) => setApplicantCompany(e.target.value)}
                    placeholder="PT / CV / Koperasi / Perorangan"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nomor WhatsApp / Kontak Telepon *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantContact}
                    onChange={(e) => setApplicantContact(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Rencana Peruntukan Usaha / Kegiatan
                  </label>
                  <textarea
                    rows={2}
                    value={applicantPurpose}
                    onChange={(e) => setApplicantPurpose(e.target.value)}
                    placeholder="Contoh: Ritel kuliner UMKM lokal, gudang distribusi, atau penyelenggaraan pameran..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Permohonan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
