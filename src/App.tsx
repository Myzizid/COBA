import React, { useState } from 'react';
import { AssetRecord, KibType, MaintenanceRecord, PublicReportItem } from './types/asset';
import { 
  INITIAL_ASSETS, 
  INITIAL_MAINTENANCE, 
  INITIAL_PUBLIC_REPORTS, 
  INITIAL_UTILIZATIONS 
} from './data/mockAssets';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AssetInventory } from './components/AssetInventory';
import { AssetGeoMap } from './components/AssetGeoMap';
import { AssetCommercialization } from './components/AssetCommercialization';
import { AssetMaintenance } from './components/AssetMaintenance';
import { PublicComplaint } from './components/PublicComplaint';
import { ReportPrintView } from './components/ReportPrintView';
import { AssetDetailModal } from './components/AssetDetailModal';
import { AssetQrModal } from './components/AssetQrModal';
import { AssetFormModal } from './components/AssetFormModal';
import { ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('ringkasan');
  const [assets, setAssets] = useState<AssetRecord[]>(INITIAL_ASSETS);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceRecord[]>(INITIAL_MAINTENANCE);
  const [reports, setReports] = useState<PublicReportItem[]>(INITIAL_PUBLIC_REPORTS);
  const [selectedKibFilter, setSelectedKibFilter] = useState<KibType | 'ALL'>('ALL');

  // Modals
  const [detailAsset, setDetailAsset] = useState<AssetRecord | null>(null);
  const [qrAsset, setQrAsset] = useState<AssetRecord | null>(null);
  const [editAsset, setEditAsset] = useState<AssetRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Asset Actions
  const handleSaveAsset = (assetData: AssetRecord) => {
    setAssets((prev) => {
      const idx = prev.findIndex((a) => a.id === assetData.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = assetData;
        return next;
      }
      return [assetData, ...prev];
    });
  };

  const handleAddMaintenance = (record: MaintenanceRecord) => {
    setMaintenanceList((prev) => [record, ...prev]);
  };

  const handleUpdateMaintenanceStatus = (
    id: string,
    status: 'Terjadwal' | 'Dalam Proses' | 'Selesai'
  ) => {
    setMaintenanceList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const handleAddReport = (report: PublicReportItem) => {
    setReports((prev) => [report, ...prev]);
  };

  const handleSelectKibFromOverview = (kib: KibType) => {
    setSelectedKibFilter(kib);
    setActiveTab('inventaris');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditAsset(null);
          setIsFormOpen(true);
        }}
        onOpenReportPrint={() => setActiveTab('cetak-laporan')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'ringkasan' && (
          <DashboardOverview
            assets={assets}
            onSelectKib={handleSelectKibFromOverview}
            onNavigateToTab={setActiveTab}
            onSelectAsset={setDetailAsset}
          />
        )}

        {activeTab === 'inventaris' && (
          <AssetInventory
            assets={assets}
            selectedKibFilter={selectedKibFilter}
            setSelectedKibFilter={setSelectedKibFilter}
            onSelectAsset={setDetailAsset}
            onOpenQrModal={setQrAsset}
          />
        )}

        {activeTab === 'peta' && (
          <AssetGeoMap
            assets={assets}
            onSelectAsset={setDetailAsset}
          />
        )}

        {activeTab === 'pemanfaatan' && (
          <AssetCommercialization
            utilizations={INITIAL_UTILIZATIONS}
          />
        )}

        {activeTab === 'pemeliharaan' && (
          <AssetMaintenance
            maintenanceList={maintenanceList}
            assets={assets}
            onAddMaintenance={handleAddMaintenance}
            onUpdateStatus={handleUpdateMaintenanceStatus}
          />
        )}

        {activeTab === 'pengaduan' && (
          <PublicComplaint
            reports={reports}
            onAddReport={handleAddReport}
          />
        )}

        {activeTab === 'cetak-laporan' && (
          <ReportPrintView
            assets={assets}
            onBack={() => setActiveTab('ringkasan')}
          />
        )}
      </main>

      {/* Institutional Civic Footer (clean, no telemetry slop) */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="font-semibold text-slate-800">
              SIMBADA · Sistem Informasi Manajemen Barang Milik Daerah
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Pedoman Pengelolaan: Permendagri No. 19/2016</span>
            <span>·</span>
            <span>Pembukuan: Permendagri No. 47/2021</span>
            <span>·</span>
            <span>Badan Pengelolaan Keuangan & Aset Daerah</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AssetDetailModal
        asset={detailAsset}
        onClose={() => setDetailAsset(null)}
        onOpenQr={(a) => {
          setDetailAsset(null);
          setQrAsset(a);
        }}
        onEdit={(a) => {
          setDetailAsset(null);
          setEditAsset(a);
          setIsFormOpen(true);
        }}
      />

      <AssetQrModal
        asset={qrAsset}
        onClose={() => setQrAsset(null)}
      />

      <AssetFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditAsset(null);
        }}
        onSave={handleSaveAsset}
        initialAsset={editAsset}
      />
    </div>
  );
}
