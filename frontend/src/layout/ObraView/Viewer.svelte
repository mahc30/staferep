<script>
  import EditRow from "./Table/EditRow.svelte";
  import AddRow from "./Table/AddRow.svelte";
  export let IS_AUTH;
  export let selected;

  function handle_Add_Element(e) {
    dispatch("newAdd", e.detail);
  }
</script>

<style>
  .viewer-container {
    height: calc(100% - 2px);
  }

  .input-container {
    background-color: yellow;
    height: 15%;
  }

  .preview {
    display: flex;
    height: 95%;
    background-color: blue;
  }

  .navigation {
    background-color: red;
    height: 5%;
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav {
    align-items: unset !important; /* Because it goes out of div and overlaps with top content for no reason */
  }

  img {
    max-width: 50%;
    max-height: 50%;
  }
</style>

<div class="viewer-container">
  {#if IS_AUTH}
    <div class="row input-container">
      {#if selected === 0}
        <AddRow on:obraAdded={handle_Add_Element} />
      {:else}
        {#each selected as obra}
          <EditRow {obra} />
          <!--- TODO mas o menos asi es la idea pero estoy cansado mañanal o hago, maybe-->
        {/each}
      {/if}
    </div>
  {/if}
  <div class="row preview">
    <img src="images/red-logo.png" alt="" />
  </div>
  <div class="nav row navigation">
    <p>Nav</p>
  </div>
</div>
