<script>
  import { onMount } from "svelte";
  import Toolbar from "../layout/Toolbar.svelte";

  let headers = [{ title: "Head1" }, { title: "HEad2" }];
  let rows = [
    { name: "dt1", composer: "cdt1" },
    { name: "dt2", composer: "cdt2" }
  ];

  function updateTable(e) {
    console.log(
      "From Table: Params Changed! Updating!",
      e.detail.selected,
      e.detail.composer
    );
  }
</script>

<style>

</style>

<!-- Toolbar -->
<Toolbar on:changedParams={updateTable} />

<!-- Probably the Table -->
<table>
  <thead>
    <tr>
      {#each headers as head}
        <th>{head.title}</th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <td>{row.name}</td>
        <td>{row.composer}</td>
      </tr>
    {/each}
  </tbody>
</table>
