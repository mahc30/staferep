<script>
  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  export let obra;
  export let IS_AUTH;
  export let i;

  function trigger_edit_event(e) {
    dispatch("editObra", { id: e.target.id });
  }

  function trigger_select_event(e) {
    dispatch("newSelect", { obra: obra, checked: e.target.checked });
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
  td, tr{
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


</style>

<tr class:highlight={i % 2 === 0} class="table_body_row">
  {#if IS_AUTH}
    <td>
      <input
        id={obra.id}
        type="checkbox"
        name="select_row"
        on:change={trigger_select_event} />
    </td>
  {/if}
  <td>{obra.name}</td>
  <td>{obra.composer}</td>
</tr>
