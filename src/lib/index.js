/**
 * Formats milliseconds into minutes and seconds.
 * 
 * @param ms {number} - A number of milliseconds
 * @returns {string} The milliseconds formatted into minutes and seconds
 */
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * 
 * @param {App.Exercise[]} exercises
 * @returns {App.TimedExercise[]}
 */
export function timeExercises(exercises) {
  return exercises.map((e, i) => {
    const start = i === 0 ? 0 : exercises.slice(0, i).reduce((sum, prev) => sum + prev.duration, 0);
    const end = start + e.duration;
    return {
      ...e,
      start,
      end
    }
  });
}