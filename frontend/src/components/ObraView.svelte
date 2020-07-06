<script>
  import { onMount } from "svelte";
  import { delete_element, fetch_obra_list } from "../../util/requests";
  import util from "../../util/util";

  import Toolbar from "../layout/ObraView/Toolbar.svelte";
  import Table from "../layout/ObraView/Table.svelte";
  import Viewer from "../layout/ObraView/Viewer.svelte";

  let obras = {};
  let IS_AUTH = false; //TODO temporal IS_AUTH var for testing
  let is_editing = [{ id: -1 }];
  let selected = [];
  let composers = ["Compositor"];
  let rows = [];
  let headers = [];

  onMount(async () => {
    IS_AUTH = localStorage.getItem("auth") === "1"; //This value only exists if server authenticates (or someone just writes it... token handles security tho)
    await handle_Fetch({}); //Function receives an event, passing an empty object does the trick
  });

  function handle_Select(e) {
    let checked = e.detail.checked;
    let obra = e.detail.obra;

    checked
      ? (selected = [...selected, obra])
      : (selected = util.find_and_delete(selected, obra));
  }

  function handle_Update_Table(list) {
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

  async function handle_Fetch(e) {
    let filters = e.detail || e;
    try {
      obras = await fetch_obra_list(filters);
    } catch {
      //Default values
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
    selected = util.find_and_delete(selected, e.detail);
    is_editing = util.find_and_delete(is_editing, e.detail);
    handle_Fetch({});
  }

  async function handle_Download_Element(e) {
    let id = e.detail.obra.id;
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
  .obraView-container {
    display: flex;
    flex-flow: column;
    max-height: 90vh;
    overflow: hidden;
  }

  .column {
    padding: 0 1rem !important;
  }
</style>

<div class="obraView-container">
  <Toolbar
    {IS_AUTH}
    {selected}
    {composers}
    on:newSearch={handle_Fetch}
    on:obraEdit={handle_Edit_Element}
    on:obraDelete={handle_Delete_Element}
    on:obraDownload={handle_Download_Element} />

  <div class="row">
    <div class="column">
      <Table
        {IS_AUTH}
        {selected}
        {rows}
        {headers}
        {is_editing}
        on:newSelect={handle_Select}
        on:newEdit={handle_Edit_Element}
        on:newDownload={handle_Download_Element}
        on:newDelete={() => {
          handle_Fetch({});
        }} />
    </div>

    <!--TODO {#if is_editing.length > 1}-->
    <div class="column">
      <Viewer
        {IS_AUTH}
        {selected}
        on:newAdd={() => {
          handle_Fetch({});
        }} />
    </div>

  </div>
</div>
