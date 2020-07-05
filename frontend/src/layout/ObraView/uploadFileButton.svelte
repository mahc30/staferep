<script>
//TODO
let files = [];
</script>

{#if !files_exist && !isLoading}
  <input name="file" type="file" accept=".pdf,.png,.jpg" bind:files />
{:else if isLoading}
  <p>Cargando...</p>
{:else if files_exist}
  <p>Archivos Cargados! :)</p>
{:else}
  <p>Error Cargando Archivo</p>
{/if}
