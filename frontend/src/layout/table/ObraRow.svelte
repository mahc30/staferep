<script>
  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  export let obra;
  export let IS_AUTH;
  export let i;

  async function handle_Delete_Element(e) {
    let id = e.target.id;

    try {
      let delete_req = await fetch("http://localhost:3000/obras/delete", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ obra_id: id })
      });

      if (delete_req.ok) dispatch("ObraDeleted");

      /* TODO Reimplement This but prettier
      let new_rows = util.delete_at_index(rows, id);
      console.log(new_rows);
      handle_Update_Table({ rows: new_rows });
      */
    } catch (error) {
      console.log("Error Eliminando Obra", error);
    }
  }

  function trigger_edit_event(e) {
    dispatch("editObra", { id: e.target.id });
  }

  async function handle_Download_Element(e) {
    let id = e.target.id;

    let checkForDownload = await fetch(
      `http://localhost:3000/obras/download/${id}`
    );

    if (checkForDownload.ok)
      //Triggers Download
      window.location = `http://localhost:3000/obras/download/${id}`;
    else alert("Error intentando descargar");
  }
</script>

<style>
  td {
    text-align: center;
    color: black;
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

<tr class:highlight={i % 2 === 0} class="table_body_row">
  <td>{obra.name}</td>
  <td>{obra.composer}</td>

  <!-- buttons for CRUD  
            For Admins and Normal Users
          -->
  {#if IS_AUTH}
    <td>
      <button id={obra.id} on:click={trigger_edit_event}>Editar</button>
    </td>
    <td>
      <button
        id={obra.id}
        on:click={handle_Download_Element}
        disabled={!obra.file_exists}>
        <!-- For Some Reason file_exists true is detected as False, so that's why there's a !!negation -->
        Descargar
      </button>
    </td>
    <td>
      <button id={obra.id} on:click={handle_Delete_Element}>Eliminar</button>
    </td>
  {:else}
    <!-- If it's not auth user can only see download -->
    <td/>
    <td>
      <button
        id={obra.id}
        on:click={handle_Download_Element}
        disabled={!obra.file_exists}>
        Descargar
      </button>
    </td>
    <td/>
  {/if}
</tr>
