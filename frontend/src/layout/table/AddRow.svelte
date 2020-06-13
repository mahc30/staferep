<script>
  //It's Pretty much the same as EditRow, only changes the event and some "handle_Add_Element()" logic
  //But made it a different component for legibility
  //Maybe, maybe i'll come back one day and fix this, or not

  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  let dispatch = createEventDispatcher();
  let levels = [
    { id: -1, text: `Nivel` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];

  let newName = "";
  let newComposer = "";
  let level = levels[0];
  let files = []; //Different naming convention because svelte only works with this var
  let isLoading = false;
  let isAdding = false;
  let files_exist = false;

  function reset_component() {
    isAdding = false;
    newName = "";
    newComposer = "";
    files = [];
    isLoading = false;
    level = levels[0];
    isAdding = false;
    isLoading = false;
    files_exist = false;
  }

  function toggle_add() {
    isAdding = !isAdding;
  }

  function toggle_load() {
    isLoading = !isLoading;
  }

  async function upload_file(e) {
    toggle_load();
    let data = new FormData(); //Use FormData() for multipart/form-data

    data.append("file", files[0]);
    data.append("name", newName);
    //TODO Somehow make a relation between uploaded File and new Obra upload
    await fetch("http://localhost:3000/obras/upload", {
      method: "POST",
      body: data
    }).then(success => {
      files_exist = true;
      toggle_load();
    });
  }

  async function handle_Add_Element(e) {
    if (!e.detail) return;
    reset_component();
    toggle_add();

    let new_obra = {
      obra_name: newName,
      obra_composer: newComposer,
      obra_level: level.text,
      file_exists: files_exist //TODO implement upload files
    };

    try {
      let add = await fetch("http://localhost:3000/obras/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          file: "And this is where i'd put my File ... IF I HAD ONE"
        },
        body: JSON.stringify(new_obra)
      });

      dispatch("obraAdded", {});
    } catch (error) {
      console.log("Error Agregando Obra", error);
    }
  }
</script>

<style>
  td {
    text-align: center;
    padding: 0 0 0 auto;
    color: black;
  }

  button {
    background-color: #ed1c23;
    margin: 0 2px 0 2px;
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

  /*
  .input-button {
    position: relative;
  }

  label {
    max-width: 100%;
    overflow: hidden;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
  }
*/

  .pl-4 {
    padding-left: 4%;
  }
</style>

{#if isAdding}
  <tr>
    <td class="pl-4">
      <input type="text" placeholder="nombre" bind:value={newName} />
    </td>
    <td>
      <input type="text" placeholder="compositor" bind:value={newComposer} />
    </td>
    <td>
      <div class="column">
        <select bind:value={level}>
          {#each levels as level}
            <option value={level}>{level.text}</option>
          {/each}
        </select>
      </div>
    </td>
    <td>
      {#if !files_exist && !isLoading}
        <input name="file" type="file" bind:files on:change={upload_file} />
      {:else if isLoading}
        <p>Cargando...</p>
      {:else if files_exist}
        <p>Archivos Cargados! :)</p>
      {:else}
        <p>Error Cargando Archivo</p>
      {/if}
    </td>
    <td>
      <button on:click={handle_Add_Element}>Agregar</button>
    </td>
  </tr>
{:else}
  <tr>
    <!--- Aditional TD are for centering the Button, easier than css i guess -->
    <td />
    <td />
    <td>
      <button on:click={toggle_add}>Agregar</button>
    </td>
    <td />
    <td />
  </tr>
{/if}
