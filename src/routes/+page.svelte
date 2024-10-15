<script>
  import Button from "$lib/Button.svelte";
  import { formatTime, timeExercises } from "$lib";
  import exercises from "$lib/exercises.json";

  const timedExercises = timeExercises(exercises);

  const totalDuration = exercises.reduce((sum, prev) => sum + prev.duration, 0);

  /** @type {number} */
  let interval;
  let time = 0;
  let status = "notStarted";

  function start() {
    interval = setInterval(() => {
      time += 100;
      if (time >= totalDuration) {
        clearInterval(interval);
        status = "finished";
      }
    }, 100);

    status = "running";
  }

  function pause() {
    clearInterval(interval);
    status = "paused";
  }

  function cancel() {
    clearInterval(interval);
    time = 0;
    status = "notStarted";
  }

  $: currentExercise = timedExercises.find((e) => time >= e.start && time < e.end);
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