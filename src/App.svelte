<script lang="ts">
	import { Route } from "svelte-micro";
	import { fade } from 'svelte/transition';
	import AboutPage from "./pages/AboutPage.svelte";
	import GamePage from './pages/GamePage.svelte';
	import MenuPage from './pages/MenuPage.svelte';
</script>

<div transition:fade={{duration: 500}} class="app">
	<Route>
		<Route path="/4"><GamePage size="{4}" /></Route>
		<Route path="/6"><GamePage size="{6}" /></Route>
		<Route path="/8"><GamePage size="{8}" /></Route>
		<Route path="/10"><GamePage size="{10}" /></Route>
		<Route path="/12"><GamePage size="{12}" /></Route>
		<Route path="/about"><AboutPage /></Route>
		<Route path="/"><MenuPage /></Route>
	</Route>
</div>

<style lang="scss">
	.app {
		width: 100%;
		height: 100vh;
		text-align: center;
		display: flex;
		justify-content: center; // Center content horizontally
		flex-direction: column;
		align-items: center;
		background-color: #ad835a;
		color: #2ddaff;
		overflow: hidden;
		padding: 1rem; // Add some padding for mobile screens

		// Media queries for responsiveness
		@media (max-width: 768px) {
			.app {
				flex-direction: column;
				padding: 0.5rem;
			}
		}

		@media (max-width: 480px) {
			.app {
				padding: 0.2rem;
			}
		}
	}
</style>
