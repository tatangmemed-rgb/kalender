import { DayCalendarInfo, PasaranType } from '../types';

export const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAY_NAMES_ID = [
  'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
];

export const DAY_NAMES_JAWA = [
  'Ahad', 'Senen', 'Selasa', 'Rebo', 'Kemis', 'Jemuwah', 'Setu'
];

export const PASARAN_NAMES: PasaranType[] = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

export const HIJRI_MONTH_NAMES = [
  'Muharram', 'Safar', "Rabi'ul Awal", "Rabi'ul Akhir",
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
  'Ramadan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah'
];

export const JAWA_MONTH_NAMES = [
  'Sura', 'Sapar', 'Mulud', 'Bakda Mulud',
  'Jumadilawal', 'Jumadilakhir', 'Rejeb', 'Ruwah',
  'Pasa', 'Sawal', 'Dulkangidah', 'Besar'
];

export const WUKU_NAMES = [
  'Sinta', 'Landep', 'Wukir', 'Kurantil', 'Tolu', 'Gumbreg',
  'Warigalit', 'Warigagung', 'Julungwangi', 'Sungsang', 'Galungan', 'Kuningan',
  'Langkir', 'Mandasiya', 'Julungpujut', 'Pahang', 'Kuruwelut', 'Marakeh',
  'Tambir', 'Medangkungan', 'Maktal', 'Wuye', 'Manahil', 'Prangbakat',
  'Bala', 'Wugu', 'Wayang', 'Kulawu', 'Dukut', 'Watugunung'
];

// Neptu weights
const NEPTU_HARI = [5, 4, 3, 7, 8, 6, 9]; // Minggu=5, Senin=4, Selasa=3, Rabu=7, Kamis=8, Jumat=6, Sabtu=9
const NEPTU_PASARAN: Record<PasaranType, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
};

// Supported years 2025 - 2030
export const SUPPORTED_YEARS = [2025, 2026, 2027, 2028, 2029, 2030] as const;

