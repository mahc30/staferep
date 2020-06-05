<script>
  import { onMount } from "svelte";
  import Toolbar from "../layout/Toolbar.svelte";
  import format from "../../util/format_data";
  /* Example of what i need to do 
      let headers = [{ title: "Obra" }, { title: "Compositor" }];
  let rows = [
    { name: "Despacito", composer: "Mozart" },
    { name: "Adagio en Re menor", composer: "Pitbull" }
  ];

  function fetch_Obra_list(e) {
    console.log(
      "From Table: Params Changed! Updating!",
      e.detail.raw_data,
      e.detail.raw_data.level,
      e.detail.raw_data.composer
    );
  }
  */
  let headers = [];
  let rows = [];

  function update_Table(list) {
    headers = list.headers;
    rows = list.rows;
  }

  function fetch_Obra_list(e) {
    // Fetch Data
    const aaaaa = (async () => {
      const response = await fetch("http://localhost:3000/obras/findall", {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      });
      const raw_data = await response.json();
      let parsed_data = format(raw_data);

      update_Table(parsed_data);
      return raw_data; //Just because it's necessary to return a promise, probably, docs do it like this
    })();
  }
</script>

<style>
  th,
  td {
    text-align: center;
  }
</style>

<!-- Toolbar -->
<Toolbar on:changedParams={fetch_Obra_list} />

<!-- Probably the Table -->
<table>
  <thead>
    <tr>
      {#await update_Table}
        <p>Loading</p>
      {:then raw_data}
        {#each headers as head}
          <th>{head.title}</th>
        {/each}
      {:catch error}
        <p>Error</p>
      {/await}

    </tr>
  </thead>
  <tbody>
    {#await update_Table}
      <p>Loading</p>
    {:then raw_data}
      {#each rows as row}
        <tr>
          <td>{row.name}</td>
          <td>{row.composer}</td>
        </tr>
      {/each}
    {:catch error}
      <p>Error</p>
    {/await}

  </tbody>
</table>
