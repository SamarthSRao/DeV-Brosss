<template>
	<div>
		<div class="vh">
			<div class="row">
				<div class="five columns">
					<br /><br /><br /><br />
					<br />
					<img src="../assets/img/brand.svg" alt="" class="brand zero" />
					<h5 class="zero">
						Jumpstart your company,
						<!-- <br /> -->
						get funded quick.
					</h5>
					<!-- <h5 style="font-size: 1.2em;>Blast off </h5> -->
					<router-link to="/register">
						<button class="cool">Get started</button>
					</router-link>
				</div>

				<div class="seven columns">
					<img src="../assets/img/mock1.png" alt="" />
				</div>
			</div>
		</div>

		<br /><br /><br />
		<br /><br />

		<div class="vidpen">
			<div>
				<iframe
					width="100%"
					src="https://www.youtube.com/embed/fjzauDBWJDo"
					frameborder="0"
					allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
					class="video"
				></iframe>
			</div>
		</div>

		<br />
		<br /><br />
		<br /><br />
		<br /><br />

		<div class="row">
			<div class="six columns">
				<div>
					<h3 class="zero">
						Start raising money, <span class="green">in 5 minutes</span>.
					</h3>
					<p class="zero" style="margin-bottom: 1em">
						Raise money for your startup company with a click of a button.
						Super-easy, intuitive, with a broad range of investors available
						through our website. From angel investors to superfans, appeal to
						the masses using our services.
					</p>
					<div class="flexer">
						<input
							placeholder="Enter your company name"
							class="raiseinput"
							type="text"
							v-model="compname"
						/>

						<button class="raisebtn" @click.prevent="btnclick()">
							Start raising
						</button>
					</div>
				</div>

				<div style="margin-top: 5em">
					<h3 class="zero">
						Looking to <span class="green">invest</span>? Can't find what you're
						looking for?
					</h3>
					<p class="zero">
						Use our browsing system, to explore multiple options, and look for
						different companies that peak your interest. Crowd-funding made
						easy, accessible. The future is now.
					</p>
					<router-link to="/discover">
						<button class="cool">Browse</button>
					</router-link>
				</div>
			</div>
			<div class="six columns">
				<img src="../assets/img/mock2.png" alt="" />
			</div>
		</div>
		<br /><br />
		<br /><br />

		<section>
			<img
				style="
					-webkit-box-shadow: 0px 14px 133px -54px rgba(0, 0, 0, 0.75);
					-moz-box-shadow: 0px 14px 133px -54px rgba(0, 0, 0, 0.75);
					box-shadow: 0px 14px 133px -54px rgba(0, 0, 0, 0.75);
					border-radius: 1.7em;
				"
				draggable="false"
				src="../assets/img/features.svg"
				alt=""
			/>
			<br /><br />
			<br />
		</section>

		<!-- <h3>{{ content }}</h3> -->
	</div>
</template>

<script>
import UserService from '../services/user.service'

export default {
	name: 'Home',
	data() {
		return {
			content: '',
			compname: ''
		}
	},
	methods: {
		btnclick() {
			if (this?.compname?.length > 0) {
				this.$router.push({
					path: '/create/company',
					query: { name: this.compname }
				})
			}
		}
	},
	mounted() {
		UserService.getPublicContent().then(
			(response) => {
				this.content = response.data
			},
			(error) => {
				this.content =
					(error.response &&
						error.response.data &&
						error.response.data.message) ||
					error.message ||
					error.toString()
			}
		)
	}
}
</script>

<style scoped lang="scss">
img {
	width: 100%;
}
.vh {
	height: 80vh;
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.brand {
	width: 75%;
}

.vidpen {
	position: relative;
	width: 100%;
	height: 0;
	padding-bottom: 56.25%;
}
.video {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border-radius: 0.5em;
}

.raisebtn {
	border-color: var(--green);
	border-radius: 0;
	border-width: 0.15em;
	height: 50px;
	padding: 0 inherit;
	margin: 0;
	background-color: var(--green);
	color: #fff;
	text-transform: none;
	font-size: 1em;
	transition: 0.3s;
	&:hover {
		background-color: var(--green-dark);
		border-color: var(--green-dark);
	}
}

.raiseinput {
	border-right: none;
	// padding: 0 !important;
	width: 25em;
	border-color: var(--green);
	border-radius: 0;
	border-width: 0.15em;
	height: 50px;
	margin: 0;
	&:active {
		outline: none;
		border-color: var(--green);
		border-radius: 0;
		border-width: 0.15em;
		border-right: none;
	}
	&:focus {
		outline: none;
		border-color: var(--green);
		border-radius: 0;
		border-width: 0.15em;
		border-right: none;
	}
}

.flexer {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}
</style>
