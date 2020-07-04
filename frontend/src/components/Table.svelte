<script>
  import { onMount } from "svelte";
  import { delete_element, fetch_obra_list } from "../../util/requests";
  import util from "../../util/util";

  import Toolbar from "../layout/table/Toolbar.svelte";
  import EditRow from "../layout/table/EditRow.svelte";
  import ObraRow from "../layout/table/ObraRow.svelte";
  import AddRow from "../layout/table/AddRow.svelte";
  //Initialize with default values :)
  let headers = [];
  let rows = [];

  let IS_AUTH = false; //TODO temporal IS_AUTH var for testing
  let is_editing = [{ id: -1 }];
  let selected = [];
  let composers = ["Compositor"];
  //For initial state
  onMount(async () => {
    IS_AUTH = localStorage.getItem("auth") === "1"; //This value only exists if server authenticates (or someone just writes it... token handles security tho)
    await handle_Fetch({}); //Function receives an event, passing an empty object does the trick
  });

  async function handle_Update_Table(list) {
    composers = util.filter_composer(list.rows);

    headers = list.headers || headers;
    rows = list.rows || rows;
  }

  async function handle_Edit_Element(e) {
    //Cancel Event
    if (e.detail.cancel) {
      is_editing = util.find_and_delete(is_editing, e.detail.obra.id);
      selected = util.find_and_delete(selected, e.detail.obra);
    }
    //Edit Obra Event
    else if (e.detail.new_edit) is_editing = [...is_editing, e.detail.obra];
    else {
      //Obra Edited Event
      is_editing = util.find_and_delete(is_editing, e.detail.obra.id);
      selected = util.find_and_delete(selected, e.detail.obra);
    }

    if (is_editing.length <= 1) await handle_Fetch({});
  }

  function handle_New_Select(e) {
    let checked = e.detail.checked;
    let obra = e.detail.obra;

    checked
      ? (selected = [...selected, obra])
      : (selected = util.find_and_delete(selected, obra));
  }

  async function handle_Fetch(e) {
    let obras;
    let filters = e.detail || e;
    try {
      obras = await fetch_obra_list(filters);
    } catch {
      obras = {
        headers: [{ title: "Obra" }, { title: "Compositor" }],
        rows: [
          { id: "idtest1", name: "Despacito", composer: "Mozart" },
          { id: "idtest2", name: "Adagio en Re menor", composer: "Pitbull" }
        ]
      };
    } finally {
      handle_Update_Table(obras);
    }
  }

  async function handle_Delete_Element(e) {
    await delete_element(e.detail);
    handle_Fetch({});
  }

  async function handle_Download_Element(e) {
    let id = e.detail.obra.id;
    console.log("download: ", e.detail.obra);
    let checkForDownload = await fetch(
      `http://localhost:3000/obras/download/${id}`
    );

    if (checkForDownload.ok)
      //Triggers Download
      window.location = `http://localhost:3000/obras/download/${id}`;
    else alert("Error intentando descargar");
  }
</script>

<style>
  /* TODO Apparently this doesn't work in mobile, gotta fix the css */

  .table-container {
    overflow-y: scroll;
  }

  th {
    text-align: center;
    color: #999999;
  }

  .component-container {
    display: flex;
    flex-flow: column;
    height: 90vh;
    max-height: calc(90vh - 2px);
    overflow: hidden;
  }

  .toolbar-container{
    max-height: 20vh;
  }

  .table-container{
    max-height: calc(80vh - 2px);
  }
</style>

<!-- Toolbar -->
<div class="component-container">
  <div class="toolbar-container">
    <Toolbar
      {IS_AUTH}
      {selected}
      {composers}
      on:newSearch={handle_Fetch}
      on:obraEdit={handle_Edit_Element}
      on:obraDelete={handle_Delete_Element}
      on:obraDownload={handle_Download_Element} />
  </div>
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
              on:ObraDeleted={() => {
                handle_Fetch;
              }}
              on:newSelect={handle_New_Select} />
          {/if}
        {/each}

        {#if IS_AUTH}
          <AddRow
            on:obraAdded={() => {
              handle_Fetch;
            }} />
        {/if}
      </tbody>
    </table>
  </div>
</div>
