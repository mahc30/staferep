<script>
  import { onMount } from "svelte";

  let headers = [{ title: "Head1" }, { title: "HEad2" }];
  let rows = [
    { name: "dt1", composer: "cdt1" },
    { name: "dt2", composer: "cdt2" }
  ];

  onMount(async => {});
</script>

<style>
  /* your styles go here */
</style>

<table class="centered highlight">
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
    <td />
  </tbody>
</table>
