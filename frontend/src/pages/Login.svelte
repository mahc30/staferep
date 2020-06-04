<script>
  import { navigate } from "svelte-routing";
  let pw = "";

  async function onSubmit(e) {
    e.preventDefault();
    if (pw.trim() === "") return;

    fetch(`http://somewheretopost/yeet`, {
      method: "POST"
      //body: JSON.stringify(newPost)
    })
      .then(res => {
        dispatch("isAuth", res.json());
        navigate("/", { replace: true });
      })
      .catch(err => {
        console.log("Navigate /");
        navigate("/", { replace: true });
      });

    //TODO move this to .then() block once fetch actually works, if fetch does not receive response it never navigates
    if(pw != "contraseñasegura") return;
    localStorage.setItem("auth", true);
    navigate("/", { replace: true });
  }
</script>

<style>
  /* your styles go here */
</style>

<form on:submit={onSubmit}>
  <div class="input-field">
    <input type="text" bind:value={pw} />
  </div>

  <button type="submit" class="waves-effect waves-light btn">
    <i class="material-icons">send</i>
  </button>
</form>
