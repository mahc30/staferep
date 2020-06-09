<script>
  import { Link } from "svelte-routing";

  let isAuth = false;

  const toggleAuth = e => {
    e.preventDefault();
    isAuth = !isAuth;
  };
</script>

<style>
  .navigation_list {
    border-bottom: solid 1px #000;
    padding: 20px 10px;
  }
  .navigation_item {
    display: inline;
    list-style: none;
    margin: 0 20px;
  }
  .icon {
    max-width: 48px;
    max-height: 48px;
  }
</style>

<nav class="navigation" on:click={toggleAuth}>

  <ul class="navigation_list">

    <li class="navigation_item">
      <Link to="/" href="badges.html">
        <img class="icon" src="images/red-logo-icon.png" alt="" />
      </Link>
    </li>
  </ul>
</nav>
