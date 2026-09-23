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

// Supported years range: 2025 to 2050 (extensible dynamically)
export const MIN_YEAR = 2025;
export const MAX_YEAR = 2050;

export const SUPPORTED_YEARS: number[] = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MIN_YEAR + i
);

/**
 * Checks whether a given Gregorian year is a leap year (tahun kabisat)
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Calculates Western Easter Sunday using Meeus/Jones/Butcher algorithm
 * Works precisely for any Gregorian year
 */
export function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-based: 2=March, 3=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

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
 */
export function getWuku(date: Date): string {
  const localYear = date.getFullYear();
  const localMonth = date.getMonth();
  const localDay = date.getDate();
  const utcDate = Date.UTC(localYear, localMonth, localDay);
  const epoch = Date.UTC(1970, 0, 1);
  const diffDays = Math.floor((utcDate - epoch) / 86400000);
  
  const dayIndex = diffDays + 4; // Shift so Sunday aligns
  const wukuWeekNumber = Math.floor(dayIndex / 7);
  const wukuIndex = ((wukuWeekNumber + 5) % 30 + 30) % 30;
  return WUKU_NAMES[wukuIndex];
}

/**
 * Calculates Hijri calendar date (Kuwaiti / Umm al-Qura standard algorithm)
 * Dynamically supported for all years 2025 to 2050 and beyond
 */
export function getHijriDate(date: Date): { day: number; month: number; monthName: string; year: number } {
  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    let d = 1;
    let m = 1;
    let y = 1446;
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
    // Robust astronomical algorithmic fallback
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
      monthName: HIJRI_MONTH_NAMES[safeMonth - 1] || 'Hijri',
      year: y
    };
  }
}

function getJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const year = y + 4800 - a;
  const month = m + 12 * a - 3;
  return d + Math.floor((153 * month + 2) / 5) + 365 * year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) - 32045;
}

/**
 * Returns Javanese month and year corresponding to the date.
 * Javanese Sultan Agung calendar is synchronous with Hijri months.
 * Tahun Jawa: Hijri year + 512 (e.g. 1446 H ≈ 1958 Jawa, 1447 H ≈ 1959 Jawa, 1448 H ≈ 1960 Jawa)
 */
export function getJawaDate(_date: Date, hijriMonth: number, hijriYear: number): { monthName: string; year: number } {
  const monthName = JAWA_MONTH_NAMES[(hijriMonth - 1 + 12) % 12];
  const year = hijriYear + 512;
  return { monthName, year };
}

// Astronomical & Government decreed dates for Lunar (Imlek), Saka (Nyepi), and Buddhist (Waisak)
// Pre-computed astronomical tables for 2025 - 2050
const LUNAR_HOLIDAYS_TABLE: Record<number, { imlek: string; nyepi: string; waisak: string }> = {
  2025: { imlek: '2025-01-29', nyepi: '2025-03-29', waisak: '2025-05-12' },
  2026: { imlek: '2026-02-17', nyepi: '2026-03-19', waisak: '2026-05-31' },
  2027: { imlek: '2027-02-06', nyepi: '2027-03-08', waisak: '2027-05-20' },
  2028: { imlek: '2028-01-26', nyepi: '2028-03-26', waisak: '2028-05-08' },
  2029: { imlek: '2029-02-13', nyepi: '2029-03-15', waisak: '2029-05-28' },
  2030: { imlek: '2030-02-03', nyepi: '2030-03-05', waisak: '2030-05-16' },
  2031: { imlek: '2031-01-23', nyepi: '2031-03-24', waisak: '2031-05-06' },
  2032: { imlek: '2032-02-11', nyepi: '2032-03-12', waisak: '2032-05-24' },
  2033: { imlek: '2033-01-31', nyepi: '2033-03-31', waisak: '2033-05-13' },
  2034: { imlek: '2034-02-19', nyepi: '2034-03-20', waisak: '2034-05-03' },
  2035: { imlek: '2035-02-08', nyepi: '2035-03-10', waisak: '2035-05-22' },
  2036: { imlek: '2036-01-28', nyepi: '2036-03-28', waisak: '2036-05-10' },
  2037: { imlek: '2037-02-15', nyepi: '2037-03-17', waisak: '2037-05-29' },
  2038: { imlek: '2038-02-04', nyepi: '2038-03-07', waisak: '2038-05-18' },
  2039: { imlek: '2039-01-24', nyepi: '2039-03-26', waisak: '2039-05-07' },
  2040: { imlek: '2040-02-12', nyepi: '2040-03-14', waisak: '2040-05-25' },
  2041: { imlek: '2041-02-01', nyepi: '2041-03-03', waisak: '2041-05-14' },
  2042: { imlek: '2042-01-22', nyepi: '2042-03-22', waisak: '2042-05-04' },
  2043: { imlek: '2043-02-10', nyepi: '2043-03-12', waisak: '2043-05-23' },
  2044: { imlek: '2044-01-30', nyepi: '2044-03-30', waisak: '2044-05-11' },
  2045: { imlek: '2045-02-17', nyepi: '2045-03-19', waisak: '2045-05-30' },
  2046: { imlek: '2046-02-06', nyepi: '2046-03-08', waisak: '2046-05-20' },
  2047: { imlek: '2047-01-26', nyepi: '2047-03-27', waisak: '2047-05-09' },
  2048: { imlek: '2048-02-14', nyepi: '2048-03-15', waisak: '2048-05-27' },
  2049: { imlek: '2049-02-02', nyepi: '2049-03-05', waisak: '2049-05-17' },
  2050: { imlek: '2050-01-23', nyepi: '2050-03-24', waisak: '2050-05-06' },
};

