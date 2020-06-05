<script>
  import { Link } from "svelte-routing";
</script>

<style>
  .row{
    margin-top: 5rem;
  }

  .text-center{
    text-align: center;
  }

.button{
  color: #ed1c23 !important;
  border: 0.1rem solid #ed1c23
}

.button:hover{
  color: #b20000 !important
}
</style>

<div class="container">
  <div class="row">
    <div class="column" />
    <img class="column" src="images/red-logo.png" alt="" />
    <div class="column" />
  </div>

  <div class="row">
    <div class="column" />
    <div class="column text-center">
      <Link to="/table"><button class="button button-outline">Buscar Partituras</button></Link>
    </div>
    <div class="column" />
  </div>
</div>
