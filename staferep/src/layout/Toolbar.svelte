<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  //Handle Select Level
  let selected;
  let questions = [
    { id: -1, text: `Agrupación` },
    { id: 0, text: `Presemillero` },
    { id: 1, text: `Semillero` },
    { id: 2, text: `Preorquesta` },
    { id: 3, text: `Orquesta` }
  ];

  //Handle Composer Input
  let composer;

  function handleSubmit() {
    //Parse Input
    if (selected.id != -1) questions[0].text = "";
    if (composer === "" || !composer) composer = "Todos";

    //Send event to table parent
    dispatch("changedParams", {
      selected: selected.id,
      composer: composer === "Todos" ? "*" : composer //Im sorry if you have to read this, it's not that hard tho
    });
  }
</script>

<style>
  .column {
    margin: 1px 1px 2px 3px;
    text-align: center;
  }

  hr {
    border-top: 0.1rem solid #2c2c2c !important;
  }
</style>

<div class="container">
  <div class="row">
    <div class="column">
      <u>
        Buscar por
        <por class="" />
      </u>
    </div>

    <div class="column">
      <select bind:value={selected} on:change|preventDefault={handleSubmit}>
        {#each questions as question}
          <option value={question}>{question.text}</option>
        {/each}
      </select>
    </div>

    <div class="column">
      <input
        type="text"
        placeholder="Compositor"
        id="nameField"
        bind:value={composer}
        on:focusout={handleSubmit} />
    </div>
  </div>

  <hr />
</div>
