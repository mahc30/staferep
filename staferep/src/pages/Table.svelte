<script>
  import { onMount } from "svelte";
  import Toolbar from "../layout/Toolbar.svelte";

  let headers = [{ title: "Obra" }, { title: "Compositor" }];
  let rows = [
    { name: "Despacito", composer: "Mozart" },
    { name: "Adagio en Re menor", composer: "Pitbull" }
  ];

  function updateTable(e) {
    console.log(
      "From Table: Params Changed! Updating!",
      e.detail.data,
      e.detail.data.level,
      e.detail.data.composer
    );
  }
</script>

<style>
th, td{
  text-align: center;
}

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
