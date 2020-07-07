<script>
  import EditRow from "./Table/EditRow.svelte";
  import AddRow from "./Table/AddRow.svelte";
  import { createEventDispatcher } from "svelte";

  export let selected;

  let dispatch = createEventDispatcher();
  let obra_iterator = 0;
  let min = 0;

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
  }

  function handle_iterator() {
    //When deleting from list, the iterator should change to prevent out of index
    //
    //console.log("Current length", selected.length, "then", selected.length - 1);
    if (selected.length <= 1) {
      return;
    }

    if (obra_iterator >= selected.length - 1) obra_iterator--;
    else obra_iterator++;

    //console.log("Currently Selected:", selected[obra_iterator])
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

  .preview {
    display: flex;
    height: 80%;
  }

  .navigation {
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
    <img src="images/red-logo.png" alt="" />
  </div>

</div>
