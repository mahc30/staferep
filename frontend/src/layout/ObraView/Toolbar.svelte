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

  // Handle Name
  let name = "";

  async function handleSubmit() {
    //Parse Input
    let filters = {};
    let is_level = level.id != -1;
    let is_composer = composer != "Compositor";
    let is_name = name != "";

    if (is_level) filters.level = level.text;
    if (is_composer) filters.composer = composer;
    if (is_name) {
      filters.name = {
        '$regex': name,
        '$options': "i"
      };
    }
    await dispatch("newSearch", filters);
    reset_component();
  }

  function trigger_Download_event(e) {
    dispatch("obraDownload", { obra: selected[0] });
  }

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

  function reset_component() {
    name = "";
    composer = "Compositor";
    level = levels[0];
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

  .icon:hover {
    stroke: #b20000 !important;
    cursor: pointer;
  }

  .icon:disabled:hover {
    stroke: gray !important;
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

  .disabled {
    stroke: gray;
    pointer-events: none;
  }
  .table-buttons {
    max-width: 50%;
    margin: 0 auto 0 0;
  }

  .row {
    margin: 6px 0 0 auto;
  }
  hr {
    border-bottom: solid black 1px;
  }

  .toolbar-container {
    max-height: 20vh;
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

<div class="toolbar-container">

  <div class="row search-bar">
    <div class="column">
      <u class="noselect">Buscar por</u>
    </div>

    <div class="column">
      <input type="text" bind:value={name} placeholder="Nombre de la Obra" />
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

  <div class="row table-buttons button-bar ">
    <!-- Preview Button -->
    <div class="column">
      <svg
        id={selected}
        on:click={(window.location = `/table/${selected[0].id}`)}
        xmlns="http://www.w3.org/2000/svg"
        class={!(selected.length === 1) || !selected[0].file_exists ? 'icon disabled' : 'icon'}
        width="44"
        height="44"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke={!(selected.length === 1) || !selected[0].file_exists ? 'gray' : '#ed1c23'}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <path
          d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2
          0 0 0 2 2h2" />
        <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
        <rect x="7" y="13" width="10" height="8" rx="2" />
      </svg>
    </div>
    <!-- Download Button-->
    <div class="column">
      <svg
        id={selected}
        on:click={trigger_Download_event}
        disabled={!(selected.length === 1) || !selected[0].file_exists}
        xmlns="http://www.w3.org/2000/svg"
        class={!(selected.length === 1) || !selected[0].file_exists ? 'icon disabled' : 'icon'}
        width="44"
        height="44"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke={!(selected.length === 1) || !selected[0].file_exists ? 'gray' : '#ed1c23'}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <circle cx="12" cy="12" r="9" />
        <line x1="8" y1="12" x2="12" y2="16" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="16" y1="12" x2="12" y2="16" />
      </svg>
    </div>

    {#if IS_AUTH}
      <!-- Edit Button -->
      <div class="column">
        <svg
          on:click={trigger_Edit_Event}
          xmlns="http://www.w3.org/2000/svg"
          class={selected.length === 0 ? 'icon disabled' : 'icon'}
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke={selected.length === 0 ? 'gray' : '#ed1c23'}
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <path
            d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
          <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
          <line x1="16" y1="5" x2="19" y2="8" />
        </svg>
      </div>
      <!-- Delete Button -->
      <div class="column">
        <svg
          on:click={trigger_Delete_Event}
          xmlns="http://www.w3.org/2000/svg"
          class={selected.length === 0 ? 'icon disabled' : 'icon'}
          width="44"
          height="44"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke={selected.length === 0 ? 'gray' : '#ed1c23'}
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </div>
    {/if}
  </div>
  <hr />
</div>
