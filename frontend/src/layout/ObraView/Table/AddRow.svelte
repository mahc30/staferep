<script>
  //It's Pretty much the same as EditRow, only changes the event and some "handle_Add_Element()" logic
  //But made it a different component for legibility
  //Maybe, maybe i'll come back one day and fix this, or not

  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  import { upload_file, new_obra } from "../../../../util/requests";

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
  let fileIsLoading = false;
  let isAdding = false;
  let filesExist = false;
  let isValidInput = false;

  function validate_input() {
    isValidInput = newName && newComposer && new_level.id != -1;
  }

  function reset_component() {
    toggle_add();
    newName = "";
    newComposer = "";
    files = [];
    new_level = levels[0];
    fileIsLoading = false;
    filesExist = false;
    isValidInput = false;
  }

  function toggle_add() {
    isAdding = !isAdding;
  }

  function toggle_load() {
    fileIsLoading = !fileIsLoading;
  }

  function toggle_files() {
    filesExist = !filesExist;
  }

  async function handle_upload_file(id) {
    toggle_load();
    await upload_file(files[0], newName, id);
    toggle_load();
  }

  async function handle_Add_Element(e) {
    if (!isValidInput) {
      alert("Obra no válida");
      return;
    }

    let obra = {
      obra_name: newName,
      obra_composer: newComposer,
      obra_level: new_level.text,
      file_exists: filesExist
    };

    new_obra(obra)
      .then(async res => await res.json())
      .then(async saved_obra => {
        if (filesExist) await handle_upload_file(saved_obra._id);
        dispatch("obraAdded", {});
      })
      .catch(err => {
        alert(err);
      })
      .finally(() => {
        reset_component();
      });
  }
</script>

<style>
  button {
    text-align: center;
    background-color: #ed1c23;
    margin: 0 auto 0 auto;
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

  .add-button-container {
    margin: 0 auto 0 auto;
    text-align: center;
  }
</style>

<tr>
  {#if isAdding}
    <td class="pl-4">
      <div class="row pl-4">
        <div class="column">
          <input
            type="text"
            placeholder="nombre"
            bind:value={newName}
            on:change={validate_input} />
        </div>
        <div class="column">
          <input
            type="text"
            placeholder="compositor"
            bind:value={newComposer}
            on:change={validate_input} />
        </div>

        <div class="column">
          <select bind:value={new_level} on:change={validate_input}>
            {#each levels as new_level}
              <option value={new_level}>{new_level.text}</option>
            {/each}
          </select>
        </div>
      </div>
    </td>

    <td>
      {#if !filesExist && !fileIsLoading}
        <input
          name="file"
          type="file"
          accept=".pdf"
          bind:files
          on:change={toggle_files} />
      {:else if fileIsLoading}
        <p>Cargando...</p>
      {:else if filesExist}
        <p>Archivos Cargados! :)</p>
      {:else}
        <p>Error Cargando Archivo</p>
      {/if}
    </td>

    <td>
      {#if isValidInput}
        <button on:click={handle_Add_Element}>Agregar</button>
      {:else}
        <button on:click={reset_component}>Cancelar</button>
      {/if}

    </td>
  {:else}
    <td>
      <div class="add-button-container">
        <button on:click={toggle_add}>Nueva Obra</button>
      </div>
    </td>
  {/if}
</tr>
