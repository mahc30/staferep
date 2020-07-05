<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  let title = "";
  let body = "";
  let loading = false;

  async function onSubmit(e) {
    e.preventDefault();
    if (title.trim() === "" || body.trim() === "") return;
    loading = true;

    const newPost = { title, body };

    fetch(`http://somewheretopost/yeet`, {
      method: "POST",
      body: JSON.stringify(newPost)
    })
      .then(res => {
        dispatch("PostCreated", res.json());
        loading = false;
      })
      .catch(err => {
        loading = false;
      });
  }
</script>

{#if !loading}
  <form on:submit={onSubmit}>
    <div class="input-field">
      <label for="title">Title</label>
      <input type="text" bind:value={title} />
    </div>

    <div class="input-field">
      <label for="body">Cuerpa</label>
      <input type="text" bind:value={body} />
    </div>
    <button type="submit" class="waves-effect waves-light btn">Search</button>
  </form>
{:else}
  <div class="progress">
    <div class="indeterminate" />
  </div>
{/if}
