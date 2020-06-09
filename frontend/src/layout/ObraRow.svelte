<script>
   import { createEventDispatcher } from "svelte";
let dispatch = createEventDispatcher();

export let obra;
export let IS_AUTH;
export let i;

function trigger_delete_event(e) {
  dispatch("deleteObra", {id: e.target.id})
}

function trigger_edit_event(e){
  console.log("trigger edit");
    dispatch("editObra", {id: e.target.id});
}

function trigger_download_event(e){
    dispatch("downloadObra", {id: e.target.id});
}
</script>

<style>
 th,
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
                on:click={trigger_download_event}
                disabled={obra.file_exists}>
                Descargar
              </button>
            </td>
            <td>
              <button id={obra.id} on:click={trigger_delete_event}>
                Eliminar
              </button>
            </td>
          {:else}
            <td>
              <button
                id={obra.id}
                on:click={trigger_download_event}
                disabled={obra.file_exists}>
                Descargar
              </button>
            </td>
          {/if}
        </tr>