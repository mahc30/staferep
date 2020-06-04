<script>
  // ======== CSS stuff ============
  import "../node_modules/milligram/dist/milligram.min.css";

  // ========== Router stuff ========
  import { Router, Route } from "svelte-routing";

  // ========= Components =============
  import Navbar from "./layout/Navbar.svelte";
  import Home from "./pages/Home.svelte";
  import Login from "./pages/Login.svelte";
  import Table from "./pages/Table.svelte";
</script>

<style>

</style>

<Router>
  <Navbar />
  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
  <Route path="/table" component={Table} />
</Router>
