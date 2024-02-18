<script lang="ts">
  import { initializeGrid } from '$lib/grid';
  import { grid } from '$lib/grid';
  import GridCell from './GridCell.svelte';

  let width = 16;
  let height = 20;
  initializeGrid(width, height, 'quentin');
</script>

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
