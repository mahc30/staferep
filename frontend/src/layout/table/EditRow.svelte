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
  let new_name = obra.name;
  let new_composer = obra.composer;
  let new_file = false; //TODO temporal value til file upload is implemented
  let new_level = levels.find(new_level => new_level.text === obra.new_level);

  //TODO validations that all fields have been modified

  async function handle_Edit_Element(e) {
    let new_obra = {
      obra_id: obra.id,
      name: new_name || obra.name,
      composer: new_composer || obra.composer,
      level: new_level.text,
      file_exists: new_file || false
    };

    try {
      let edit = await fetch("http://localhost:3000/obras/update", {
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
    <input type="text" bind:value={new_name} />
  </td>
  <td>
    <input type="text" bind:value={new_composer} />
  </td>
  <td>
    <div class="column">
      <select bind:value={new_level}>
        {#each levels as new_level}
          <option value={new_level}>{new_level.text}</option>
        {/each}
      </select>
    </div>
  </td>
  <td>
    <button>Subir Archivo</button>
  </td>
  <td>
    <button on:click={handle_Edit_Element}>Guardar Cambios</button>
  </td>
</tr>
