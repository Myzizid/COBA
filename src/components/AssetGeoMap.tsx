import React, { useState } from 'react';
import { AssetRecord, KibType, LegalStatus } from '../types/asset';
import { formatRupiah, formatRupiahShort } from '../utils/formatters';
import { KIB_DEFINITIONS } from '../data/mockAssets';
import { 
  MapPin, 
  Layers, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Navigation,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

interface AssetGeoMapProps {
  assets: AssetRecord[];
  onSelectAsset: (asset: AssetRecord) => void;
}

export const AssetGeoMap: React.FC<AssetGeoMapProps> = ({ assets, onSelectAsset }) => {
  const [selectedKib, setSelectedKib] = useState<KibType | 'ALL'>('ALL');
  const [selectedLegalitas, setSelectedLegalitas] = useState<LegalStatus | 'ALL'>('ALL');
  const [activeAssetId, setActiveAssetId] = useState<string>(assets[0]?.id || '');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Filtered assets for map
  const mappedAssets = assets.filter((a) => {
    if (selectedKib !== 'ALL' && a.kibType !== selectedKib) return false;
    if (selectedLegalitas !== 'ALL' && a.statusLegalitas !== selectedLegalitas) return false;
    return true;
  });

  const activeAsset = assets.find((a) => a.id === activeAssetId) || assets[0];

  // Helper to map lat/lng coordinates to SVG viewBox (600x420)
  // Center roughly lat: -6.22, lng: 106.84
  const mapCoordinatesToSvg = (lat: number, lng: number) => {
    const minLat = -6.26;
    const maxLat = -6.18;
    const minLng = 106.79;
    const maxLng = 106.89;

    const x = ((lng - minLng) / (maxLng - minLng)) * 540 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 360 + 30;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Sistem Informasi Geospasial Aset Daerah (WebGIS BMD)
          </h1>
          <p className="text-xs text-slate-500">
            Pemetaan sebaran tanah persil, gedung perkantoran, dan jaringan infrastruktur daerah
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedKib}
            onChange={(e) => setSelectedKib(e.target.value as KibType | 'ALL')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium"
          >
            <option value="ALL">Semua Kategori KIB</option>
            <option value="KIB_A">KIB A (Tanah)</option>
            <option value="KIB_B">KIB B (Peralatan & Mesin)</option>
            <option value="KIB_C">KIB C (Gedung & Bangunan)</option>
            <option value="KIB_D">KIB D (Jalan & Irigasi)</option>
            <option value="KIB_F">KIB F (Konstruksi KDP)</option>
          </select>

          <select
            value={selectedLegalitas}
            onChange={(e) => setSelectedLegalitas(e.target.value as LegalStatus | 'ALL')}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-700 font-medium"
          >
            <option value="ALL">Semua Status Legalitas</option>
            <option value="Bersertifikat">Bersertifikat Aman</option>
            <option value="Proses Sertifikasi">Proses Sertifikasi BPN</option>
            <option value="Sengketa">Objek Sengketa</option>
          </select>
        </div>
      </div>

      {/* Main Map Viewport & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-4 relative overflow-hidden shadow-md flex flex-col justify-between min-h-[480px]">
          {/* Map Top Overlay Controls */}
          <div className="flex items-center justify-between z-10 text-xs">
            <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-3 py-1.5 rounded-md border border-slate-800 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">Koordinat Pusat: -6.220 / 106.840 (WGS84)</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-sm p-1 rounded-md border border-slate-800">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
                title="Perbesar Peta"
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                title="Perkecil Peta"
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Canvas with Municipal Topography & Asset Pins */}
          <div className="relative w-full h-[380px] my-auto flex items-center justify-center overflow-hidden">
            <svg
              viewBox="0 0 600 420"
              className="w-full h-full transition-transform duration-300 select-none"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Municipal Grid Texture */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                {/* River Gradient */}
                <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect width="600" height="420" fill="#0f172a" />
              <rect width="600" height="420" fill="url(#grid)" />

              {/* Subdistrict Zones (Polygons) */}
              <g opacity="0.35">
                {/* Kecamatan Barat */}
                <path
                  d="M 40,40 L 220,50 L 210,210 L 50,230 Z"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text x="70" y="80" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                  KEC. BARAT
                </text>

                {/* Kecamatan Pusat / Kota Madya */}
                <path
                  d="M 220,50 L 400,60 L 390,240 L 210,210 Z"
                  fill="#064e3b"
                  fillOpacity="0.2"
                  stroke="#059669"
                  strokeWidth="1.2"
                />
                <text x="240" y="85" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  KEC. KOTA MADYA (PUSAT)
                </text>

                {/* Kecamatan Timur */}
                <path
                  d="M 400,60 L 560,50 L 550,230 L 390,240 Z"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text x="440" y="80" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                  KEC. TIMUR
                </text>

                {/* Kecamatan Selatan */}
                <path
                  d="M 50,230 L 550,230 L 530,390 L 60,380 Z"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
                <text x="70" y="320" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                  KEC. SELATAN
                </text>
              </g>

              {/* Major River / Citanduy River Line */}
              <path
                d="M 30,120 Q 180,180 320,160 T 580,210"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <text x="350" y="150" fill="#38bdf8" fontSize="9" opacity="0.6" fontStyle="italic">
                Sungai Citanduy
              </text>

              {/* Main Arterial Road Network */}
              <path
                d="M 120,30 L 310,220 L 540,380"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="6 3"
              />
              <path
                d="M 40,220 L 560,220"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
              />

              {/* Asset Markers */}
              {mappedAssets.map((asset) => {
                const { x, y } = mapCoordinatesToSvg(asset.koordinat.lat, asset.koordinat.lng);
                const isSelected = asset.id === activeAssetId;
                
                // Color by legal status
                let markerColor = '#10b981'; // Green
                if (asset.statusLegalitas === 'Sengketa') markerColor = '#f43f5e'; // Red
                else if (asset.statusLegalitas === 'Proses Sertifikasi') markerColor = '#f59e0b'; // Amber

                return (
                  <g
                    key={asset.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => setActiveAssetId(asset.id)}
                  >
                    {/* Pulsing ring for selected asset */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="18"
                        fill="none"
                        stroke={markerColor}
                        strokeWidth="1.5"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer halo */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? '10' : '7'}
                      fill={markerColor}
                      opacity={isSelected ? '0.9' : '0.75'}
                    />

                    {/* Inner core */}
                    <circle cx={x} cy={y} r={isSelected ? '5' : '3.5'} fill="#ffffff" />

                    {/* Label on hover or selected */}
                    {isSelected && (
                      <g transform={`translate(${x + 12}, ${y - 10})`}>
                        <rect
                          x="0"
                          y="0"
                          width={Math.min(180, asset.namaBarang.length * 6 + 16)}
                          height="22"
                          rx="4"
                          fill="#020617"
                          stroke="#334155"
                          strokeWidth="1"
                        />
                        <text
                          x="8"
                          y="15"
                          fill="#f8fafc"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {asset.namaBarang.slice(0, 24)}...
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Bottom Legend */}
          <div className="z-10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Bersertifikat Aman</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Proses Sertifikasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Potensi Sengketa Hukum</span>
              </div>
            </div>

            <div className="text-slate-500 font-mono">
              Total {mappedAssets.length} Titik Terpetakan
            </div>
          </div>
        </div>

        {/* Selected Asset Floating Inspector Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 font-mono">
                {KIB_DEFINITIONS[activeAsset.kibType]?.shortName}
              </span>
              <span
                className={`text-xs font-semibold ${
                  activeAsset.statusLegalitas === 'Bersertifikat'
                    ? 'text-emerald-700'
                    : activeAsset.statusLegalitas === 'Proses Sertifikasi'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {activeAsset.statusLegalitas}
              </span>
            </div>

            <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-100 bg-slate-100">
              <img
                src={activeAsset.fotoUrl}
                alt={activeAsset.namaBarang}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {activeAsset.namaBarang}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{activeAsset.lokasiAlamat}</span>
              </p>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-lg text-xs font-mono tabular-nums">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Kode Barang:</span>
                <span className="font-semibold text-slate-800">{activeAsset.kodeBarang}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nilai Buku:</span>
                <span className="font-bold text-emerald-700">{formatRupiah(activeAsset.nilaiBuku)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Pengguna (OPD):</span>
                <span className="text-slate-700 truncate max-w-[150px]">{activeAsset.opd}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Koordinat:</span>
                <span className="text-slate-600">{activeAsset.koordinat.lat}, {activeAsset.koordinat.lng}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{activeAsset.keterangan}"
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectAsset(activeAsset)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Buka Kartu Lengkap Aset</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
