<script>
  // ======== CSS stuff ============
  import "../node_modules/milligram/dist/milligram.min.css";
  
  // ========= Components =============
  import Navbar from "./layout/Navbar.svelte";
  import Home from "./components/Home.svelte";
  import Login from "./components/Login.svelte";
  import ObraView from "./components/ObraView.svelte";
  // ========== Router stuff ========
  import { Router, Route } from "svelte-routing";
</script>

<style>

</style>

<Router>
  <Navbar />
  <Route path="/" component={Home} />
  <Route path="/login" component={Login} />
  <Route path="/table" component={ObraView} />
</Router>
