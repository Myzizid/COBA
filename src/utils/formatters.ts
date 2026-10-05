/**
 * Format currency to Indonesian Rupiah (Rp)
 */
export function formatRupiah(value: number): string {
  if (isNaN(value)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Short human readable Rupiah (e.g. Rp 14,8 Milyar, Rp 520 Juta)
 */
export function formatRupiahShort(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `Rp ${(value / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Triliun`;
  }
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} Miliar`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} Juta`;
  }
  return formatRupiah(value);
}

/**
 * Format date in Indonesian locale (e.g. 24 September 2026)
 */
export function formatIndoDate(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate straight-line depreciation schedule according to Permendagri / SAP
 */
export interface DepreciationYearRow {
  year: number;
  nilaiAwal: number;
  bebanPenyusutan: number;
  akumulasiPenyusutan: number;
  nilaiAkhir: number;
}

export function calculateDepreciationSchedule(
  hargaPerolehan: number,
  tahunPerolehan: number,
  masaManfaat: number
): DepreciationYearRow[] {
  if (masaManfaat <= 0 || hargaPerolehan <= 0) {
    return [];
  }

  const rows: DepreciationYearRow[] = [];
  const bebanTahunan = Math.round(hargaPerolehan / masaManfaat);
  let akumulasi = 0;
  let nilaiSisa = hargaPerolehan;

  for (let i = 0; i < masaManfaat; i++) {
    const yr = tahunPerolehan + i;
    const nilaiAwal = nilaiSisa;
    // Last year takes remaining balance
    const beban = i === masaManfaat - 1 ? nilaiAwal : Math.min(bebanTahunan, nilaiAwal);
    akumulasi += beban;
    nilaiSisa = Math.max(0, nilaiAwal - beban);

    rows.push({
      year: yr,
      nilaiAwal,
      bebanPenyusutan: beban,
      akumulasiPenyusutan: akumulasi,
      nilaiAkhir: nilaiSisa,
    });
  }

  return rows;
}

/**
 * Generates a clean deterministic SVG QR-like matrix grid for asset inventory labels
 */
export function generateSvgQrMatrix(content: string, size: number = 180): string {
  // Simple deterministic hash to populate 21x21 QR-like matrix with standard position detection patterns
  const matrixSize = 21;
  const matrix: boolean[][] = Array.from({ length: matrixSize }, () =>
    Array(matrixSize).fill(false)
  );

  // Helper to draw standard 7x7 corner finder patterns
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  // 3 Corner Finders
  drawFinder(0, 0); // Top-left
  drawFinder(matrixSize - 7, 0); // Top-right
  drawFinder(0, matrixSize - 7); // Bottom-left

  // Timing lines
  for (let i = 8; i < matrixSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Pseudo-random pseudo-hashing for content
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Don't overwrite finders or timing patterns
      const inTopLeft = r <= 7 && c <= 7;
      const inTopRight = r <= 7 && c >= matrixSize - 8;
      const inBottomLeft = r >= matrixSize - 8 && c <= 7;
      const inTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming) {
        const seed = Math.sin(hash * 0.01 + r * 13 + c * 37) * 10000;
        matrix[r][c] = (seed - Math.floor(seed)) > 0.45;
      }
    }
  }

  const cellSize = size / matrixSize;
  let rects = '';
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        rects += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="#0f172a" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${rects}</svg>`;
}
