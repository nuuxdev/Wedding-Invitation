export const ETHIOPIAN_MONTHS = [
    "Meskerem",
    "Tikimt",
    "Hidar",
    "Tahsas",
    "Tir",
    "Yekatit",
    "Megabit",
    "Miazia",
    "Genbot",
    "Sene",
    "Hamle",
    "Nehase",
    "Pagume",
];

export const ETHIOPIAN_MONTHS_AM = [
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዚያ",
    "ግንቦት",
    "ሰኔ",
    "ሐምሌ",
    "ነሐሴ",
    "ጳጉሜ",
];

export const ETHIOPIAN_WEEKDAYS = [
    "እሁድ", // Sunday
    "ሰኞ",   // Monday
    "ማክሰኞ", // Tuesday
    "ረቡዕ",  // Wednesday
    "ሀሙስ",  // Thursday
    "አርብ",  // Friday
    "ቅዳሜ",  // Saturday
];

export function toEthiopian(date: Date): { year: number; month: number; day: number } {
    const inputDate = new Date(date);

    // Set to noon to avoid timezone issues
    inputDate.setHours(12, 0, 0, 0);

    // Anchor: Sep 11, 2023 was Meskerem 1, 2016.
    const anchorGregorian = new Date(2023, 8, 11); // Sep 11, 2023
    const anchorEthiopian = { year: 2016, month: 0, day: 1 }; // Meskerem 1, 2016

    const diffTime = inputDate.getTime() - anchorGregorian.getTime();
    // Add 1 day to correct for the "one day behind" issue reported
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Now add days to Ethiopian date
    // Ethiopian months are 30 days each, plus Pagume (5 or 6 days)

    let daysRemaining = diffDays;
    let currentYear = anchorEthiopian.year;
    let currentMonth = anchorEthiopian.month;
    let currentDay = anchorEthiopian.day;

    // This is an iterative approach, good for near dates

    while (daysRemaining > 0) {
        const isLeap = (currentYear + 1) % 4 === 0; // Ethiopian leap year rule (simplified)
        const daysInMonth = currentMonth === 12 ? (isLeap ? 6 : 5) : 30;

        if (daysRemaining + currentDay <= daysInMonth) {
            currentDay += daysRemaining;
            daysRemaining = 0;
        } else {
            daysRemaining -= (daysInMonth - currentDay + 1);
            currentDay = 1;
            currentMonth++;
            if (currentMonth > 12) {
                currentMonth = 0;
                currentYear++;
            }
        }
    }

    return { year: currentYear, month: currentMonth, day: currentDay };
}

export function formatEthiopianDate(date: Date | string | number): string {
    const d = new Date(date);
    const { year, month, day } = toEthiopian(d);
    const weekday = ETHIOPIAN_WEEKDAYS[d.getDay()];
    return `${weekday}, ${ETHIOPIAN_MONTHS_AM[month]} ${day}, ${year}`;
}
