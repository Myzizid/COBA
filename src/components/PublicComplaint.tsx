import React, { useState } from 'react';
import { PublicReportItem } from '../types/asset';
import { formatIndoDate } from '../utils/formatters';
import { 
  ShieldAlert, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MessageSquare,
  FileCheck 
} from 'lucide-react';

interface PublicComplaintProps {
  reports: PublicReportItem[];
  onAddReport: (report: PublicReportItem) => void;
}

export const PublicComplaint: React.FC<PublicComplaintProps> = ({
  reports,
  onAddReport,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'tracking' | 'list'>('form');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedReport, setTrackedReport] = useState<PublicReportItem | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  // Form State
  const [namaPelapor, setNamaPelapor] = useState('');
  const [kontak, setKontak] = useState('');
  const [kategori, setKategori] = useState<PublicReportItem['kategori']>('Aset Terbengkalai / Mangkrak');
  const [judulLaporan, setJudulLaporan] = useState('');
  const [lokasiAlamat, setLokasiAlamat] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelapor || !judulLaporan || !lokasiAlamat || !deskripsi) return;

    const ticket = `TIKET-BMD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: PublicReportItem = {
      id: `LAP-${Date.now()}`,
      nomorTiket: ticket,
      namaPelapor,
      kontak: kontak || '08xx-xxxx-xxxx',
      judulLaporan,
      kategori,
      lokasiAlamat,
      deskripsi,
      tanggalLapor: new Date().toISOString().split('T')[0],
      status: 'Menunggu Verifikasi',
      tanggapanPetugas: 'Laporan Anda telah tercatat dan sedang dalam antrean verifikasi staf BPKAD.',
    };

    onAddReport(newReport);
    setSubmittedTicket(ticket);
    setNamaPelapor('');
    setJudulLaporan('');
    setLokasiAlamat('');
    setDeskripsi('');
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const found = reports.find(
      (r) => r.nomorTiket.toLowerCase() === trackingNumber.trim().toLowerCase()
    );
    if (found) {
      setTrackedReport(found);
      setSearchNotFound(false);
    } else {
      setTrackedReport(null);
      setSearchNotFound(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Layanan Pengaduan & Transparansi Aset Publik
        </h1>
        <p className="text-xs text-slate-500">
          Kanal partisipasi masyarakat untuk melaporkan aset daerah terbengkalai, penyerobotan tanah, atau penyalahgunaan sarana dinas
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs">
        <button
          onClick={() => setActiveSubTab('form')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSubTab === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Buat Laporan Baru
        </button>
        <button
          onClick={() => setActiveSubTab('tracking')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSubTab === 'tracking' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Lacak Status Pengaduan
        </button>
        <button
          onClick={() => setActiveSubTab('list')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeSubTab === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Daftar Tindak Lanjut Publik ({reports.length})
        </button>
      </div>

      {/* Content Form */}
      {activeSubTab === 'form' && (
        <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          {submittedTicket ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Laporan Berhasil Dikirim</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Terima kasih atas kepedulian Anda menjaga aset milik pemerintah daerah. Laporan Anda telah tercatat dengan nomor tiket:
              </p>
              <div className="inline-block p-3 bg-slate-50 border border-slate-200 rounded text-sm font-mono font-bold text-slate-900">
                {submittedTicket}
              </div>
              <p className="text-[11px] text-slate-400">
                Simpan nomor tiket ini untuk melacak perkembangan investigasi di tab Lacak Status.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800"
                >
                  Kirim Laporan Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Nama Lengkap Pelapor *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaPelapor}
                    onChange={(e) => setNamaPelapor(e.target.value)}
                    placeholder="Nama warga atau pelapor"
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
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Kategori Pengaduan *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as PublicReportItem['kategori'])}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  >
                    <option value="Aset Terbengkalai / Mangkrak">Aset Terbengkalai / Mangkrak</option>
                    <option value="Penyalahgunaan Kendaraan Dinas">Penyalahgunaan Kendaraan Dinas (Plat Merah)</option>
                    <option value="Perusakan Fasilitas Publik">Perusakan / Vandalisme Fasilitas Publik</option>
                    <option value="Klaim / Penyerobotan Lahan">Klaim Liar / Penyerobotan Tanah Pemda</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Judul Ringkas Laporan *
                  </label>
                  <input
                    type="text"
                    required
                    value={judulLaporan}
                    onChange={(e) => setJudulLaporan(e.target.value)}
                    placeholder="Contoh: Tanah lapangan pemda dipagari sepihak"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Lokasi / Titik Kejadian *
                </label>
                <input
                  type="text"
                  required
                  value={lokasiAlamat}
                  onChange={(e) => setLokasiAlamat(e.target.value)}
                  placeholder="Nama jalan, RT/RW, kelurahan, atau patokan jelas"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Uraian Lengkap Kejadian & Bukti Petunjuk *
                </label>
                <textarea
                  rows={4}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan secara detail kronologi, kondisi lapangan, atau plat nomor kendaraan terkait..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Kerahasiaan identitas pelapor dilindungi undang-undang.
                </span>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan Pengaduan</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Content Tracking */}
      {activeSubTab === 'tracking' && (
        <div className="max-w-xl bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900">
            Lacak Progres Penanganan Tiket Pengaduan
          </h2>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Masukkan nomor tiket (contoh: TIKET-BMD-8821)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md"
            >
              Cari Tiket
            </button>
          </form>

          {searchNotFound && (
            <p className="text-xs text-rose-600 p-3 bg-rose-50 border border-rose-200 rounded">
              Nomor tiket tidak ditemukan dalam database. Mohon pastikan kode tiket sudah tepat.
            </p>
          )}

          {trackedReport && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900">{trackedReport.nomorTiket}</span>
                <span className="font-semibold text-emerald-700">{trackedReport.status}</span>
              </div>

              <div className="font-semibold text-slate-800 text-sm">
                {trackedReport.judulLaporan}
              </div>

              <div className="text-slate-600">
                Lokasi: <span className="font-medium text-slate-800">{trackedReport.lokasiAlamat}</span>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded text-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Tindak Lanjut Instansi Terkait:
                </span>
                <p className="italic">{trackedReport.tanggapanPetugas || 'Dalam proses investigasi lapangan.'}</p>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Tanggal Lapor: {formatIndoDate(trackedReport.tanggalLapor)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content List */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 font-medium">{report.nomorTiket}</span>
                  <span
                    className={`font-semibold ${
                      report.status === 'Selesai'
                        ? 'text-emerald-700'
                        : report.status === 'Tindak Lanjut OPD'
                        ? 'text-indigo-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {report.judulLaporan}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {report.deskripsi}
                </p>

                <div className="text-[11px] text-slate-500 font-mono">
                  {report.lokasiAlamat} · {formatIndoDate(report.tanggalLapor)}
                </div>

                {report.tanggapanPetugas && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded text-[11px] text-slate-700">
                    <span className="font-semibold text-slate-800">Tanggapan OPD: </span>
                    {report.tanggapanPetugas}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
