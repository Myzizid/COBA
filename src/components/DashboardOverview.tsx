import React from 'react';
import { AssetRecord, KibType } from '../types/asset';
import { formatRupiah, formatRupiahShort } from '../utils/formatters';
import { KIB_DEFINITIONS } from '../data/mockAssets';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Route, 
  BookOpen, 
  HardHat, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  FileCheck2,
  CalendarCheck
} from 'lucide-react';
import heroPemerintahImg from '../assets/images/hero_pemerintah_aset_1791165523248.jpg';

interface DashboardOverviewProps {
  assets: AssetRecord[];
  onSelectKib: (kib: KibType) => void;
  onNavigateToTab: (tab: string) => void;
  onSelectAsset: (asset: AssetRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  assets,
  onSelectKib,
  onNavigateToTab,
  onSelectAsset,
}) => {
  // Compute aggregate statistics
  const totalPerolehan = assets.reduce((acc, a) => acc + a.hargaPerolehan, 0);
  const totalNilaiBuku = assets.reduce((acc, a) => acc + a.nilaiBuku, 0);
  const totalAkumulasiPenyusutan = assets.reduce((acc, a) => acc + a.nilaiPenyusutan, 0);

  const kondisiBaik = assets.filter((a) => a.kondisi === 'Baik').length;
  const kondisiKurangBaik = assets.filter((a) => a.kondisi === 'Kurang Baik').length;
  const kondisiRusakBerat = assets.filter((a) => a.kondisi === 'Rusak Berat').length;

  const tanahAssets = assets.filter((a) => a.kibType === 'KIB_A');
  const tanahBersertifikat = tanahAssets.filter((a) => a.statusLegalitas === 'Bersertifikat').length;
  const rasioSertifikatTanah = tanahAssets.length > 0 
    ? Math.round((tanahBersertifikat / tanahAssets.length) * 100) 
    : 100;

  // Breakdown by KIB
  const kibBreakdown: { type: KibType; title: string; count: number; nilaiBuku: number; icon: React.ReactNode }[] = [
    {
      type: 'KIB_A',
      title: 'KIB A: Tanah',
      count: assets.filter((a) => a.kibType === 'KIB_A').length,
      nilaiBuku: assets.filter((a) => a.kibType === 'KIB_A').reduce((acc, a) => acc + a.nilaiBuku, 0),
      icon: <MapPin className="w-4 h-4 text-emerald-700" />,
    },
    {
      type: 'KIB_B',
      title: 'KIB B: Peralatan & Mesin',
      count: assets.filter((a) => a.kibType === 'KIB_B').length,
      nilaiBuku: assets.filter((a) => a.kibType === 'KIB_B').reduce((acc, a) => acc + a.nilaiBuku, 0),
      icon: <Truck className="w-4 h-4 text-sky-700" />,
    },
    {
      type: 'KIB_C',
      title: 'KIB C: Gedung & Bangunan',
      count: assets.filter((a) => a.kibType === 'KIB_C').length,
      nilaiBuku: assets.filter((a) => a.kibType === 'KIB_C').reduce((acc, a) => acc + a.nilaiBuku, 0),
      icon: <Building2 className="w-4 h-4 text-amber-700" />,
    },
    {
      type: 'KIB_D',
      title: 'KIB D: Jalan & Irigasi',
      count: assets.filter((a) => a.kibType === 'KIB_D').length,
      nilaiBuku: assets.filter((a) => a.kibType === 'KIB_D').reduce((acc, a) => acc + a.nilaiBuku, 0),
      icon: <Route className="w-4 h-4 text-indigo-700" />,
    },
    {
      type: 'KIB_E',
      title: 'KIB E: Aset Tetap Lain',
      count: assets.filter((a) => a.kibType === 'KIB_E').length,
      nilaiBuku: assets.filter((a) => a.kibType === 'KIB_E').reduce((acc, a) => acc + a.nilaiBuku, 0),
      icon: <BookOpen className="w-4 h-4 text-purple-700" />,
    },
    {
      type: 'KIB_F',
      title: 'KIB F: Konstruksi (KDP)',
      count: assets.filter((a) => a.kibType === 'KIB_F').length,
      nilaiBuku: assets.filter((a) => a.kibType === 'KIB_F').reduce((acc, a) => acc + a.nilaiBuku, 0),
      icon: <HardHat className="w-4 h-4 text-orange-700" />,
    },
  ];

  // Top SKPDs by Value
  const opdMap = new Map<string, { count: number; nilai: number }>();
  assets.forEach((a) => {
    const cur = opdMap.get(a.opd) || { count: 0, nilai: 0 };
    opdMap.set(a.opd, {
      count: cur.count + 1,
      nilai: cur.nilai + a.nilaiBuku,
    });
  });
  const topOpds = Array.from(opdMap.entries())
    .map(([opd, data]) => ({ opd, ...data }))
    .sort((a, b) => b.nilai - a.nilai)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Civic Banner */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src={heroPemerintahImg}
            alt="Pusat Pemerintahan Daerah"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
        </div>

        <div className="relative p-6 sm:p-8 md:p-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-400 uppercase">
            <span>Portal Resmi Tata Kelola Aset Daerah</span>
            <span>·</span>
            <span>Permendagri No. 19/2016 & No. 47/2021</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
            Transparansi & Akuntabilitas Pengelolaan Barang Milik Daerah (BMD)
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Pusat data terpadu sensus aset, legalitas sertifikasi persil tanah, pengawasan pemeliharaan infrastruktur,
            serta optimalisasi pemanfaatan aset untuk Pendapatan Asli Daerah (PAD).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => onNavigateToTab('inventaris')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-white rounded-md shadow-sm transition-colors"
            >
              Jelajahi Buku Inventaris KIB
            </button>
            <button
              onClick={() => onNavigateToTab('peta')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md backdrop-blur-sm transition-colors"
            >
              Lihat Peta Sebaran Geospasial
            </button>
            <button
              onClick={() => onNavigateToTab('pemanfaatan')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-md backdrop-blur-sm transition-colors"
            >
              Katalog Sewa & PAD
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Nilai Buku */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Total Nilai Buku BMD</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {formatRupiahShort(totalNilaiBuku)}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <span>Nilai Perolehan:</span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              {formatRupiahShort(totalPerolehan)}
            </span>
          </div>
        </div>

        {/* Metric 2: Total Unit Aset */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Jumlah Register Aset</span>
            <FileCheck2 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums tracking-tight">
            {assets.length} <span className="text-sm font-normal text-slate-500">Objek Tercatat</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <span>Tersebar di 6 Kategori KIB (A - F)</span>
          </div>
        </div>

        {/* Metric 3: Kondisi Aset */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Kondisi Fisik BMD</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {Math.round((kondisiBaik / assets.length) * 100)}%
            </span>
            <span className="text-xs text-emerald-700 font-medium">Kondisi Baik</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100 font-mono tabular-nums">
            <span className="text-amber-700 font-medium">{kondisiKurangBaik} Kurang Baik</span>
            <span>·</span>
            <span className="text-rose-700 font-medium">{kondisiRusakBerat} Rusak Berat</span>
          </div>
        </div>

        {/* Metric 4: Legalitas Tanah */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Sertifikasi Tanah Daerah</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {rasioSertifikatTanah}%
            </span>
            <span className="text-xs text-indigo-700 font-medium">Bersertifikat HP/HPL</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <span>Target MCP KPK: Tertib Fisik & Hukum</span>
          </div>
        </div>
      </div>

      {/* KIB Classification Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Klasifikasi Kartu Inventaris Barang (KIB)
            </h2>
            <p className="text-xs text-slate-500">
              Pengelompokan barang inventaris sesuai Standar Akuntansi Pemerintahan
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('inventaris')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Lihat Semua Tabel →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {kibBreakdown.map((kib) => (
            <div
              key={kib.type}
              onClick={() => onSelectKib(kib.type)}
              className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-slate-50 rounded group-hover:bg-slate-100 transition-colors">
                    {kib.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {kib.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      {kib.count} Objek Register
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Nilai Buku:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  {formatRupiahShort(kib.nilaiBuku)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Insights & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SKPD Pengguna Aset Terbesar */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Distribusi Nilai Aset per Perangkat Daerah (OPD)
            </h3>
            <p className="text-xs text-slate-500">
              5 Pengguna Barang dengan akumulasi kapitalisasi tertinggi
            </p>
          </div>

          <div className="space-y-3">
            {topOpds.map((item, idx) => {
              const pct = Math.round((item.nilai / totalNilaiBuku) * 100);
              return (
                <div key={item.opd} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[200px]" title={item.opd}>
                      {idx + 1}. {item.opd}
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {formatRupiahShort(item.nilai)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-800 h-full rounded-full"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Actions: Pengamanan Hukum & Pemeliharaan */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Fokus Pengamanan & Sertifikasi
              </h3>
              <p className="text-xs text-slate-500">
                Aset dalam pengawasan legalitas dan potensi sengketa
              </p>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>

          <div className="space-y-3">
            {assets
              .filter((a) => a.statusLegalitas === 'Sengketa' || a.statusLegalitas === 'Proses Sertifikasi')
              .map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="p-3 rounded border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate max-w-[190px]">
                      {asset.namaBarang}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        asset.statusLegalitas === 'Sengketa'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {asset.statusLegalitas}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono tabular-nums">
                    <span>{asset.kodeBarang}</span>
                    <span>·</span>
                    <span>{asset.opd}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sorotan Pemeliharaan & Jadwal Terdekat */}
        <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Jadwal Servis & Pemeliharaan Terdekat
              </h3>
              <p className="text-xs text-slate-500">
                Jadwal inspeksi kelaikan fisik sarana & prasarana
              </p>
            </div>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {assets
              .filter((a) => Boolean(a.jadwalPemeliharaanBerikutnya))
              .slice(0, 3)
              .map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="p-3 rounded border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                      {asset.namaBarang}
                    </span>
                    <span className="text-[11px] font-mono tabular-nums text-slate-600 font-medium">
                      {asset.jadwalPemeliharaanBerikutnya}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {asset.keterangan}
                  </p>
                </div>
              ))}
          </div>

          <button
            onClick={() => onNavigateToTab('pemeliharaan')}
            className="w-full py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
          >
            Buka Kalender Pemeliharaan Lengkap
          </button>
        </div>
      </div>
    </div>
  );
};
