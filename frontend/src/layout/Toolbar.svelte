<script>
  import AutoComplete from "simple-svelte-autocomplete";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  //Handle Select Level
  let levels = [
    { id: -1, text: `Cualquiera` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];
  let level = levels[0];
  //Handle Composer Input
  let composers = [
    "Cualquiera",
    "Iosef Stalin",
    "Don Julio Jaramillo",
    "Alejandro Gutierritos",
    "Super G",
    "Iosef Makarov",
    "Iosef Makaronni",
    "Don Papi"
  ];
  let composer = composers[0];

  function handleSubmit() {
    //Parse Input
    if (level.id != -1) levels[0].text = "";
    if (composer === "" || !composer) composer = "Cualquiera";

    let data = {
      data: {
        level: level.id,
        composer: composer === "Cualquiera" ? "*" : composer //Im sorry if you have to read this, it's not that hard tho
      }
    };
    //Send event to table parent
    dispatch("changedParams", data);
  }
</script>

<style>
  .column {
    margin: 1px 1px 2px 3px;
    text-align: center;
    display: inline;
  }

  hr {
    border-top: 0.1rem solid #2c2c2c !important;
  }

  u,
  img {
    /* So it´s centered */
    position: relative;
    top: 8px;
  }

  button {
    background-color: #ff5f4e !important;
  }
  button:hover {
    background-color: #b20000 !important;
  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>

<div class="container">
  <div class="row">
    <div class="column">
      <u class="noselect">Buscar por</u>
    </div>

    <div class="column">
      <select bind:value={level} on:change|preventDefault={handleSubmit}>
        {#each levels as level}
          <option value={level}>{level.text}</option>
        {/each}
      </select>
    </div>

    <div class="column">
      <AutoComplete
        items={composers}
        bind:selectedItem={composer}
        noResultsText="" />

    </div>

    <div class="column">
      <button class="button" on:click={handleSubmit}>
        <img src="images/search-icon.svg" alt="" />
      </button>
    </div>
  </div>

  <hr />
</div>