// Indonesian National Holidays covering 2025 through 2030
export const NATIONAL_HOLIDAYS: Record<string, string> = {
  // === 2025 ===
  '2025-01-01': 'Tahun Baru 2025 Masehi',
  '2025-01-27': "Isra Mi'raj Nabi Muhammad SAW 1446 H",
  '2025-01-29': 'Tahun Baru Imlek 2576 Kongzili',
  '2025-03-29': 'Hari Suci Nyepi (Tahun Baru Saka 1947)',
  '2025-03-31': 'Hari Raya Idul Fitri 1446 H (Hari ke-1)',
  '2025-04-01': 'Hari Raya Idul Fitri 1446 H (Hari ke-2)',
  '2025-04-18': 'Wafat Yesus Kristus (Jumat Agung)',
  '2025-04-20': 'Kebangkitan Yesus Kristus (Paskah)',
  '2025-05-01': 'Hari Buruh Internasional',
  '2025-05-12': 'Hari Raya Waisak 2569 BE',
  '2025-05-29': 'Kenaikan Yesus Kristus',
  '2025-06-01': 'Hari Lahir Pancasila',
  '2025-06-06': 'Hari Raya Idul Adha 1446 H',
  '2025-06-27': '1 Muharram Tahun Baru Islam 1447 H',
  '2025-08-17': 'Hari Kemerdekaan RI (HUT RI ke-80)',
  '2025-09-05': 'Maulid Nabi Muhammad SAW 1447 H',
  '2025-12-25': 'Hari Raya Natal',

  // === 2026 ===
  '2026-01-01': 'Tahun Baru 2026 Masehi',
  '2026-01-16': "Isra Mi'raj Nabi Muhammad SAW 1447 H",
  '2026-02-17': 'Tahun Baru Imlek 2577 Kongzili',
  '2026-03-19': 'Hari Suci Nyepi (Tahun Baru Saka 1948)',
  '2026-03-20': 'Hari Raya Idul Fitri 1447 H (Hari ke-1)',
  '2026-03-21': 'Hari Raya Idul Fitri 1447 H (Hari ke-2)',
  '2026-04-03': 'Wafat Yesus Kristus (Jumat Agung)',
  '2026-04-05': 'Hari Paskah',
  '2026-05-01': 'Hari Buruh Internasional',
  '2026-05-14': 'Kenaikan Yesus Kristus',
  '2026-05-27': 'Hari Raya Idul Adha 1447 H',
  '2026-05-31': 'Hari Raya Waisak 2570 BE',
  '2026-06-01': 'Hari Lahir Pancasila',
  '2026-06-16': '1 Muharram Tahun Baru Islam 1448 H',
  '2026-08-17': 'Hari Kemerdekaan RI (HUT RI ke-81)',
  '2026-08-25': 'Maulid Nabi Muhammad SAW 1448 H',
  '2026-12-25': 'Hari Raya Natal',

  // === 2027 ===
  '2027-01-01': 'Tahun Baru 2027 Masehi',
  '2027-01-05': "Isra Mi'raj Nabi Muhammad SAW 1448 H",
  '2027-02-06': 'Tahun Baru Imlek 2578 Kongzili',
  '2027-03-08': 'Hari Suci Nyepi (Tahun Baru Saka 1949)',
  '2027-03-10': 'Hari Raya Idul Fitri 1448 H (Hari ke-1)',
  '2027-03-11': 'Hari Raya Idul Fitri 1448 H (Hari ke-2)',
  '2027-03-26': 'Wafat Yesus Kristus (Jumat Agung)',
  '2027-03-28': 'Hari Paskah',
  '2027-05-01': 'Hari Buruh Internasional',
  '2027-05-06': 'Kenaikan Yesus Kristus',
  '2027-05-17': 'Hari Raya Idul Adha 1448 H',
  '2027-05-20': 'Hari Raya Waisak 2571 BE',
  '2027-06-01': 'Hari Lahir Pancasila',
  '2027-06-06': '1 Muharram Tahun Baru Islam 1449 H',
  '2027-08-15': 'Maulid Nabi Muhammad SAW 1449 H',
  '2027-08-17': 'Hari Kemerdekaan RI (HUT RI ke-82)',
  '2027-12-25': 'Hari Raya Natal',

  // === 2028 ===
  '2028-01-01': 'Tahun Baru 2028 Masehi',
  '2028-01-26': 'Tahun Baru Imlek 2579 Kongzili',
  '2028-02-27': 'Hari Raya Idul Fitri 1449 H (Hari ke-1)',
  '2028-02-28': 'Hari Raya Idul Fitri 1449 H (Hari ke-2)',
  '2028-03-26': 'Hari Suci Nyepi (Tahun Baru Saka 1950)',
  '2028-04-14': 'Wafat Yesus Kristus (Jumat Agung)',
  '2028-04-16': 'Hari Paskah',
  '2028-05-01': 'Hari Buruh Internasional',
  '2028-05-05': 'Hari Raya Idul Adha 1449 H',
  '2028-05-08': 'Hari Raya Waisak 2572 BE',
  '2028-05-25': 'Kenaikan Yesus Kristus',
  '2028-05-26': '1 Muharram Tahun Baru Islam 1450 H',
  '2028-06-01': 'Hari Lahir Pancasila',
  '2028-08-04': 'Maulid Nabi Muhammad SAW 1450 H',
  '2028-08-17': 'Hari Kemerdekaan RI (HUT RI ke-83)',
  '2028-12-14': "Isra Mi'raj Nabi Muhammad SAW 1450 H",
  '2028-12-25': 'Hari Raya Natal',

  // === 2029 ===
  '2029-01-01': 'Tahun Baru 2029 Masehi',
  '2029-02-13': 'Tahun Baru Imlek 2580 Kongzili',
  '2029-02-15': 'Hari Raya Idul Fitri 1450 H (Hari ke-1)',
  '2029-02-16': 'Hari Raya Idul Fitri 1450 H (Hari ke-2)',
  '2029-03-15': 'Hari Suci Nyepi (Tahun Baru Saka 1951)',
  '2029-03-30': 'Wafat Yesus Kristus (Jumat Agung)',
  '2029-04-01': 'Hari Paskah',
  '2029-04-24': 'Hari Raya Idul Adha 1450 H',
  '2029-05-01': 'Hari Buruh Internasional',
  '2029-05-10': 'Kenaikan Yesus Kristus',
  '2029-05-15': '1 Muharram Tahun Baru Islam 1451 H',
  '2029-05-28': 'Hari Raya Waisak 2573 BE',
  '2029-06-01': 'Hari Lahir Pancasila',
  '2029-07-24': 'Maulid Nabi Muhammad SAW 1451 H',
  '2029-08-17': 'Hari Kemerdekaan RI (HUT RI ke-84)',
  '2029-12-04': "Isra Mi'raj Nabi Muhammad SAW 1451 H",
  '2029-12-25': 'Hari Raya Natal',

  // === 2030 ===
  '2030-01-01': 'Tahun Baru 2030 Masehi',
  '2030-02-03': 'Tahun Baru Imlek 2581 Kongzili',
  '2030-02-05': 'Hari Raya Idul Fitri 1451 H (Hari ke-1)',
  '2030-02-06': 'Hari Raya Idul Fitri 1451 H (Hari ke-2)',
  '2030-03-05': 'Hari Suci Nyepi (Tahun Baru Saka 1952)',
  '2030-04-14': 'Hari Raya Idul Adha 1451 H',
  '2030-04-19': 'Wafat Yesus Kristus (Jumat Agung)',
  '2030-04-21': 'Hari Paskah',
  '2030-05-01': 'Hari Buruh Internasional',
  '2030-05-05': '1 Muharram Tahun Baru Islam 1452 H',
  '2030-05-16': 'Hari Raya Waisak 2574 BE',
  '2030-05-30': 'Kenaikan Yesus Kristus',
  '2030-06-01': 'Hari Lahir Pancasila',
  '2030-07-14': 'Maulid Nabi Muhammad SAW 1452 H',
  '2030-08-17': 'Hari Kemerdekaan RI (HUT RI ke-85)',
  '2030-11-23': "Isra Mi'raj Nabi Muhammad SAW 1452 H",
  '2030-12-25': 'Hari Raya Natal',
};

