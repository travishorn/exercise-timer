<script>
  import { browser } from "$app/environment";
  import { formatTime, timeExercises } from "$lib";
  import Button from "$lib/Button.svelte";
  import exercises from "$lib/exercises.json";
  import chime from '$lib/chime.mp3';

  // Add start and end times (in ms) to the exercise array
  const timedExercises = timeExercises(exercises);

  // Calculate the total duration of the routine
  const totalDuration = exercises.reduce((sum, prev) => sum + prev.duration, 0);

  /** @type {number} */
  let interval;
  
  /** @type {number} */
  let time = 0;

  /** @type {App.TimerStatus} */
  let status = "notStarted";

  /** @type {WakeLockSentinel}*/
  let wakeLock;

  /** @type {App.TimedExercise | undefined} */
  let previousExercise;

  // Start the timer, set the status to running, and keep the screen from turning off
  async function start() {
    interval = setInterval(() => {
      time += 100;
      if (time >= totalDuration) {
        clearInterval(interval);
        status = "finished";
      }
    }, 100);

    status = "running";
    wakeLock = await navigator.wakeLock.request("screen");
  }

  // Stop the timer, set the status to paused, and allow the screen to turn off when idle
  function pause() {
    clearInterval(interval);
    status = "paused";
    if (wakeLock !== null) wakeLock.release();
  }

  // Stop the timer, set the status to not started, allow the screen to turn off, and reset the time
  // to zero
  function cancel() {
    clearInterval(interval);
    status = "notStarted";
    if (wakeLock !== null) wakeLock.release();
    time = 0;
  }

  // Set the current exercise based on the time and the exercise start/end times
  $: currentExercise = timedExercises.find((e) => time >= e.start && time < e.end);

  // Exercise change notification
  $: if (currentExercise !== previousExercise) {
    // Only on browser and when its not the first exercise
    if (browser && time !== 0 && currentExercise) {
      // If text-to-speech is available, speak the exercise title
      if (typeof window.SpeechSynthesisUtterance !== "undefined") {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentExercise.title);
        window.speechSynthesis.speak(utterance);
      } else {
        // Otherwise, play a chime
        const chimeAudio = new Audio(chime);
        chimeAudio.play();
      }
    }
    
    previousExercise = currentExercise;
  }
</script>

<div class="min-h-screen bg-slate-900 text-slate-50 flex flex-col justify-center p-5">
  <div class="w-full max-w-[500px] mx-auto">
    <div class="text-2xl text-center h-20">
      {currentExercise?.title ?? ""}
    </div>

    <div class="text-slate-400 text-center h-32">
      {currentExercise?.description ?? ""}
    </div>

    <div class="flex flex-col gap-8">
      <div class="w-full flex flex-col">
        <div class="text-slate-400 text-center">
          {formatTime(time)}
        </div>

        <input type="range" min="0" max={totalDuration} step="100" bind:value={time} />
      </div>

      <div class={`flex gap-4 mx-auto ${["notStarted", "finished"].includes(status) ? "justify-center" : "justify-between"}`}>
        {#if status === "notStarted"}
          <Button on:click={start}>Start</Button>
        {/if}

        {#if status === "running"}
          <Button on:click={cancel}>Cancel</Button>
          <Button on:click={pause}>Pause</Button>
        {/if}

        {#if status === "paused"}
          <Button on:click={cancel}>Cancel</Button>
          <Button on:click={start}>Resume</Button>
        {/if}

        {#if status === "finished"}
          <Button on:click={cancel}>Reset</Button>
        {/if}
      </div>
    </div>
  </div>
</div>