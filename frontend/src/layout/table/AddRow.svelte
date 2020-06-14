<script>
  //It's Pretty much the same as EditRow, only changes the event and some "handle_Add_Element()" logic
  //But made it a different component for legibility
  //Maybe, maybe i'll come back one day and fix this, or not

  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { format_file_name } from "../../../util/format_data";

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
  let new_level = levels[0];
  let files = []; //Different naming convention because svelte only works with this var
  let isLoading = false;
  let isAdding = false;
  let files_exist = false;
  let is_valid = false;

  function validate_input() {
    is_valid = newName && newComposer && new_level.id != -1;
  }

  function reset_component() {
    isAdding = false;
    newName = "";
    newComposer = "";
    files = [];
    isLoading = false;
    new_level = levels[0];
    isAdding = false;
    isLoading = false;
    files_exist = false;
    is_valid = false;
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
    let formatted_file_name = format_file_name(files[0].name, newName);

    //Renaming the file in the front is necessary because Multer limitations for handling the files
    const myNewFile = new File([files[0]], formatted_file_name, { type: data.type });
    data.append("file", myNewFile);

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
    if (files[0]) await upload_file();

    let new_obra = {
      obra_name: newName,
      obra_composer: newComposer,
      obra_level: new_level.text,
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
    } finally {
      reset_component();
      toggle_add();
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

  .pl-4 {
    padding-left: 4%;
  }
</style>

{#if isAdding}
  <tr>
    <td class="pl-4">
      <input
        type="text"
        placeholder="nombre"
        bind:value={newName}
        on:change={validate_input} />
    </td>
    <td>
      <input
        type="text"
        placeholder="compositor"
        bind:value={newComposer}
        on:change={validate_input} />
    </td>
    <td>
      <div class="column">
        <select bind:value={new_level} on:change={validate_input}>
          {#each levels as new_level}
            <option value={new_level}>{new_level.text}</option>
          {/each}
        </select>
      </div>
    </td>
    <td>
      {#if !files_exist && !isLoading}
        <input name="file" type="file" accept=".pdf,.png,.jpg" bind:files />
      {:else if isLoading}
        <p>Cargando...</p>
      {:else if files_exist}
        <p>Archivos Cargados! :)</p>
      {:else}
        <p>Error Cargando Archivo</p>
      {/if}
    </td>
    <td>
      <button on:click={handle_Add_Element} disabled={!is_valid}>
        Agregar
      </button>
    </td>
  </tr>
{:else}
  <tr>
    <!--- Aditional TD are for centering the Button, easier than css i guess -->
    <td />
    <td />
    <td>
      <button on:click={toggle_add}>Nueva Obra</button>
    </td>
    <td />
    <td />
  </tr>
{/if}
