<script>
  import AutoComplete from "simple-svelte-autocomplete";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";
  const dispatch = createEventDispatcher();

  //Initialize Components
  export let IS_AUTH;
  export let selected = [];

  onMount(async () => {

    levels = [
      { id: -1, text: `Nivel` },
      { id: 0, text: `Presemillero` },
      { id: 1, text: `Semillero` },
      { id: 2, text: `Preorquesta` },
      { id: 3, text: `Orquesta` }
    ];
    level = levels[0];

    composer = composers[0]; //Initial Value
  });

  /*
    ///////////////////////////////////////////////////////////////

    First everything related to the SearchAndRequest™ of new 
    parametized information

    ///////////////////////////////////////////////////////////////    
  */

  //Handle Select Level
  let levels = [];
  let level = {};

  //Handle Composer Input
  export let composers = ["Compositor"];
  let composer;

  function handleSubmit() {
    //Parse Input
    let filters = {};
    let is_level = level.id != -1;
    let is_composer = composer != "Compositor" || false;

    if (is_level) filters.level = level.text;
    if (is_composer) filters.composer = composer;

    dispatch("newSearch", filters);
  }

  /*
    ///////////////////////////////////////////////////////////////

    Then everything related to the LogicHandling™ of CRUD operations

    ///////////////////////////////////////////////////////////////    
  */
  function trigger_download_event(e) {}

  function trigger_Edit_Event() {
    selected.forEach(obra => {
      dispatch("obraEdit", { obra: obra, new_edit: true });
    });

    selected = [];
  }

  function trigger_Delete_Event() {
    selected.forEach(obra => {
      dispatch("obraDelete", obra.id);
    });

    selected = [];
  }
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
  .table-buttons {
    max-width: 50%;
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

  <!--- Table operations -->
  {#if IS_AUTH}
    <div class="row table-buttons">
      <div class="column">
        <button
          id=""
          disabled={selected.length === 0}
          on:click={trigger_Edit_Event}>
          Editar
        </button>
      </div>

      <div class="column">
        <button
          id={selected}
          on:click={trigger_download_event}
          disabled={!(selected.length === 1)}>
          Descargar
        </button>
      </div>

      <div class="column">
        <button
          on:click={trigger_Delete_Event}
          disabled={selected.length === 0}>
          Eliminar
        </button>
      </div>
    </div>
  {/if}
</div>
