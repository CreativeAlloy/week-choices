document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...

    // Detect if the page belongs to a Sunday-start layout vs a Monday-start layout
    // by checking if the page contains Sunday (index-1 to index-4 of Sunday series contain Sun, Mon, Tue/Wed, Thu/Fri, Sat)
    const daySpans = document.querySelectorAll(".day-container > span");
    const pageDays = Array.from(daySpans).map(span => span.textContent.trim().split(" - ")[0]);

    const isSundayStartLayout = pageDays.some(day => ["Sunday", "Tuesday", "Thursday"].includes(day)) 
        && !pageDays.includes("Wednesday") // Excludes Mon/Tue page of Monday-start layout
        && !pageDays.includes("Friday");   // Excludes Wed/Thu page of Monday-start layout

    // Calculate the start date of the week based on layout type
    let weekStart = new Date(today);

    if (isSundayStartLayout) {
        // Week starts on Sunday
        weekStart.setDate(today.getDate() - dayOfWeek);
    } else {
        // Week starts on Monday
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        weekStart.setDate(today.getDate() + distanceToMonday);
    }

    // Calculate the 7th day of the week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // 1. Update main header title
    const heading = document.querySelector("h1");
    if (heading) {
        const startMonth = weekStart.toLocaleString("en-US", { month: "short" });
        const endMonth = weekEnd.toLocaleString("en-US", { month: "short" });
        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();

        const weekSpan = startMonth === endMonth 
            ? `${startMonth} ${startDay} - ${endDay}` 
            : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

        heading.textContent = `My Choices - ${weekSpan}`;
    }

    // 2. Define day offsets relative to weekStart
    const dayOffsets = isSundayStartLayout 
        ? { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 }
        : { "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6 };

    // 3. Update day table labels
    daySpans.forEach(span => {
        const dayName = span.textContent.trim().split(" - ")[0];
        if (dayOffsets.hasOwnProperty(dayName)) {
            const targetDate = new Date(weekStart);
            targetDate.setDate(weekStart.getDate() + dayOffsets[dayName]);
            span.textContent = `${dayName} - ${targetDate.getDate()}`;
        }
    });
});