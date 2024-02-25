<script lang="ts">
  import { searchInDB } from '$lib/db';
  import { initializeGrid } from '$lib/grid';
  import { grid } from '$lib/grid';
  import type { Letter } from '$lib/types/letter';
  import GridCell from './GridCell.svelte';

  let width = 16;
  let height = 20;
  initializeGrid(width, height, 'quentin');

  let first = '';
  let second = '';
  let third = '';
  let fourth = '';
  let fifth = '';
  let sixth = '';
  let seventh = '';
  let searching = false;
  async function search() {
    searching = true;
    const now = performance.now();
    const searchLetters: { letter: Letter; position: number }[] = [];
    if (first) {
      searchLetters.push({ letter: first as Letter, position: 0 });
    }
    if (second) {
      searchLetters.push({ letter: second as Letter, position: 1 });
    }
    if (third) {
      searchLetters.push({ letter: third as Letter, position: 2 });
    }
    if (fourth) {
      searchLetters.push({ letter: fourth as Letter, position: 3 });
    }
    if (fifth) {
      searchLetters.push({ letter: fifth as Letter, position: 4 });
    }
    if (sixth) {
      searchLetters.push({ letter: sixth as Letter, position: 5 });
    }
    if (seventh) {
      searchLetters.push({ letter: seventh as Letter, position: 6 });
    }
    const results = await searchInDB({ searchLetters });
    console.log(
      `Found ${results.length} results in ${performance.now() - now}ms. First result: ${results[0]}`
    );
    searching = false;
  }
</script>

<div class="flex max-w-lg m-2">
  <input bind:value={first} placeholder="enter first letter" disabled={searching} />
  <input bind:value={second} placeholder="enter second letter" disabled={searching} />
  <input bind:value={third} placeholder="enter third letter" disabled={searching} />
  <input bind:value={fourth} placeholder="enter fourth letter" disabled={searching} />
  <input bind:value={fifth} placeholder="enter five letter" disabled={searching} />
  <input bind:value={sixth} placeholder="enter six letter" disabled={searching} />
  <input bind:value={seventh} placeholder="enter seven letter" disabled={searching} />
  <button on:click={search} disabled={searching} class="btn btn-primary">Search</button>
</div>

{#if searching}
  <span class="loading loading-spinner loading-xs"></span>
{/if}

<div class="grow w-full bg-primary-content flex flex-col">
  <div class="w-full flex flex-row justify-center">
    <div
      class="coco-grid grow max-w-md"
      style:grid-template-columns="repeat({width}, minmax(0, 1fr))"
    >
      {#each $grid as row}
        {#each row as { letter, tempLetter, editable }}
          <GridCell {letter} {tempLetter} {editable} />
        {/each}
      {/each}
    </div>
  </div>
</div>

<style>
  .coco-grid {
    display: grid;
  }
</style>
