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

    // Anchor: Sep 11, 2023 was Puagme 6, 2015.
    const anchorGregorian = new Date(2023, 8, 11); // Sep 11, 2023
    const anchorEthiopian = { year: 2015, month: 12, day: 6 }; // Puagme 6, 2015

    const diffTime = inputDate.getTime() - anchorGregorian.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

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
export function formatEthiopianTime(date: Date): string {
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes();

    // Ethiopian time calculation: (Hours + 6) % 12. If 0, return 12.
    let ethiopianHours = (hours + 6) % 12;
    if (ethiopianHours === 0) ethiopianHours = 12;

    const minutesStr = minutes.toString().padStart(2, '0');

    // Determine Amharic period
    // 6:00 AM - 11:59 AM: Morning (ጠዋት)
    // 12:00 PM - 5:59 PM: Afternoon (ከሰዓት)
    // 6:00 PM - 8:59 PM: Evening (ማታ)
    // 9:00 PM - 5:59 AM: Night (ሌሊት)

    let period = "";
    if (hours >= 6 && hours < 12) {
        period = "ጠዋት";
    } else if (hours >= 12 && hours < 18) {
        period = "ከሰዓት";
    } else if (hours >= 18 && hours < 21) {
        period = "ማታ";
    } else {
        period = "ሌሊት";
    }

    return `${ethiopianHours}:${minutesStr}(${period})`;
}

export function getTimePeriod(date: Date): string {
    const hours = date.getHours();

    if (hours >= 6 && hours < 12) {
        return "(Morning)";
    } else if (hours >= 12 && hours < 18) {
        return "(Afternoon)";
    } else if (hours >= 18 && hours < 21) {
        return "(Evening)";
    } else {
        return "(Night)";
    }
}
