<script>
  import { createEventDispatcher } from "svelte";
  import util from "../../../../util/util";
  let dispatch = createEventDispatcher();

  export let obra;
  export let i;
  export let selected;

  function trigger_edit_event(e) {
    dispatch("editObra", { id: e.target.id });
  }

  function trigger_select_event(e) {
    dispatch("newSelect", { obra: obra, checked: e.target.checked });
  }
</script>

<style>
  td,
  tr {
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
  <td>{obra.name}</td>
  <td>
    <input
      id={obra.id}
      type="checkbox"
      name="select_row"
      checked={util.array_contains(selected, obra.id)}
      on:change={trigger_select_event} />
  </td>
</tr>
