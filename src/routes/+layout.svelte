<script>
  import { base } from '$app/paths';
  import '../app.css';
  import '@fontsource-variable/oswald';
</script>

<div class="navbar bg-primary text-primary-content">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl" href="{base}/">Coco Word</a>
  </div>
</div>
<slot />
