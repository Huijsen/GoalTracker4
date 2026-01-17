import { getWeekNumber } from './weekUtils';

export function calculateStreaks(dates, completionsPerWeek) {
  if (!dates.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      consistency: '0%',
      weekStreak: 0,
      longestWeekStreak: 0,
      weekConsistency: '0%'
    };
  }

  // --- Deduplicate per calendar day for daily streaks ---
  const uniqueDates = Array.from(
    new Set(dates.map(d => new Date(d).toISOString().split('T')[0]))
  );
  const sorted = uniqueDates.slice().sort();

  // ----- DAILY STREAKS -----
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) current++;
    else current = 1;
    if (current > longest) longest = current;
  }

  const lastDate = new Date(sorted[sorted.length - 1]);
  const today = new Date();
  const diffLastToday = (today - lastDate) / (1000 * 60 * 60 * 24);
  if (diffLastToday > 1) current = 0;

  // Daily consistency
  const firstDate = new Date(sorted[0]);
  const totalDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const consistencyPercent = Math.round((sorted.length / totalDays) * 100);

  // ----- WEEKLY STREAKS (completions-based) -----
  const weeks = {};
  dates.forEach(dateStr => {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const week = getWeekNumber(d);
    const key = `${year}-W${week}`;

    if (!weeks[key]) weeks[key] = 0;
    weeks[key]++; // count all completions, even same day
  });

  // If quit goal → fill in missing weeks with 0 completions
  if (completionsPerWeek === 0 && dates.length) {
    const first = new Date(dates[0]);
    const last = new Date(); // go until today
    let current = new Date(first);

    while (current <= last) {
      const year = current.getFullYear();
      const week = getWeekNumber(current);
      const key = `${year}-W${week}`;
      if (!weeks[key]) weeks[key] = 0; // ensure skipped week exists
      current.setDate(current.getDate() + 7); // jump by 7 days
    }
  }

  const weekKeys = Object.keys(weeks).sort();
  let weekStreak = 0;
  let longestWeekStreak = 0;
  let successfulWeeks = 0;

  let lastWeekIndex = null;
  weekKeys.forEach(wk => {
    const [year, weekStr] = wk.split('-W');
    const weekIndex = parseInt(year) * 52 + parseInt(weekStr); // simple index

    let success = false;
    if (completionsPerWeek === 0) success = weeks[wk] === 0;
    else success = weeks[wk] >= completionsPerWeek;

    if (success) {
      if (lastWeekIndex !== null && weekIndex !== lastWeekIndex + 1) {
        weekStreak = 1; // reset if not consecutive
      } else {
        weekStreak++;
      }
      if (weekStreak > longestWeekStreak) longestWeekStreak = weekStreak;
      successfulWeeks++;
    } else {
      weekStreak = 0;
    }

    lastWeekIndex = weekIndex;
  });


  const weekConsistency = weekKeys.length
    ? Math.round((successfulWeeks / weekKeys.length) * 100) + '%'
    : '0%';

  return {
    currentStreak: current,
    longestStreak: longest,
    consistency: consistencyPercent + '%',
    weekStreak,
    longestWeekStreak,
    weekConsistency
  };
}
