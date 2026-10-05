import React, { useState } from 'react';
import { AssetRecord, MaintenanceRecord } from '../types/asset';
import { formatIndoDate, formatRupiah, formatRupiahShort } from '../utils/formatters';
import { 
  Wrench, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

interface AssetMaintenanceProps {
  maintenanceList: MaintenanceRecord[];
  assets: AssetRecord[];
  onAddMaintenance: (record: MaintenanceRecord) => void;
  onUpdateStatus: (id: string, status: 'Terjadwal' | 'Dalam Proses' | 'Selesai') => void;
}

export const AssetMaintenance: React.FC<AssetMaintenanceProps> = ({
  maintenanceList,
  assets,
  onAddMaintenance,
  onUpdateStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [jenisPemeliharaan, setJenisPemeliharaan] = useState('');
  const [tanggalJadwal, setTanggalJadwal] = useState('');
  const [biayaEstimasi, setBiayaEstimasi] = useState<number>(15000000);
  const [penanggungJawab, setPenanggungJawab] = useState('');
  const [catatanTeknis, setCatatanTeknis] = useState('');

  const filteredList = maintenanceList.filter((m) => {
    if (filterStatus !== 'ALL' && m.status !== filterStatus) return false;
    return true;
  });

  const totalBiayaEstimasi = maintenanceList.reduce((acc, m) => acc + m.biayaEstimasi, 0);
  const totalSelesai = maintenanceList.filter((m) => m.status === 'Selesai').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset || !jenisPemeliharaan) return;

    const newRecord: MaintenanceRecord = {
      id: `MNT-${Date.now().toString().slice(-6)}`,
      asetId: asset.id,
      namaBarang: asset.namaBarang,
      kodeBarang: asset.kodeBarang,
      opd: asset.opd,
      jenisPemeliharaan,
      tanggalJadwal: tanggalJadwal || new Date().toISOString().split('T')[0],
      biayaEstimasi: Number(biayaEstimasi) || 0,
      penanggungJawab: penanggungJawab || 'Staf Teknis Pemeliharaan',
      status: 'Terjadwal',
      catatanTeknis,
    };

    onAddMaintenance(newRecord);
    setShowAddModal(false);
    setJenisPemeliharaan('');
    setCatatanTeknis('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Pengawasan & Pemeliharaan Berkala BMD
          </h1>
          <p className="text-xs text-slate-500">
            Jadwal servis berkala, pengujian kelaikan fungsi K3, dan realisasi anggaran pemeliharaan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono tabular-nums">
            <span className="text-slate-500">Total Anggaran Pemeliharaan:</span>{' '}
            <strong className="text-slate-900">{formatRupiahShort(totalBiayaEstimasi)}</strong>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jadwal Servis</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua Jadwal ({maintenanceList.length})
        </button>
        <button
          onClick={() => setFilterStatus('Terjadwal')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filterStatus === 'Terjadwal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Terjadwal ({maintenanceList.filter((m) => m.status === 'Terjadwal').length})
        </button>
        <button
          onClick={() => setFilterStatus('Dalam Proses')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filterStatus === 'Dalam Proses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Dalam Proses ({maintenanceList.filter((m) => m.status === 'Dalam Proses').length})
        </button>
        <button
          onClick={() => setFilterStatus('Selesai')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            filterStatus === 'Selesai' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Selesai ({totalSelesai})
        </button>
      </div>

      {/* Maintenance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 font-semibold">{item.kodeBarang}</span>
                <span
                  className={`font-semibold text-[11px] ${
                    item.status === 'Selesai'
                      ? 'text-emerald-700'
                      : item.status === 'Dalam Proses'
                      ? 'text-amber-700'
                      : 'text-sky-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.namaBarang}
              </h3>

              <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1.5 text-xs">
                <div className="font-semibold text-slate-800">
                  Uraian: {item.jenisPemeliharaan}
                </div>
                <div className="text-slate-600 text-[11px]">{item.catatanTeknis}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Jadwal Pelaksanaan:</span>
                  <span className="font-medium text-slate-800">{formatIndoDate(item.tanggalJadwal)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Estimasi Biaya:</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                    {formatRupiah(item.biayaEstimasi)}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 truncate">
                PJ: {item.penanggungJawab} ({item.opd})
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              {item.status !== 'Dalam Proses' && item.status !== 'Selesai' && (
                <button
                  onClick={() => onUpdateStatus(item.id, 'Dalam Proses')}
                  className="px-3 py-1.5 text-amber-800 bg-amber-50 hover:bg-amber-100 font-medium rounded transition-colors"
                >
                  Tandai Dalam Proses
                </button>
              )}
              {item.status !== 'Selesai' && (
                <button
                  onClick={() => onUpdateStatus(item.id, 'Selesai')}
                  className="px-3 py-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-medium rounded transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selesai & SPJ Valid</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Jadwal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Input Jadwal Pemeliharaan BMD Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pilih Objek Barang *
                </label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.namaBarang} ({a.kodeBarang}) - {a.opd}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Uraian Pekerjaan / Servis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Overhaul mesin utama / Kalibrasi sistem tata udara"
                  value={jenisPemeliharaan}
                  onChange={(e) => setJenisPemeliharaan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Tanggal Rencana
                  </label>
                  <input
                    type="date"
                    value={tanggalJadwal}
                    onChange={(e) => setTanggalJadwal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Estimasi Anggaran (Rp)
                  </label>
                  <input
                    type="number"
                    value={biayaEstimasi}
                    onChange={(e) => setBiayaEstimasi(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pejabat Penanggung Jawab Teknis
                </label>
                <input
                  type="text"
                  placeholder="Nama & Jabatan Kasubag / PPK"
                  value={penanggungJawab}
                  onChange={(e) => setPenanggungJawab(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Catatan Teknis / Suku Cadang
                </label>
                <textarea
                  rows={2}
                  placeholder="Kebutuhan sparepart atau spesifikasi khusus..."
                  value={catatanTeknis}
                  onChange={(e) => setCatatanTeknis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
