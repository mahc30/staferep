<script>
  import { Link } from "svelte-routing";

  let isAuth = false;

  const toggleAuth = e => {
    e.preventDefault();
    isAuth = !isAuth;
  }
</script>

<nav class="red darken-4" on:click={toggleAuth}>
  <div class="nav-wrapper">
    <div class="container">
      <Link to="/" href="badges.html">
        <span class="brand-logo">
          <i class="material-icons">home</i>
        </span>
      </Link>

      <ul id="nav-mobile" class="right hide-on-med-and-down">
        {#if !isAuth}
          <li>
            <Link to="/login" href="sass.html">
              <span class="red-text text-darken-4">. . .</span>
            </Link>
          </li>
        {/if}

        <li>
          <Link to="/table">
            <span class="brand-logo">Tablas</span>
          </Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
