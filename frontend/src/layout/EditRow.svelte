<script>
  import { createEventDispatcher } from "svelte";

  let dispatch = createEventDispatcher();
  let levels = [
    { id: -1, text: `Nivel` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];

  export let obra;
  let new_name;
  let new_composer;
  let new_file;
  
  let level = levels.find(level => level.text === obra.level)

  function save(e) {
    let new_obra = {obra_id: obra.id, level:level.text, edit: true};

    //That variable naming kys
    if(new_name) new_obra.name = new_name;
    if(new_composer) new_obra.composer = new_composer;
    if(new_file) new_obra.file_exists = new_file;

    dispatch("rowEdited", new_obra);
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
    <input type="text" placeholder={obra.name} bind:value={new_name} />
  </td>
  <td>
    <input type="text" placeholder={obra.composer} bind:value={new_composer} />
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
    <button>Subir Archivo</button>
  </td>
  <td>
    <button on:click={save}>Guardar Cambios</button>
  </td>
</tr>
