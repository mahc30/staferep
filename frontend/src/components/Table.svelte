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

  //TODO
  async function handle_Add_Element(e) {
    if (!e.detail) return;

    /*
    let file;
    let file_exists;

    if(e.detail.file_exists){
      file = new FormData();
      file.append('file', e.detail.file_exists[0]);
      file_exists = true;
    }
  */
    let new_obra = e.detail;
    console.log("NEw ", new_obra, "json", e.detail);
    try {
      let edit = await fetch("http://localhost:3000/obras/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        formData: {
          file: "And this is where i'd put my File ... IF I HAD ONE"
        },
        body: JSON.stringify(new_obra)
      });

      fetch_Obra_list({});
    } catch (error) {
      console.log("Error Eliminando Obra", error);
    }
  }

  let is_editing = -1;
  async function handle_Edit_Element(e) {
    let id = e.detail.id;
    if (!e.detail.edit) {
      //First Click, the "I'm going to edit"
      is_editing = e.detail.id;
      return;
    }

    let new_obra = e.detail;
    delete new_obra.edit; //I don't need it

    try {
      let edit = await fetch("http://localhost:3000/obras/update", {
        method: "PATCH",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(new_obra)
      });

      if (edit.ok) {
        let edited = await edit.json();
        let index = rows.findIndex(obra => {
          return obra.id === edited._id;
        });
        fetch_Obra_list({});
      }
    } catch (error) {
      console.log("Error Eliminando Obra", error);
    }

    is_editing = -1;
  }

  async function handle_Download_Element(e) {
    let id;
    if (e.detail) {
      id = e.detail.id;

      let checkForDownload = await fetch(
        `http://localhost:3000/obras/download/${id}`
      );

      if (checkForDownload.ok)
        //Triggers Download
        window.location = `http://localhost:3000/obras/download/${id}`;
      else alert("Error intentando descargar");
    }
  }

  async function handle_Delete_Element(e) {
    let id;
    if (e.detail) id = e.detail.id;
    else return;

    try {
      await fetch("http://localhost:3000/obras/delete", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ obra_id: id })
      });

      let new_rows = util.delete_at_index(rows, id);
      console.log(new_rows);
      handle_Update_Table({ rows: new_rows });
    } catch (error) {
      console.log("Error Eliminando Obra", error);
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
          <EditRow obra={row} on:rowEdited={handle_Edit_Element} />
        {:else}
          <ObraRow
            obra={row}
            {IS_AUTH}
            {i}
            on:editObra={handle_Edit_Element}
            on:downloadObra={handle_Download_Element}
            on:deleteObra={handle_Delete_Element} />
        {/if}
      {/each}

      {#if IS_AUTH}
        <AddRow on:obraAdded={handle_Add_Element} />
      {/if}

    {:catch error}
      <tr>
        <p>Error Cargando Registro</p>
      </tr>

    {/await}

  </tbody>
</table>
