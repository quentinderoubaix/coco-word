<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import words from 'an-array-of-english-words';
  import { initializeDB, searchInDB } from '$lib/db';
  import '../app.css';
  import '@fontsource-variable/oswald';

  async function initialize() {
    await initializeDB(words);
  }

  onMount(() => {
    initialize();
  });
</script>

<div class="navbar bg-primary text-primary-content">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl" href="{base}/">Coco Word</a>
  </div>
</div>
<slot />
