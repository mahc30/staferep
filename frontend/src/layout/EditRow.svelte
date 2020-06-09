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
  let level = levels[0];

export let obra;
let new_name;
let new_composer;
let new_level;
let new_file;

function save(e){
    dispatch("rowEdited");
}

</script>

<style>
  th,
  td {
    padding: 0 0 0 auto;
    color: black;
  }

  hr {
    border-top: 0.1rem solid #2c2c2c !important; /* hr tag is white for default, have to override it */
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
</style>
<tr>
    <td><input type="text" placeholder="{obra.name}" bind:value={new_name}></td>
    <td><input type="text" placeholder="{obra.composer}" bind:value={new_composer}></td>
    <td><div class="column">
      <select bind:value={level}>
        {#each levels as level}
          <option value={level}>{level.text}</option>
        {/each}
      </select>
    </div></td>
    <td><button>Subir Archivo </button></td>
    <td><button on:click={save}>Guardar Cambios</button></td>                      
</tr>