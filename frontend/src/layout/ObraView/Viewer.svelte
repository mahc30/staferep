<script>
  import EditRow from "./Viewer/EditRow.svelte";
  import AddRow from "./Viewer/AddRow.svelte";

  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  export let selected;
  let obra_iterator = 0;
  let currently_selected = selected[obra_iterator];

  function handle_Add_Element(e) {
    dispatch("newAdd", e.detail);
  }

  function handle_Nav(e) {
    //N next
    //P previous
    //Only one is needed anyway
    if (e.target.id === "n") {
      if (obra_iterator < selected.length - 1) obra_iterator++;
    } else {
      if (obra_iterator > 0) obra_iterator--;
    }
    currently_selected = selected[obra_iterator]
  }

  function handle_iterator() {
    //When deleting from list, the iterator should change to prevent out of index

    //In case last item is deleted
    if (selected.length <= 1) {
      return;
    }

    //Random item deleted
    if (obra_iterator >= selected.length - 1) obra_iterator--;
    else if (obra_iterator != selected.length - 2) obra_iterator++;
  }

  function handle_Cancel(e) {
    handle_iterator();
    dispatch("cancelEdit", { obra: e.detail.obra, cancel: e.detail.cancel });
  }

  function handle_Edit(e) {
    handle_iterator();
    dispatch("ObraEdited", {
      obra: e.detail.obra,
      cancel: e.detail.cancel
    });
  }
</script>

<style>
  .viewer-container {
    height: calc(100% - 2px);
  }

  .input-container {
    height: 15%;
  }

  .navigation {
    height: 5%;
  }

  .preview {
    display: flex;
    height: 80%;
    max-height: 80%;
    overflow: scroll;
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav {
    align-items: unset !important; /* Because it goes out of div and overlaps with top content for no reason */
  }

  button {
    max-height: 100% !important;
    background-color: #ed1c23 !important;
    border: #ed1c23;
  }

  button:hover {
    background-color: #b20000 !important;
    border: #b20000;
  }

  button:disabled {
    background-color: gray;
    border: 0.1rem solid gray !important;
    color: white;
  }

  button:disabled:hover {
    background-color: gray;
    border: 0.1rem solid gray !important;
    color: white;
  }
</style>

<div class="viewer-container">
  <div class="row input-container">
    {#if selected.length === 0}
      <AddRow on:obraAdded={handle_Add_Element} />
    {:else}
      {#each selected as obra, i}
        {#if i === obra_iterator}
          <EditRow
            {obra}
            on:cancelEdit={handle_Cancel}
            on:ObraEdited={handle_Edit} />
        {/if}
      {/each}
      <!--- TODO mas o menos asi es la idea pero estoy cansado mañanal o hago, maybe-->
    {/if}
  </div>

  <div class="nav row navigation">
    {#if selected.length > 0}
      <button id="p" on:click={handle_Nav} disabled={obra_iterator === 0}>
        previous
      </button>
      <button
        id="n"
        on:click={handle_Nav}
        disabled={obra_iterator >= selected.length - 1}>
        next
      </button>
    {/if}

  </div>

  <div class="row preview">
    <button
      on:click={(window.location = `/table/${selected[obra_iterator].id}`)}
      disabled={selected.length === 0 || !selected[obra_iterator].file_exists}>
      Ir a Vista Previa
    </button>

  </div>

</div>
