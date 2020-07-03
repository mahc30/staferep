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
  //For initial state
  onMount(async () => {
    IS_AUTH = localStorage.getItem("auth") === "1"; //This value only exists if server authenticates (or someone just writes it... token handles security tho)
    await handle_Fetch({}); //Function receives an event, passing an empty object does the trick
  });

  async function handle_Update_Table(list) {
    headers = list.headers || headers;
    rows = list.rows || rows;
  }

  async function handle_Edit_Element(e) {
    if (e.detail.new_edit) is_editing = [...is_editing, e.detail.obra];
    //Edit Obra Event
    else {
      //Obra Edited Event
      is_editing = util.find_and_delete(is_editing, e.detail.id);
      if (is_editing.length <= 1) await handle_Fetch({});
    }
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
</script>

<style>
  /* TODO Apparently this doesn't work in mobile, gotta fix the css */

  th {
    text-align: center;
    color: #999999;
  }

  hr {
    border-bottom: solid black 1px;
  }
</style>

<!-- Toolbar -->
<div class="container">
  <div class="row">
    <Toolbar
      {IS_AUTH}
      {selected}
      on:newSearch={handle_Fetch}
      on:obraEdit={handle_Edit_Element}
      on:obraDelete={handle_Delete_Element} />
  </div>
</div>
<!-- Probably the Table -->
<hr />
<table>
  <thead>
    <tr>
      {#if IS_AUTH}
        <th />
      {/if}

      {#each headers as head}
        <th>{head.title}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i}
      {#if util.array_contains(is_editing, row.id)}
        <EditRow obra={row} on:ObraEdited={handle_Edit_Element} />
      {:else}
        <ObraRow
          obra={row}
          {IS_AUTH}
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
