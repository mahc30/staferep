<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { delete_element, fetch_obra_list } from "../../../util/requests";
  import util from "../../../util/util";

  import EditRow from "./Table/EditRow.svelte";
  import ObraRow from "./Table/ObraRow.svelte";
  import AddRow from "./Table/AddRow.svelte";
  let dispatch = createEventDispatcher();

  //Initialize with default values :)
  export let headers = [];
  export let rows = [];

  export let IS_AUTH; //TODO temporal IS_AUTH var for testing
  export let is_editing;
  //For initial state
  onMount(async () => {
    IS_AUTH = localStorage.getItem("auth") === "1"; //This value only exists if server authenticates (or someone just writes it... token handles security tho)
  });

  function handle_New_Select(e) {
    dispatch("newSelect", e.detail);
  }

  function handle_Edit_Element(e) {
    //Cancel Event
    dispatch("newEdit", e.detail);
  }

  async function handle_Delete_Element(e) {
    dispatch("newDelete", e.detail);
  }

  async function handle_Download_Element(e) {
    dispatch("newDownload", e.detail);
  }

  function handle_Add_Element(e){
    dispatch("newAdd", e.detail);
  }
</script>

<style>
  .table-container {
    overflow-y: scroll;
  }

  th {
    text-align: center;
    color: #999999;
  }

  .table-container {
    max-height: calc(80vh - 2px);
  }
</style>

<!-- Toolbar -->

<!-- Probably the Table -->
<div class="table-container">
  <table>
    <thead>
      <tr>
        {#each headers as header}
          <th>{header.title}</th>
        {/each}

        {#if IS_AUTH}
          <th />
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i}
        {#if util.array_contains(is_editing, row.id)}
          <EditRow
            obra={row}
            on:ObraEdited={handle_Edit_Element}
            on:cancelEdit={handle_Edit_Element} />
        {:else}
          <ObraRow
            obra={row}
            {i}
            on:editObra={handle_Edit_Element}
            on:ObraDeleted={() => {handle_Delete_Element}}
            on:newSelect={handle_New_Select} />
        {/if}
      {/each}

      {#if IS_AUTH}
        <AddRow
          on:obraAdded={handle_Add_Element} />
      {/if}
    </tbody>
  </table>
</div>
