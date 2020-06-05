<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  import { navigate } from "svelte-routing";
  let pw = "";

  async function handleSubmit(e) {
    e.preventDefault();
    if (pw.trim() === "") return;

    //TODO tokenize this
    let auth = {
      password: pw
    };

    const res = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(auth)
    });

    if (res.ok) {
      console.log(res);
      dispatch("isAuth");
      localStorage.setItem("auth", "AUTH_LEVEL");
      navigate("/", { replace: true });
    }
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

  .input-field {
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
