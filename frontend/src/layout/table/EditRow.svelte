<script>
  import { createEventDispatcher } from "svelte";
  import { upload_file } from "../../../util/requests";

  let dispatch = createEventDispatcher();
  let levels = [
    { id: -1, text: `Nivel` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];

  export let obra;
  let newName = obra.name;
  let newComposer = obra.composer;
  let files = []; //svelte requires this var name
  let newLevel = levels.find(newLevel => newLevel.text === obra.level);
  let fileIsLoading = false;
  let filesExist = obra.file_exists || false;
  let isValidInput = false;

  function validate_input(e) {
    isValidInput =
      (newName && newName != obra.name) ||
      (newComposer && newComposer != obra.composer) ||
      (newLevel.id != -1 && newLevel.text != obra.level) ||
      files[0];
  }

  async function handle_upload_file(e) {
    toggle_load();
    upload_file(files[0], newName, obra.id);
    filesExist = true;
    toggle_load();
  }

  function toggle_load() {
    fileIsLoading = !fileIsLoading;
  }

  async function handle_edit_element(e) {
    if (files[0]) await handle_upload_file();

    let new_obra = {
      obra_id: obra.id,
      name: newName || obra.name,
      composer: newComposer || obra.composer,
      level: newLevel.text,
      file_exists: filesExist
    };

    try {
      let edit = await fetch(`http://${process.env.API}/obras/update`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(new_obra)
      });

      if (edit.ok) {
        dispatch("ObraEdited");
      }
    } catch (error) {
      console.log("Error Editando Obra", error);
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

<tr>
  <td class="pl-4">
    <input type="text" bind:value={newName} on:change={validate_input} />
  </td>
  <td>
    <input type="text" bind:value={newComposer} on:change={validate_input} />
  </td>
  <td>
    <div class="column">
      <select bind:value={newLevel} on:change={validate_input}>
        {#each levels as newLevel}
          <option value={newLevel}>{newLevel.text}</option>
        {/each}
      </select>
    </div>
  </td>
  <td>
    {#if !filesExist && !fileIsLoading}
      <input
        name="file"
        type="file"
        accept=".pdf"
        bind:files
        on:change={validate_input} />
    {:else if fileIsLoading}
      <p>Cargando...</p>
    {:else if filesExist}
      <p>Archivos Cargados! :)</p>
    {:else}
      <p>Error Cargando Archivo</p>
    {/if}
  </td>
  <td>
    <button on:click={handle_edit_element} disabled={!isValidInput}>
      Guardar Cambios
    </button>
  </td>
</tr>