// Kept for backward compatibility
export const HOLIDAYS_2027 = NATIONAL_HOLIDAYS;

/**
 * Calculates Pasaran Jawa using astronomical base epoch.
 * Epoch: 1970-01-01 was Thursday (Kemis) Wage (Pasaran index 3).
 * Verification: 1945-08-17 was Friday Legi (Pasaran index 0).
 */
export function getPasaranJawa(date: Date): PasaranType {
  const localYear = date.getFullYear();
  const localMonth = date.getMonth();
  const localDay = date.getDate();
  const utcDate = Date.UTC(localYear, localMonth, localDay);
  const epoch = Date.UTC(1970, 0, 1);
  const diffDays = Math.floor((utcDate - epoch) / 86400000);
  
  // (diffDays + 3) % 5
  const pasaranIndex = ((diffDays + 3) % 5 + 5) % 5;
  return PASARAN_NAMES[pasaranIndex];
}

/**
 * Calculates Wuku Jawa (cycle of 30 wuku, each 7 days, starting Sunday)
 * Anchor: 1970-01-01 was Kemis in Wuku Gumbreg (index 5)
 */
export function getWuku(date: Date): string {
  const localYear = date.getFullYear();
  const localMonth = date.getMonth();
  const localDay = date.getDate();
  const utcDate = Date.UTC(localYear, localMonth, localDay);
  const epoch = Date.UTC(1970, 0, 1);
  const diffDays = Math.floor((utcDate - epoch) / 86400000);
  
  // Wuku changes every Sunday.
  // 1970-01-01 was Thursday (Kemis). The Sunday before 1970-01-01 was 1969-12-28.
  // Using calibrated Wuku epoch offset:
  const dayIndex = diffDays + 4; // Shift so Sunday aligns
  const wukuWeekNumber = Math.floor(dayIndex / 7);
  const wukuIndex = ((wukuWeekNumber + 5) % 30 + 30) % 30;
  return WUKU_NAMES[wukuIndex];
}

/**
 * Calculates Hijri calendar date (Kuwaiti / Umm al-Qura standard algorithm)
 * For 2027, covers 1448 H (Rajab - Dzulhijjah) and 1449 H (Muharram - Rajab)
 */
export function getHijriDate(date: Date): { day: number; month: number; monthName: string; year: number } {
  // Use Intl if supported for Islamic Umm al-Qura
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    let d = 1;
    let m = 1;
    let y = 1448;
    for (const part of parts) {
      if (part.type === 'day') d = parseInt(part.value, 10);
      if (part.type === 'month') m = parseInt(part.value, 10);
      if (part.type === 'year') y = parseInt(part.value, 10);
    }
    const safeMonth = Math.max(1, Math.min(12, m));
    return {
      day: d,
      month: safeMonth,
      monthName: HIJRI_MONTH_NAMES[safeMonth - 1] || 'Hijri',
      year: y
    };
  } catch {
    // Robust algorithmic astronomical fallback
    const jd = getJulianDay(date);
    const l = Math.floor(jd - 1948440 + 10632);
    const n = Math.floor((l - 1) / 10631);
    const l2 = Math.floor(l - 10631 * n + 354);
    const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
    const l3 = Math.floor(l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29);
    const m = Math.floor((24 * l3) / 709);
    const d = Math.floor(l3 - Math.floor((709 * m) / 24));
    const y = Math.floor(30 * n + j - 30);
    const safeMonth = Math.max(1, Math.min(12, m));
    return {
      day: d,
      month: safeMonth,
      monthName: HIJRI_MONTH_NAMES[safeMonth - 1],
      year: y
    };
  }
}

function getJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let a = Math.floor((14 - m) / 12);
  let year = y + 4800 - a;
  let month = m + 12 * a - 3;
  return d + Math.floor((153 * month + 2) / 5) + 365 * year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) - 32045;
}

