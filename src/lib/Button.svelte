<script>
    import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click');
  }
</script>


<button class="border border-slate-50 text-slate-50 rounded-full w-24 h-8" on:click={handleClick}><slot /></button>