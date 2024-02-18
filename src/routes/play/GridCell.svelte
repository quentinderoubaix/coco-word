<script lang="ts">
  import type { Letter } from '$lib/types/letter';
  import type { WritableSignal } from '@amadeus-it-group/tansu';

  export let letter: WritableSignal<Letter | undefined>;
  export let tempLetter: WritableSignal<undefined | Letter>;
  export let editable: WritableSignal<boolean>;
</script>

<div
  class="cell text-center outline-2 outline-solid flex justify-center items-center"
  class:bg-white={$letter || $editable}
  class:outline={$letter || $editable}
  class:outline-primary={$letter}
  class:text-primary={$letter}
>
  <span>
    {#if $letter}
      {$letter.toUpperCase()}
    {/if}
    {#if $editable && $tempLetter}
      {$tempLetter.toUpperCase()}
    {/if}
  </span>
</div>

<style>
  .cell {
    aspect-ratio: 1;
  }
</style>
