<script>
  //It's Pretty much the same as EditRow, only changes the event and some "save()" logic
  //But made it a different component for legibility
  //Maybe, maybe i'll come back one day and fix this, or not

  import { createEventDispatcher } from "svelte";

  export let isAdding;
  let dispatch = createEventDispatcher();
  let levels = [
    { id: -1, text: `Nivel` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];

  let new_name;
  let new_composer;
  let new_file;
  let level = levels[0];

  function toggle_add() {
    isAdding = !isAdding;
  }


//TODO validations that all fields have been modified
  function save(e) {
    let new_obra = {
      obra_name: new_name,
      obra_composer: new_composer,
      obra_level: level.text,
      file_exists: new_file || false
    };
    isAdding = false;
    dispatch("obraAdded", new_obra);
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
      <input type="text" placeholder="nombre" bind:value={new_name} />
    </td>
    <td>
      <input type="text" placeholder="compositor" bind:value={new_composer} />
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
      <button on:click={save}>Agregar</button>
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