/**
 * Returns Javanese month and year corresponding to the date.
 * Javanese Sultan Agung calendar is synchronous with Hijri months.
 * Tahun Jawa: Hijri year + 512 (e.g. 1448 H ≈ 1960 Jawa 'Dal', 1449 H ≈ 1961 Jawa 'Be')
 */
export function getJawaDate(date: Date, hijriMonth: number, hijriYear: number): { monthName: string; year: number } {
  const monthName = JAWA_MONTH_NAMES[(hijriMonth - 1 + 12) % 12];
  const year = hijriYear + 512;
  return { monthName, year };
}

/**
 * Returns formatted DayCalendarInfo for any specific date
 */
export function getDayInfo(date: Date, targetMonth?: number): DayCalendarInfo {
  const year = date.getFullYear();
  const month = date.getMonth();
  const dayOfMonth = date.getDate();
  const dayOfWeek = date.getDay(); // 0 = Minggu
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString = `${year}-${pad(month + 1)}-${pad(dayOfMonth)}`;
  
  const pasaran = getPasaranJawa(date);
  const neptuHari = NEPTU_HARI[dayOfWeek];
  const neptuPasaran = NEPTU_PASARAN[pasaran];
  const neptu = neptuHari + neptuPasaran;
  
  const hijri = getHijriDate(date);
  const jawa = getJawaDate(date, hijri.month, hijri.year);
  const wuku = getWuku(date);
  
  let holidayName = NATIONAL_HOLIDAYS[dateString];
  if (!holidayName) {
    const monthDay = `${pad(month + 1)}-${pad(dayOfMonth)}`;
    if (monthDay === '01-01') holidayName = `Tahun Baru ${year} Masehi`;
    else if (monthDay === '05-01') holidayName = 'Hari Buruh Internasional';
    else if (monthDay === '06-01') holidayName = 'Hari Lahir Pancasila';
    else if (monthDay === '08-17') holidayName = `Hari Kemerdekaan RI (HUT RI ke-${year - 1945})`;
    else if (monthDay === '12-25') holidayName = 'Hari Raya Natal';
  }
  const isHoliday = !!holidayName || dayOfWeek === 0; // Sundays are also red/holidays in Indonesia
  
  const now = new Date();
  const isToday = 
    now.getFullYear() === year && 
    now.getMonth() === month && 
    now.getDate() === dayOfMonth;
    
  const isCurrentMonth = targetMonth === undefined ? true : month === targetMonth;

  return {
    date,
    dateString,
    dayOfMonth,
    dayOfWeek,
    dayNameMasehi: DAY_NAMES_ID[dayOfWeek],
    dayNameJawa: DAY_NAMES_JAWA[dayOfWeek],
    pasaran,
    neptu,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriMonthName: hijri.monthName,
    hijriYear: hijri.year,
    jawaMonthName: jawa.monthName,
    jawaYear: jawa.year,
    wuku,
    isHoliday,
    holidayName,
    isCurrentMonth,
    isToday
  };
}

/**
 * Returns complete 5 or 6 rows of 7 days (starting Sunday) for the given month and year.
 */
export function getMonthCalendar(year: number, month: number): DayCalendarInfo[] {
  const days: DayCalendarInfo[] = [];
  
  // First day of month
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay(); // 0 is Sunday
  
  // Days from previous month to pad first row
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDate - i);
    days.push(getDayInfo(prevDate, month));
  }
  
  // Current month days
  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= lastDate; d++) {
    const curDate = new Date(year, month, d);
    days.push(getDayInfo(curDate, month));
  }
  
  // Trailing days from next month to complete the 35 or 42 grid slots
  const remaining = (7 - (days.length % 7)) % 7;
  for (let nextD = 1; nextD <= remaining; nextD++) {
    const nextDate = new Date(year, month + 1, nextD);
    days.push(getDayInfo(nextDate, month));
  }
  
  return days;
}

/**
 * Friendly full Indonesian date string: "Selasa Pon, 17 Agustus 2027"
 */
export function formatDateFullIndonesian(dateString: string): string {
  const parts = dateString.split('-').map(Number);
  if (parts.length < 3) return dateString;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const info = getDayInfo(d);
  return `${info.dayNameMasehi} ${info.pasaran}, ${info.dayOfMonth} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format date for headers or lists: "17 Agu 2027"
 */
export function formatDateShortIndonesian(dateString: string): string {
  const parts = dateString.split('-').map(Number);
  if (parts.length < 3) return dateString;
  const monthAbbr = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${parts[2]} ${monthAbbr[parts[1] - 1]} ${parts[0]}`;
}
