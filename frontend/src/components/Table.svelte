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
  let is_editing = -1;
  let selected = [];
  //For initial state
  onMount(async () => {
    IS_AUTH = localStorage.getItem("auth") === "1"; //This value only exists if server authenticates (or someone just writes it... token handles security tho)

    let req = await fetch_obra_list({}); //Function receives an event, passing an empty object does the trick
    let obras;

    if (!req) {
      obras = {
        headers: [{ title: "Obra" }, { title: "Compositor" }],
        rows: [
          { id: "idtest1", name: "Despacito", composer: "Mozart" },
          { id: "idtest2", name: "Adagio en Re menor", composer: "Pitbull" }
        ]
      };
    } else {
      obras = req;
    }

    handle_Update_Table(obras);
  });

  async function handle_Update_Table(list) {
    headers = list.headers || headers;
    rows = list.rows || rows;
  }

  async function handle_Edit_Element(e) {
    if (e.detail) is_editing = e.detail.id;
    //Edit Obra Event
    else {
      //Obra Edited Event
      is_editing = -1;
      try {
        await handle_fetch({});
      } catch (err) {
        console.log(err);
      }
    }
  }

  function handle_New_Select(e) {
    let checked = e.detail.checked;
    let id = e.detail.id;

    checked
      ? (selected = [...selected, id])
      : (selected = util.find_and_delete(selected, id));
  }

  async function handle_Delete_Element() {
    selected.forEach(async id => {
      await delete_element(id);
    });
  }

  async function handle_fetch(e) {
    handle_Update_Table({});
  }
</script>

<style>
  /* TODO Apparently this doesn't work in mobile, gotta fix the css */

  table {
    width: 100%;
    max-height: 60vh;
    overflow: scroll;
  }

  thead {
    text-align: center;
    color: #999999;
  }

  hr{
    border-bottom: solid black 1px;
  }
</style>

<!-- Toolbar -->
<div class="container">
  <div class="row">
    <Toolbar {IS_AUTH} on:changedParams={handle_fetch} />
  </div>
</div>
<!-- Probably the Table -->
<hr>
<table>
  <thead>
    <tr>
      {#if IS_AUTH}
        <th />
      {/if}

      {#each headers as head}
        <th>{head.title}</th>
      {/each}
      <th />
    </tr>
  </thead>
  <tbody>
    {#each rows as row, i}
      {#if row.id === is_editing}
        <EditRow obra={row} on:ObraEdited={handle_Edit_Element} />
      {:else}
        <ObraRow
          obra={row}
          {IS_AUTH}
          {i}
          on:editObra={handle_Edit_Element}
          on:ObraDeleted={handle_fetch}
          on:newSelect={handle_New_Select} />
      {/if}
    {/each}

    {#if IS_AUTH}
      <AddRow on:obraAdded={handle_fetch} />
    {/if}
  </tbody>
</table>
