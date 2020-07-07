<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { delete_element, fetch_obra_list } from "../../../util/requests";

  import EditRow from "./Table/EditRow.svelte";
  import ObraRow from "./Table/ObraRow.svelte";
  import AddRow from "./Table/AddRow.svelte";
  let dispatch = createEventDispatcher();

  //Initialize with default values :)
  export let headers = [];
  export let rows = [];
  export let selected;
  export let IS_AUTH; //TODO temporal IS_AUTH var for testing
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
</script>

<style>
  .table-container {
    overflow-y: scroll;
    border-right: 1px solid black;
  }

  th {
    text-align: center;
    color: #999999;
  }

  .table-container {
    max-height: calc(70vh);
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
        <ObraRow
          obra={row}
          {i}
          on:editObra={handle_Edit_Element}
          on:ObraDeleted={() => {
            handle_Delete_Element;
          }}
          on:newSelect={handle_New_Select}
          {selected} />
      {/each}

    </tbody>
  </table>
</div>
