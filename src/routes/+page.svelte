<script>
  import { base } from '$app/paths';
  import { initializeDB, searchInDB } from '$lib/db';
  import { onMount } from 'svelte';

  onMount(() => {
    initializeDB(['four', 'five', 'love']);
    searchInDB({ searchLetters: [{ letter: 'f', position: 0 }] });
  });
</script>

<div class="flex flex-col justify-center items-center w-full space-y-6">
  <div class="max-w-lg">
    <enhanced:img src="./coco-background.png" alt="Background of the game" />
  </div>
  <a class="btn btn-primary min-w-36" href="{base}/play">Play</a>
</div>
