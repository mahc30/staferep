<script>
  import AutoComplete from "simple-svelte-autocomplete";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  const dispatch = createEventDispatcher();
  let filters = {};
  //Handle Select Level
  let levels = [
    { id: -1, text: `Nivel` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];
  let level = levels[0];
  //Handle Composer Input
  var composers = ["Compositor"];
  var composer = composers[0]; //Initial Value, it should never be unassigned

  function handleSubmit() {
    //Parse Input
    let data = {};
    let is_level = level.id != -1;
    let is_composer = composer != "Compositor" || false;

    if (is_level) data.level = level.text;
    if (is_composer) data.composer = composer;
    if (is_level || is_composer) dispatch("changedParams", data);
    //If there is any data to send, do it
    else dispatch("changedParams");
  }

  onMount(async () => {
    //TODO Get Initial of composers to show
    const res = await fetch(`http://localhost:3000/obras/findall`, {
      method: "GET",
      headers: { "Content-type": "application/json" }
    });

    //Remember composers must be an Array of strings, cuz module requirements
    let composer_list = await res.json();
    let new_composers = [];

    composer_list.forEach(element => {
      new_composers = [...new_composers, element.composer];
      composers = [composers[0], ...new Set(new_composers)]; //Apparently ...new SET returns a new array without duplicates :o
    });
  });
</script>

<style>
  .column {
    text-align: center;
    display: inline;
  }

  img {
    /* Search Button Image */
    /* So it´s centered */
    position: relative;
    top: 8px;
  }

  button {
    background-color: #ed1c23 !important;
    border: #ed1c23;
  }

  button:hover {
    background-color: #b20000 !important;
    border: #b20000;
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
      <select bind:value={level}>
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
</div>
