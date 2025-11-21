<template>
	<div id="app">
		<div class="navcont">
			<nav :class="`nav nav-${$route.meta.title}`">
				<!-- <router-link to="/" class="nav-link">
				Home
			</router-link> -->
				<!-- <router-link v-if="showAdminBoard" to="/admin" class="nav-link"
				>Admin Board</router-link
			>
			<router-link v-if="showModeratorBoard" to="/mod" class="nav-link"
				>Moderator Board</router-link
			> -->

				<router-link to="/">
					<img
						src="./assets/img/brand.svg"
						style="width: 6em; margin-right: 1em; margin-bottom: -0.1em"
						alt=""
					/>
				</router-link>
				<div class="mid">
					<router-link v-if="currentUser" to="/discover">Discover</router-link>
					<router-link v-if="currentUser" to="/create/company"
						>Create company</router-link
					>
					<router-link v-if="currentUser" to="/threads">Threads</router-link>
				</div>
				<!-- <router-link v-if="currentUser" to="/user" class="nav-link"
				>User</router-link
			> -->

				<div>
					<router-link v-if="!currentUser" to="/register">Register</router-link>
					<router-link v-if="!currentUser" to="/login">Login</router-link>
				</div>

				<router-link style="margin-right: 0" v-if="currentUser" to="/profile">
					{{ currentUser.username }}
				</router-link>
				<!-- <a v-if="currentUser" href @click.prevent="logOut">Log out</a> -->
			</nav>
		</div>

		<div class="navcont">
			<router-view />
		</div>

		<footer class="footer">
			<div class="navcont">
				<div class="row">
					<div class="six columns">
						<a href @click.prevent target="_blank">Terms & Conditions</a>
						<p class="zero">&copy; PAYOUT.</p>
					</div>
					<div class="six columns" style="text-align: right">
						<p class="zero">Made with <span class="green">&#10084;</span> by</p>
						<p class="zero">
							<a href="//instagram.com/Samarrrtthh" target="_blank">Samarth S Rao</a>,
							<a href="//instagram.com/">Vindhya H K</a>, and
							<a href="//instagram.com/PrithviRajKandan" target="_blank">Prithvi Raj Kandan</a>
							<a href="//instagram.com/_Chiraagv" target="_blank">Chiraag V</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	computed: {
		currentUser() {
			return this.$store.state.auth.user
		},
		showAdminBoard() {
			if (this.currentUser && this.currentUser['roles']) {
				return this.currentUser['roles'].includes('ROLE_ADMIN')
			}

			return false
		},
		showModeratorBoard() {
			if (this.currentUser && this.currentUser['roles']) {
				return this.currentUser['roles'].includes('ROLE_MODERATOR')
			}

			return false
		}
	},
	methods: {
		logOut() {
			this.$store.dispatch('auth/logout')
			this.$router.push('/login')
		}
	}
}
</script>

<style lang="scss">
.nav-Home {
	display: none;
}

nav.nav {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2em 0;
	margin-bottom: 2em;
	.mid {
		margin-left: 7em;
		a {
			margin-right: 3em;
		}
	}
}

nav a {
	margin-right: 1em;
	font-size: 1.2em;
	&:hover {
		color: var(--green);
	}
}
.nav .router-link-exact-active {
	color: var(--green) !important;
}

footer.footer {
	padding: 2em 0;
	opacity: 0.7;
}
</style>
