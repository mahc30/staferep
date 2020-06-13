<script>
  import { onMount } from "svelte";
  import Toolbar from "../layout/table/Toolbar.svelte";
  import EditRow from "../layout/table/EditRow.svelte";
  import ObraRow from "../layout/table/ObraRow.svelte";
  import AddRow from "../layout/table/AddRow.svelte";
  import format from "../../util/format_data";
  import util from "../../util/util";

  /* Example of what i need to do 
      let headers = [{ title: "Obra" }, { title: "Compositor" }];
  let rows = [
    { name: "Despacito", composer: "Mozart" },
    { name: "Adagio en Re menor", composer: "Pitbull" }
  ];

  function fetch_Obra_list(e) {
    console.log(
      "From Table: Params Changed! Updating!",
      e.detail.raw_data,
      e.detail.raw_data.level,
      e.detail.raw_data.composer
    );
  }
  */
  let headers = [];
  let rows = [];
  let IS_AUTH = false; //TODO temporal IS_AUTH var for testing
  let is_editing = -1;

  //For initial state
  onMount(async () => {
    //Set auth level
    IS_AUTH = localStorage.getItem("auth") === "1"; //This value only exists if server authenticates

    // Load initial table
    await fetch_Obra_list({}); //Function receives an event, passing an empty object does the trick
  });

  function handle_Update_Table(list) {
    headers = list.headers || headers;
    rows = list.rows || rows;
  }

  function fetch_Obra_list(e) {
    // Fetch Data
    //Doing it this way because docs do it this way, don't really know if it's better, it's just a little bit hard to read
    const unnecesary_variable_name_but_basically_is_the_promise_for_svelte_to_load_fetch_data_READ_API = (async () => {
      //I'm sorry for what you're about to see //TODO MAKE A FCKING FETCH FUNCTION AAAA
      let url = "http://localhost:3000/obras/findall";
      let options = {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      };

      if (e.detail) {
        let filters = JSON.stringify(e.detail);
        options.method = "POST"; //Because GET method cannot have body
        options.body = filters; //Add filters for query if it exists
        url = "http://localhost:3000/obras/findFilter"; //And the API is different
        //God this turned ugly so fast i need a request generator
        //TODO ^
      }

      const response = await fetch(url, options);

      const raw_data = await response.json();
      let parsed_data = format(raw_data);

      handle_Update_Table(parsed_data);
      return raw_data; //Just because it's necessary to return a promise, probably, docs do it like this
    })();
  }

  async function handle_Edit_Element(e) {
    if (e.detail) is_editing = e.detail.id;
    //Edit Obra Event
    else {
      //Obra Edited Event
      is_editing = -1;
      try {
        await fetch_Obra_list({});
      } catch (err) {
        console.log(err);
      }
    }
  }

  
</script>

<style>
  /* TODO Apparently this doesn't work in mobile, gotta fix the css */
  table,
  tr {
    width: 100%;
  }

  th {
    text-align: center;
    color: #999999;
  }
</style>

<!-- Toolbar -->
<Toolbar on:changedParams={fetch_Obra_list} />

<!-- Probably the Table -->
<table>
  <thead>
    <tr>
      {#await handle_Update_Table}
        <th>
          <h6>Cargando...</h6>
        </th>
      {:then raw_data}
        {#each headers as head}
          <th>{head.title}</th>
        {/each}
      {:catch error}
        <p>Error</p>
      {/await}

    </tr>
  </thead>

  <!--- Rows --->
  <tbody>
    {#await handle_Update_Table}
      <tr>
        <h6>Cargando...</h6>
      </tr>
    {:then useless_var_i_dont_really_use_because_i_handle_everything_in_script}

      {#each rows as row, i}
        {#if row.id === is_editing}
          <EditRow obra={row} on:ObraEdited={handle_Edit_Element} />
        {:else}
          <ObraRow
            obra={row}
            {IS_AUTH}
            {i}
            on:editObra={handle_Edit_Element}
            on:ObraDeleted={fetch_Obra_list} />
        {/if}
      {/each}

      {#if IS_AUTH}
        <AddRow on:obraAdded={fetch_Obra_list} />
      {/if}

    {:catch error}
      <tr>
        <p>Error Cargando Registro</p>
      </tr>

    {/await}

  </tbody>
</table>
