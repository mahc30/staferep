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

  let isAdding = false;
  let new_name = "";
  let new_composer = "";
  let newFile = [];
  let isLoading = false;
  let level = levels[0];

  function reset_component() {
    isAdding = false;
    new_name;
    new_composer;
    newFile = [];
    isLoading = false;
    level = levels[0];
    toggle_add();
  }

  function toggle_add() {
    isAdding = !isAdding;
  }

  function toggle_load() {
    isLoading = !isLoading;
  }

  function upload(e) {
    toggle_load();
    console.log("NOT IMPLEMENTED upload")
  }

  async function handle_Add_Element(e) {
    if (!e.detail) return;
    reset_component();
    toggle_add();

    let new_obra = {
      obra_name: new_name,
      obra_composer: new_composer,
      obra_level: level.text,
      file_exists: true //TODO implement upload files
    };

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
      {#if !isLoading}
        <p on:click={toggle_load}>To Be Implemented</p>
      {:else}
        <p on:click={toggle_load}>To Be Implemented</p>
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
