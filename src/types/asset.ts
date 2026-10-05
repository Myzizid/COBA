export type KibType = 'KIB_A' | 'KIB_B' | 'KIB_C' | 'KIB_D' | 'KIB_E' | 'KIB_F';

export interface KibMetadata {
  code: KibType;
  title: string;
  shortName: string;
  description: string;
  iconName: string;
}

export type AssetCondition = 'Baik' | 'Kurang Baik' | 'Rusak Berat';
export type LegalStatus = 'Bersertifikat' | 'Belum Bersertifikat' | 'Proses Sertifikasi' | 'Sengketa';
export type UtilizationStatus = 'Digunakan Sendiri' | 'Disewakan' | 'Pinjam Pakai' | 'KSP / Mitra' | 'Idle / Siap Pemanfaatan' | 'Usul Penghapusan';

export interface AssetRecord {
  id: string;
  kodeBarang: string;
  register: string;
  namaBarang: string;
  kibType: KibType;
  opd: string; // Organisasi Perangkat Daerah / SKPD
  tahunPerolehan: number;
  hargaPerolehan: number;
  nilaiPenyusutan: number;
  nilaiBuku: number;
  kondisi: AssetCondition;
  statusLegalitas: LegalStatus;
  nomorDokumen: string; // Nomor Sertifikat / BPKB / IMB
  lokasiAlamat: string;
  kecamatan: string;
  koordinat: {
    lat: number;
    lng: number;
  };
  luasM2?: number;
  panjangKm?: number;
  merkModel?: string;
  nomorPolisi?: string;
  nomorRangkaMesin?: string;
  masaManfaatTahun: number;
  statusPemanfaatan: UtilizationStatus;
  fotoUrl: string;
  keterangan: string;
  terakhirDiperiksa?: string;
  jadwalPemeliharaanBerikutnya?: string;
}

export interface MaintenanceRecord {
  id: string;
  asetId: string;
  namaBarang: string;
  kodeBarang: string;
  opd: string;
  jenisPemeliharaan: string;
  tanggalJadwal: string;
  biayaEstimasi: number;
  penanggungJawab: string;
  status: 'Terjadwal' | 'Dalam Proses' | 'Selesai' | 'Tertunda';
  catatanTeknis: string;
}

export interface UtilizationItem {
  id: string;
  asetId: string;
  namaAset: string;
  lokasi: string;
  jenisAset: string;
  luasTersedia: string;
  tarifDasar: number; // per tahun / bulan
  satuanTarif: 'Per Tahun' | 'Per Bulan' | 'Per Hari';
  statusSewa: 'Tersedia' | 'Disewa' | 'Dalam Proses Negosiasi';
  penyewaSaatIni?: string;
  periodeSelesai?: string;
  potensiPADTahunan: number;
  fotoUrl: string;
}

export interface PublicReportItem {
  id: string;
  nomorTiket: string;
  namaPelapor: string;
  kontak: string;
  judulLaporan: string;
  kategori: 'Aset Terbengkalai / Mangkrak' | 'Penyalahgunaan Kendaraan Dinas' | 'Perusakan Fasilitas Publik' | 'Klaim / Penyerobotan Lahan' | 'Lainnya';
  lokasiAlamat: string;
  deskripsi: string;
  tanggalLapor: string;
  status: 'Menunggu Verifikasi' | 'Investigasi Lapangan' | 'Tindak Lanjut OPD' | 'Selesai';
  tanggapanPetugas?: string;
}
