document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...

    const daySpans = document.querySelectorAll(".day-container > span");
    const pageDays = Array.from(daySpans).map(span =>
        span.textContent.trim().split(" - ")[0]
    );

    /*
     * Detect the week layout from the actual page structure.
     *
     * Sunday-start / Israel-friendly:
     *   Sunday + Monday
     *   Tuesday + Wednesday
     *   Thursday + Friday
     *   Saturday
     *
     * Monday-start:
     *   Monday + Tuesday
     *   Wednesday + Thursday
     *   Friday + Saturday
     *   Sunday
     */
    
    const firstDay = pageDays[0];

    const isSundayStartLayout =
        firstDay === "Sunday" ||
        firstDay === "Tuesday" ||
        firstDay === "Thursday" ||
        firstDay === "Saturday" ||
        (firstDay === "Monday" && pageDays.length === 2);

    // Calculate the start date of the week based on layout type.
    let weekStart = new Date(today);

    if (isSundayStartLayout) {
        // Israel-friendly week: Sunday → Saturday.
        weekStart.setDate(today.getDate() - dayOfWeek);
    } else {
        // Monday-start week: Monday → Sunday.
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        weekStart.setDate(today.getDate() + distanceToMonday);
    }

    // Calculate the final day of the week.
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Update main header title.
    const heading = document.querySelector("h1");

    if (heading) {
        const startMonth = weekStart.toLocaleString("en-US", {
            month: "short"
        });

        const endMonth = weekEnd.toLocaleString("en-US", {
            month: "short"
        });

        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();

        const weekSpan = startMonth === endMonth
            ? `${startMonth} ${startDay} - ${endDay}`
            : `${startMonth} ${startDay} - ${endMonth} ${endDay}`;

        heading.textContent = `My Choices - ${weekSpan}`;
    }

    // Define day offsets relative to weekStart.
    const dayOffsets = isSundayStartLayout
        ? {
            "Sunday": 0,
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6
        }
        : {
            "Monday": 0,
            "Tuesday": 1,
            "Wednesday": 2,
            "Thursday": 3,
            "Friday": 4,
            "Saturday": 5,
            "Sunday": 6
        };

    // Update day table labels with their calendar dates.
    daySpans.forEach(span => {
        const dayName = span.textContent.trim().split(" - ")[0];

        if (Object.prototype.hasOwnProperty.call(dayOffsets, dayName)) {
            const targetDate = new Date(weekStart);

            targetDate.setDate(
                weekStart.getDate() + dayOffsets[dayName]
            );

            span.textContent = `${dayName} - ${targetDate.getDate()}`;
        }
    });
});