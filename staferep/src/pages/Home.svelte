<script>
  import {Link} from 'svelte-routing'
</script>

<style>
  .valign-wrapper {
    height: 85vh;
  }
</style>

<div class="container valign-wrapper">
  <div class="row">
    <div class="col s3" />
    <div class="col s6 center">
      <img class="responsive-img" src="build/images/red-logo.png" alt="" />
      <Link to="/table"><h5 class="btn red">Buscar Partituras</h5></Link>
    </div>
    <div class="col s3" />
  </div>
</div>
