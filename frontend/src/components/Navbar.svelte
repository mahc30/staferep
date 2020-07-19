<script>
  import { Link } from "svelte-routing";

  let isAuth = false;

  const toggleAuth = e => {
    e.preventDefault();
    isAuth = !isAuth;
  };
</script>

<style>
  .navigation {
    height: 100%;
  }
  .navigation_list {
    padding: 20px 10px;
    height: 100%;
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
  .component-container {
    position: relative;
    max-height: 10vh;
    overflow: hidden;
  }

  hr {
    border-bottom: solid black 1px;
  }
</style>

<div class="component-container">
  <nav class="navigation" on:click={toggleAuth}>

    <ul class="navigation_list">

      <li class="navigation_item">
        <Link to="/" href="badges.html">
          <img class="icon" src="images/red-logo-icon.png" alt="" />
        </Link>
      </li>
    </ul>
  </nav>
</div>
<hr />
