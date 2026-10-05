import React, { useState, useMemo } from 'react';
import { AssetCondition, AssetRecord, KibType, LegalStatus } from '../types/asset';
import { formatRupiah, formatRupiahShort } from '../utils/formatters';
import { KIB_DEFINITIONS } from '../data/mockAssets';
import { 
  Search, 
  Filter, 
  QrCode, 
  ExternalLink, 
  ArrowUpDown, 
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

interface AssetInventoryProps {
  assets: AssetRecord[];
  selectedKibFilter: KibType | 'ALL';
  setSelectedKibFilter: (kib: KibType | 'ALL') => void;
  onSelectAsset: (asset: AssetRecord) => void;
  onOpenQrModal: (asset: AssetRecord) => void;
}

export const AssetInventory: React.FC<AssetInventoryProps> = ({
  assets,
  selectedKibFilter,
  setSelectedKibFilter,
  onSelectAsset,
  onOpenQrModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<AssetCondition | 'ALL'>('ALL');
  const [selectedLegalitas, setSelectedLegalitas] = useState<LegalStatus | 'ALL'>('ALL');
  const [selectedOpd, setSelectedOpd] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'namaBarang' | 'nilaiBuku' | 'tahunPerolehan'>('nilaiBuku');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Unique OPD list
  const opdList = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => set.add(a.opd));
    return Array.from(set).sort();
  }, [assets]);

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        // KIB filter
        if (selectedKibFilter !== 'ALL' && asset.kibType !== selectedKibFilter) {
          return false;
        }
        // Kondisi filter
        if (selectedCondition !== 'ALL' && asset.kondisi !== selectedCondition) {
          return false;
        }
        // Legalitas filter
        if (selectedLegalitas !== 'ALL' && asset.statusLegalitas !== selectedLegalitas) {
          return false;
        }
        // OPD filter
        if (selectedOpd !== 'ALL' && asset.opd !== selectedOpd) {
          return false;
        }
        // Text Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNama = asset.namaBarang.toLowerCase().includes(q);
          const matchKode = asset.kodeBarang.toLowerCase().includes(q);
          const matchRegister = asset.register.toLowerCase().includes(q);
          const matchOpd = asset.opd.toLowerCase().includes(q);
          const matchLokasi = asset.lokasiAlamat.toLowerCase().includes(q);
          const matchDok = asset.nomorDokumen.toLowerCase().includes(q);
          if (!matchNama && !matchKode && !matchRegister && !matchOpd && !matchLokasi && !matchDok) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [assets, selectedKibFilter, selectedCondition, selectedLegalitas, selectedOpd, searchQuery, sortField, sortDirection]);

  const handleSort = (field: 'namaBarang' | 'nilaiBuku' | 'tahunPerolehan') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const kibTabs: { id: KibType | 'ALL'; label: string; count: number }[] = [
    { id: 'ALL', label: 'Semua KIB', count: assets.length },
    { id: 'KIB_A', label: 'KIB A: Tanah', count: assets.filter((a) => a.kibType === 'KIB_A').length },
    { id: 'KIB_B', label: 'KIB B: Peralatan', count: assets.filter((a) => a.kibType === 'KIB_B').length },
    { id: 'KIB_C', label: 'KIB C: Gedung', count: assets.filter((a) => a.kibType === 'KIB_C').length },
    { id: 'KIB_D', label: 'KIB D: Jalan/Irigasi', count: assets.filter((a) => a.kibType === 'KIB_D').length },
    { id: 'KIB_E', label: 'KIB E: Aset Lain', count: assets.filter((a) => a.kibType === 'KIB_E').length },
    { id: 'KIB_F', label: 'KIB F: KDP', count: assets.filter((a) => a.kibType === 'KIB_F').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Buku Inventaris Barang Milik Daerah (KIB)
            </h1>
            <p className="text-xs text-slate-500">
              Daftar register terinci sesuai Permendagri No. 47 Tahun 2021 tentang Pembukuan & Inventarisasi
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums flex items-center gap-2">
            <span>Ditemukan: <strong>{filteredAssets.length}</strong> objek</span>
            <span>·</span>
            <span>Total Nilai: <strong>{formatRupiahShort(filteredAssets.reduce((s, a) => s + a.nilaiBuku, 0))}</strong></span>
          </div>
        </div>

        {/* KIB Segmented Navigation Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto no-scrollbar">
          {kibTabs.map((tab) => {
            const isActive = selectedKibFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedKibFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[11px] font-mono tabular-nums text-slate-400">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Dynamic Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama barang, kode, NIB, lokasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-900"
            />
          </div>

          {/* Filter OPD */}
          <select
            value={selectedOpd}
            onChange={(e) => setSelectedOpd(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-700"
          >
            <option value="ALL">Semua Perangkat Daerah (OPD)</option>
            {opdList.map((opd) => (
              <option key={opd} value={opd}>
                {opd}
              </option>
            ))}
          </select>

          {/* Filter Kondisi */}
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value as AssetCondition | 'ALL')}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-700"
          >
            <option value="ALL">Semua Kondisi Fisik</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Kurang Baik">Kondisi Kurang Baik</option>
            <option value="Rusak Berat">Kondisi Rusak Berat</option>
          </select>

          {/* Filter Legalitas */}
          <select
            value={selectedLegalitas}
            onChange={(e) => setSelectedLegalitas(e.target.value as LegalStatus | 'ALL')}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-600 text-slate-700"
          >
            <option value="ALL">Semua Status Legalitas</option>
            <option value="Bersertifikat">Bersertifikat (HP/HPL)</option>
            <option value="Proses Sertifikasi">Proses Sertifikasi</option>
            <option value="Sengketa">Dalam Sengketa Hukum</option>
          </select>
        </div>
      </div>

      {/* Main High-Density Data Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-3 px-3.5 w-12 text-center">No</th>
                <th className="py-3 px-3.5 min-w-[240px]">
                  <button
                    onClick={() => handleSort('namaBarang')}
                    className="flex items-center gap-1.5 hover:text-slate-900"
                  >
                    <span>Nama Barang / Objek Aset</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="py-3 px-3.5 min-w-[150px]">Kode Barang & Register</th>
                <th className="py-3 px-3.5 min-w-[190px]">Pengguna (SKPD / OPD)</th>
                <th className="py-3 px-3.5 text-center min-w-[80px]">
                  <button
                    onClick={() => handleSort('tahunPerolehan')}
                    className="inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    <span>Tahun</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="py-3 px-3.5 text-right min-w-[140px]">
                  <button
                    onClick={() => handleSort('nilaiBuku')}
                    className="inline-flex items-center gap-1 justify-end hover:text-slate-900 w-full"
                  >
                    <span>Nilai Buku (Rp)</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </th>
                <th className="py-3 px-3.5 min-w-[110px]">Kondisi</th>
                <th className="py-3 px-3.5 min-w-[130px]">Legalitas</th>
                <th className="py-3 px-3.5 text-right min-w-[100px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-medium text-slate-700">Tidak ada data aset yang cocok.</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau reset filter.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCondition('ALL');
                        setSelectedLegalitas('ALL');
                        setSelectedOpd('ALL');
                        setSelectedKibFilter('ALL');
                      }}
                      className="mt-3 px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium transition-colors"
                    >
                      Reset Semua Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset, index) => {
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectAsset(asset)}
                    >
                      <td className="py-3 px-3.5 text-center text-slate-400 font-mono tabular-nums">
                        {index + 1}
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {asset.namaBarang}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[260px]">
                          {asset.lokasiAlamat}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 font-mono tabular-nums text-slate-600">
                        <div className="font-medium text-slate-900">{asset.kodeBarang}</div>
                        <div className="text-[11px] text-slate-400">Reg: {asset.register}</div>
                      </td>

                      <td className="py-3 px-3.5 text-slate-700">
                        <div className="truncate max-w-[190px]" title={asset.opd}>
                          {asset.opd}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {KIB_DEFINITIONS[asset.kibType]?.shortName || asset.kibType}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-center font-mono tabular-nums text-slate-700">
                        {asset.tahunPerolehan}
                      </td>

                      <td className="py-3 px-3.5 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatRupiah(asset.nilaiBuku)}
                        <div className="text-[10px] text-slate-400 font-normal">
                          Perolehan: {formatRupiahShort(asset.hargaPerolehan)}
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span
                          className={`inline-block text-[11px] font-semibold ${
                            asset.kondisi === 'Baik'
                              ? 'text-emerald-700'
                              : asset.kondisi === 'Kurang Baik'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {asset.kondisi}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        <span
                          className={`inline-block text-[11px] font-medium ${
                            asset.statusLegalitas === 'Bersertifikat'
                              ? 'text-slate-800'
                              : asset.statusLegalitas === 'Proses Sertifikasi'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                          }`}
                        >
                          {asset.statusLegalitas}
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {asset.nomorDokumen}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenQrModal(asset)}
                            title="Generate QR Label Aset"
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectAsset(asset)}
                            title="Buka Lembar Inventaris"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
