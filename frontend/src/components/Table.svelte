<script>
  import { onMount } from "svelte";
  import Toolbar from "../layout/Toolbar.svelte";
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
    console.log("onmount");
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
  function handle_Add_Element(e) {
    console.log("Adding", e.target.id);
  }

  function handle_Edit_Element(e) {
    console.log("Editing", e.target.id);
  }

  function handle_Download_Element(e) {
    console.log("Downloading", e.target.id);
  }

  async function handle_Delete_Element(e) {
    try {
      await fetch("http://localhost:3000/obras/delete", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ obra_id: e.target.id })
      });

      let new_rows = util.delete_at_index(rows, e.target.id);
      console.log(new_rows);
      handle_Update_Table({ rows: new_rows });
    } catch (error) {
      console.log("Error Eliminando Obra", error);
    }
  }
</script>

<style>
  th,
  td {
    text-align: center;
    color: black;
  }

  hr {
    border-top: 0.1rem solid #2c2c2c !important; /* hr tag is white for default, have to override it */
  }

  .highlight {
    background-color: #999999;
  }

  .table_body_row:hover {
    background-color: #bfbfbf;
  }

  .highlight.table_body_row:hover {
    background-color: #7e7e7e;
  }

  button {
    background-color: #ed1c23;
    border: 0.1rem solid #ed1c23;
  }

  button:hover {
    background-color: #b20000;
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

<!-- Toolbar -->
<Toolbar on:changedParams={fetch_Obra_list} />
<hr />

<!-- Probably the Table -->
<table>
  <thead>
    <tr>
      {#await handle_Update_Table}
        <p>Loading</p>
      {:then raw_data}
        {#each headers as head}
          <th>{head.title}</th>
        {/each}
      {:catch error}
        <p>Error</p>
      {/await}

    </tr>
  </thead>
  <tbody>
    {#await handle_Update_Table}
      <p>Loading</p>
    {:then raw_data}
      {#each rows as row, i}
        <tr class:highlight={i % 2 === 0} class="table_body_row">
          <td>{row.name}</td>
          <td>{row.composer}</td>

          <!-- buttons for CRUD  
            For Admins and Normal Users
          -->
          {#if IS_AUTH}
            <td>
              <button id={row.id} on:click={handle_Edit_Element}>Editar</button>
            </td>
            <td>
              <button
                id={row.id}
                on:click={handle_Download_Element}
                disabled={row.file_exists}>
                Descargar
              </button>
            </td>
            <td>
              <button id={row.id} on:click={handle_Delete_Element}>
                Eliminar
              </button>
            </td>
          {:else}
            <td>
              <button
                id={row.id}
                on:click={handle_Download_Element}
                disabled={row.file_exists}>
                Descargar
              </button>
            </td>
          {/if}
        </tr>
      {/each}

      {#if IS_AUTH}
        <tr>
          <!--- Aditional TD are for centering the Button, easier than css i guess -->
          <td />
          <td />
          <td>
            <button on:click={handle_Add_Element}>Agregar</button>
          </td>
          <td />
          <td />
        </tr>
      {/if}
    {:catch error}
      <tr>
        <p>Error Cargando Registro</p>
      </tr>
    {/await}

  </tbody>
</table>
