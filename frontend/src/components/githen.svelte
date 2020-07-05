<script>
  import { onMount } from "svelte";
  import Form from "./Form.svelte";

  const apibaseurl = "https://api.github.com/users";
  let posts = [];

  onMount(async () => {
    const res = await fetch(apibaseurl);
    posts = await res.json();
  });

  function addPost({detail: post}){
    posts = [post, ...posts]
  }
</script>

<div class="row">
  <Form on:PostCreated= {addPost}/>

  {#if posts.length === 0}
    <h3>Loading Posts...</h3>
  {:else}
    {#each posts as post}
      <div class="col s6">
        <div class="card">
          <div class="card-content">
            <p class="card-title">{post.login}</p>
            <p class="timestamp">{post.html_url}</p>
            <img src={post.avatar_url} alt="" />
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
