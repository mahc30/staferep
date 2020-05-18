<script>
	import '../node_modules/materialize-css/dist/css/materialize.min.css';
	import '../node_modules/materialize-css/dist/js/materialize.min.js';
	import {Router, Route} from "svelte-routing";

	import Navbar from "./layout/Navbar.svelte";
	import Home from "./pages/Home.svelte";
	import Login from "./pages/Login.svelte";
	import Table from "./pages/Table.svelte";

</script>

<Router>
	<Navbar/>
	<div class="containter">
		<Route path="/" component="{Home}"/>
		<Route path="/login" component="{Login}"/>
		<Route path="/table" component="{Table}"/>
	</div>
</Router>

<style>

</style>