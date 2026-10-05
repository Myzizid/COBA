import React from 'react';
import { Plus, Printer, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenReportPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenReportPrint,
}) => {
  const navItems = [
    { id: 'ringkasan', label: 'Ringkasan' },
    { id: 'inventaris', label: 'Inventaris KIB' },
    { id: 'peta', label: 'Peta Geospasial' },
    { id: 'pemanfaatan', label: 'Pemanfaatan & PAD' },
    { id: 'pemeliharaan', label: 'Pemeliharaan' },
    { id: 'pengaduan', label: 'Pengaduan' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => setActiveTab('ringkasan')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-base shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                SIMBADA
              </span>
              <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                Sistem Manajemen Aset Daerah
              </span>
            </div>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`py-2 transition-colors relative whitespace-nowrap ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenReportPrint}
              title="Cetak Rekapitulasi Inventaris BMD Format Permendagri"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak Laporan</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrasi Aset</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded whitespace-nowrap font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