/**
 * Returns the Indonesian national holiday for a given date, dynamically computed for 2025–2050.
 */
export function getNationalHoliday(date: Date): string | null {
  const year = date.getFullYear();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateString = `${year}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  // 1. Fixed National Holidays
  const monthDay = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (monthDay === '01-01') return `Tahun Baru ${year} Masehi`;
  if (monthDay === '05-01') return 'Hari Buruh Internasional';
  if (monthDay === '06-01') return 'Hari Lahir Pancasila';
  if (monthDay === '08-17') return `Hari Kemerdekaan RI (HUT RI ke-${year - 1945})`;
  if (monthDay === '12-25') return 'Hari Raya Natal';

  // 2. Easter-based Christian Holidays
  const easter = getEasterSunday(year);
  const easterTime = easter.getTime();
  const dateTime = new Date(year, date.getMonth(), date.getDate()).getTime();
  const diffDaysFromEaster = Math.round((dateTime - easterTime) / 86400000);

  if (diffDaysFromEaster === -2) return 'Wafat Yesus Kristus (Jumat Agung)';
  if (diffDaysFromEaster === 0) return 'Kebangkitan Yesus Kristus (Hari Paskah)';
  if (diffDaysFromEaster === 39) return 'Kenaikan Yesus Kristus';

  // 3. Lunar & Saka Holidays (Imlek, Nyepi, Waisak)
  const lunarData = LUNAR_HOLIDAYS_TABLE[year];
  if (lunarData) {
    if (dateString === lunarData.imlek) {
      const kongziliYear = year + 551;
      return `Tahun Baru Imlek ${kongziliYear} Kongzili`;
    }
    if (dateString === lunarData.nyepi) {
      const sakaYear = year - 78;
      return `Hari Suci Nyepi (Tahun Baru Saka ${sakaYear})`;
    }
    if (dateString === lunarData.waisak) {
      const buddhistYear = year + 544;
      return `Hari Raya Waisak ${buddhistYear} BE`;
    }
  }

  // 4. Islamic Holidays (calculated via dynamic Hijri algorithm)
  const hijri = getHijriDate(date);
  // 1 Muharram: Tahun Baru Islam
  if (hijri.month === 1 && hijri.day === 1) {
    return `1 Muharram Tahun Baru Islam ${hijri.year} H`;
  }
  // 12 Rabiul Awal: Maulid Nabi Muhammad SAW
  if (hijri.month === 3 && hijri.day === 12) {
    return `Maulid Nabi Muhammad SAW ${hijri.year} H`;
  }
  // 27 Rajab: Isra Mi'raj
  if (hijri.month === 7 && hijri.day === 27) {
    return `Isra Mi'raj Nabi Muhammad SAW ${hijri.year} H`;
  }
  // 1 & 2 Syawal: Idul Fitri
  if (hijri.month === 10 && hijri.day === 1) {
    return `Hari Raya Idul Fitri ${hijri.year} H (Hari ke-1)`;
  }
  if (hijri.month === 10 && hijri.day === 2) {
    return `Hari Raya Idul Fitri ${hijri.year} H (Hari ke-2)`;
  }
  // 10 Dzulhijjah: Idul Adha
  if (hijri.month === 12 && hijri.day === 10) {
    return `Hari Raya Idul Adha ${hijri.year} H`;
  }

  return null;
}

// Global lookup for backward compatibility
export const NATIONAL_HOLIDAYS: Record<string, string> = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (typeof prop !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(prop)) return undefined;
      const [y, m, d] = prop.split('-').map(Number);
      const dt = new Date(y, m - 1, d);
      return getNationalHoliday(dt) || undefined;
    }
  }
);

export const HOLIDAYS_2027 = NATIONAL_HOLIDAYS;

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
  
  const holidayName = getNationalHoliday(date);
  const isHoliday = !!holidayName || dayOfWeek === 0; // Sundays are also red in Indonesia
  
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
    holidayName: holidayName || undefined,
    isCurrentMonth,
    isToday
  };
}

/**
 * Returns complete 5 or 6 rows of 7 days (starting Sunday) for the given month and year.
 * Correctly accounts for leap years (Feb 29) and month boundaries.
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
  
  // Current month days (Handles Feb 28 or 29 automatically based on leap year)
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
