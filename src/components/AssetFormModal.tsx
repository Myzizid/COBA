import React, { useState, useEffect } from 'react';
import { AssetCondition, AssetRecord, KibType, LegalStatus, UtilizationStatus } from '../types/asset';
import { X, Check } from 'lucide-react';
import heroPemerintahImg from '../assets/images/hero_pemerintah_aset_1791165523248.jpg';

interface AssetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assetData: AssetRecord) => void;
  initialAsset?: AssetRecord | null;
}

export const AssetFormModal: React.FC<AssetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAsset,
}) => {
  const [formData, setFormData] = useState<Partial<AssetRecord>>({
    kodeBarang: '',
    register: '000001',
    namaBarang: '',
    kibType: 'KIB_C',
    opd: 'Sekretariat Daerah (SETDA)',
    tahunPerolehan: new Date().getFullYear(),
    hargaPerolehan: 0,
    nilaiPenyusutan: 0,
    nilaiBuku: 0,
    kondisi: 'Baik',
    statusLegalitas: 'Bersertifikat',
    nomorDokumen: '',
    lokasiAlamat: '',
    kecamatan: 'Kecamatan Kota Madya',
    luasM2: undefined,
    masaManfaatTahun: 50,
    statusPemanfaatan: 'Digunakan Sendiri',
    keterangan: '',
    fotoUrl: heroPemerintahImg,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialAsset) {
      setFormData(initialAsset);
    } else {
      setFormData({
        id: `BMD-${Date.now().toString().slice(-6)}`,
        kodeBarang: '01.01.01.04.099',
        register: Math.floor(100000 + Math.random() * 900000).toString(),
        namaBarang: '',
        kibType: 'KIB_C',
        opd: 'Badan Pengelolaan Keuangan & Aset Daerah (BPKAD)',
        tahunPerolehan: 2024,
        hargaPerolehan: 500000000,
        nilaiPenyusutan: 50000000,
        nilaiBuku: 450000000,
        kondisi: 'Baik',
        statusLegalitas: 'Bersertifikat',
        nomorDokumen: 'SHP No. 109/BPKAD/2024',
        lokasiAlamat: '',
        kecamatan: 'Kecamatan Kota Madya',
        koordinat: { lat: -6.215, lng: 106.845 },
        luasM2: 500,
        masaManfaatTahun: 50,
        statusPemanfaatan: 'Digunakan Sendiri',
        keterangan: '',
        fotoUrl: heroPemerintahImg,
      });
    }
    setErrors({});
  }, [initialAsset, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!formData.namaBarang?.trim()) errs.namaBarang = 'Nama barang wajib diisi';
    if (!formData.kodeBarang?.trim()) errs.kodeBarang = 'Kode barang wajib diisi';
    if (!formData.lokasiAlamat?.trim()) errs.lokasiAlamat = 'Alamat lokasi wajib diisi';
    if (!formData.hargaPerolehan || formData.hargaPerolehan <= 0) {
      errs.hargaPerolehan = 'Harga perolehan harus lebih dari 0';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Auto-calculate book value
    const harga = Number(formData.hargaPerolehan) || 0;
    const susut = Number(formData.nilaiPenyusutan) || 0;
    const buku = Math.max(0, harga - susut);

    const completeRecord: AssetRecord = {
      id: formData.id || `BMD-${Date.now().toString().slice(-6)}`,
      kodeBarang: formData.kodeBarang || '01.01.01.01.001',
      register: formData.register || '000001',
      namaBarang: formData.namaBarang || '',
      kibType: (formData.kibType as KibType) || 'KIB_C',
      opd: formData.opd || 'Badan Pengelolaan Keuangan & Aset Daerah (BPKAD)',
      tahunPerolehan: Number(formData.tahunPerolehan) || 2024,
      hargaPerolehan: harga,
      nilaiPenyusutan: susut,
      nilaiBuku: buku,
      kondisi: (formData.kondisi as AssetCondition) || 'Baik',
      statusLegalitas: (formData.statusLegalitas as LegalStatus) || 'Bersertifikat',
      nomorDokumen: formData.nomorDokumen || '-',
      lokasiAlamat: formData.lokasiAlamat || '',
      kecamatan: formData.kecamatan || 'Kecamatan Kota Madya',
      koordinat: formData.koordinat || { lat: -6.215, lng: 106.845 },
      luasM2: formData.luasM2 ? Number(formData.luasM2) : undefined,
      masaManfaatTahun: Number(formData.masaManfaatTahun) || 0,
      statusPemanfaatan: (formData.statusPemanfaatan as UtilizationStatus) || 'Digunakan Sendiri',
      keterangan: formData.keterangan || '',
      fotoUrl: formData.fotoUrl || heroPemerintahImg,
    };

    onSave(completeRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialAsset ? 'Perbarui Data Register BMD' : 'Registrasi Barang Milik Daerah Baru'}
            </h2>
            <p className="text-xs text-slate-500">
              Formulir Pembukuan Kartu Inventaris Barang (KIB)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nama Objek / Barang Milik Daerah *
              </label>
              <input
                type="text"
                value={formData.namaBarang}
                onChange={(e) => setFormData({ ...formData, namaBarang: e.target.value })}
                placeholder="Contoh: Gedung Puskesmas Rawat Inap"
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
              {errors.namaBarang && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.namaBarang}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Klasifikasi KIB *
              </label>
              <select
                value={formData.kibType}
                onChange={(e) => setFormData({ ...formData, kibType: e.target.value as KibType })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="KIB_A">KIB A: Tanah</option>
                <option value="KIB_B">KIB B: Peralatan & Mesin</option>
                <option value="KIB_C">KIB C: Gedung & Bangunan</option>
                <option value="KIB_D">KIB D: Jalan, Irigasi & Jaringan</option>
                <option value="KIB_E">KIB E: Aset Tetap Lainnya</option>
                <option value="KIB_F">KIB F: Konstruksi Dalam Pengerjaan (KDP)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Kode Barang *
              </label>
              <input
                type="text"
                value={formData.kodeBarang}
                onChange={(e) => setFormData({ ...formData, kodeBarang: e.target.value })}
                placeholder="01.01.01.04.001"
                className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
              {errors.kodeBarang && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.kodeBarang}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                No. Register
              </label>
              <input
                type="text"
                value={formData.register}
                onChange={(e) => setFormData({ ...formData, register: e.target.value })}
                placeholder="000001"
                className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Tahun Perolehan
              </label>
              <input
                type="number"
                value={formData.tahunPerolehan}
                onChange={(e) => setFormData({ ...formData, tahunPerolehan: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Kuasa Pengguna / Perangkat Daerah (OPD)
              </label>
              <select
                value={formData.opd}
                onChange={(e) => setFormData({ ...formData, opd: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Sekretariat Daerah (SETDA)">Sekretariat Daerah (SETDA)</option>
                <option value="Badan Pengelolaan Keuangan & Aset Daerah (BPKAD)">Badan Pengelolaan Keuangan & Aset Daerah (BPKAD)</option>
                <option value="Dinas Pekerjaan Umum & Penataan Ruang (PUPR)">Dinas Pekerjaan Umum & Penataan Ruang (PUPR)</option>
                <option value="Dinas Kesehatan (DINKES)">Dinas Kesehatan (DINKES)</option>
                <option value="RSUD Daerah">RSUD Daerah</option>
                <option value="Dinas Pendidikan & Kebudayaan">Dinas Pendidikan & Kebudayaan</option>
                <option value="Dinas Perhubungan (DISHUB)">Dinas Perhubungan (DISHUB)</option>
                <option value="Dinas Pemuda dan Olahraga (DISPORA)">Dinas Pemuda dan Olahraga (DISPORA)</option>
                <option value="Dinas Pemadam Kebakaran & Penyelamatan">Dinas Pemadam Kebakaran & Penyelamatan</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Status Kepemilikan & Legalitas Dokumen
              </label>
              <select
                value={formData.statusLegalitas}
                onChange={(e) => setFormData({ ...formData, statusLegalitas: e.target.value as LegalStatus })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Bersertifikat">Bersertifikat (SHP / HPL / BPKB)</option>
                <option value="Proses Sertifikasi">Sedang Proses Sertifikasi (BPN)</option>
                <option value="Belum Bersertifikat">Belum Bersertifikat</option>
                <option value="Sengketa">Dalam Sengketa Hukum / Gugatan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Perolehan (Rp) *
              </label>
              <input
                type="number"
                value={formData.hargaPerolehan}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    hargaPerolehan: val,
                    nilaiBuku: Math.max(0, val - (formData.nilaiPenyusutan || 0)),
                  });
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
              {errors.hargaPerolehan && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.hargaPerolehan}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Akumulasi Penyusutan (Rp)
              </label>
              <input
                type="number"
                value={formData.nilaiPenyusutan}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({
                    ...formData,
                    nilaiPenyusutan: val,
                    nilaiBuku: Math.max(0, (formData.hargaPerolehan || 0) - val),
                  });
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Masa Manfaat (Tahun)
              </label>
              <input
                type="number"
                value={formData.masaManfaatTahun}
                onChange={(e) => setFormData({ ...formData, masaManfaatTahun: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Kondisi Fisik Saat Ini
              </label>
              <select
                value={formData.kondisi}
                onChange={(e) => setFormData({ ...formData, kondisi: e.target.value as AssetCondition })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Baik">Baik (Berfungsi Normal)</option>
                <option value="Kurang Baik">Kurang Baik (Perlu Pemeliharaan Ringan)</option>
                <option value="Rusak Berat">Rusak Berat (Tidak Berfungsi / Usul Hapus)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Status Pemanfaatan
              </label>
              <select
                value={formData.statusPemanfaatan}
                onChange={(e) => setFormData({ ...formData, statusPemanfaatan: e.target.value as UtilizationStatus })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Digunakan Sendiri">Digunakan Sendiri (Operasional OPD)</option>
                <option value="Disewakan">Disewakan (Retribusi PAD)</option>
                <option value="Pinjam Pakai">Pinjam Pakai Instansi Vertikal</option>
                <option value="KSP / Mitra">Kerjasama Pemanfaatan (KSP)</option>
                <option value="Idle / Siap Pemanfaatan">Idle (Tanah/Gedung Siap Sewa)</option>
                <option value="Usul Penghapusan">Diusulkan Penghapusan / Lelang</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Alamat Lokasi *
              </label>
              <input
                type="text"
                value={formData.lokasiAlamat}
                onChange={(e) => setFormData({ ...formData, lokasiAlamat: e.target.value })}
                placeholder="Jl. Pahlawan No. 45"
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
              {errors.lokasiAlamat && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.lokasiAlamat}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Nomor Dokumen (Sertifikat / BPKB / IMB)
              </label>
              <input
                type="text"
                value={formData.nomorDokumen}
                onChange={(e) => setFormData({ ...formData, nomorDokumen: e.target.value })}
                placeholder="SHP No. 12/2020 / BPKB No. 0918"
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Catatan Spesifikasi / Riwayat Perolehan
            </label>
            <textarea
              rows={2}
              value={formData.keterangan}
              onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
              placeholder="Keterangan tambahan batas tanah, sumber dana DAK/APBD, atau riwayat renovasi..."
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-sm transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Data Inventaris</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
