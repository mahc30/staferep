<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { login } from "../../util/requests";
  import { navigate } from "svelte-routing";
  let pw = "";

  async function handleSubmit(e) {
    e.preventDefault();
    login(pw)
      .then(res => {
        dispatch("isAuth");
        localStorage.setItem("auth", res.auth_data.level);
        navigate("/", { replace: true });
      })
      .catch(err => {
        //console.log(err)
      });
  }
</script>

<style>
  .row {
    width: 50%;
    margin: 0 auto 0 auto;
  }

  .button {
    margin: 0 auto 0 auto;
    background-color: #ed1c23;
    border: 0.1rem solid #ed1c23;
  }

  .button:hover {
    background-color: #b20000;
  }

  strong {
    color: #000000;
  }
</style>

<div class="container center">
  <div class="row input-field">
    <input type="password" bind:value={pw} />
  </div>

  <div class="row">
    <button class="waves-effect waves-light btn button" on:click={handleSubmit}>
      <strong>login</strong>
    </button>
  </div>
</div>
