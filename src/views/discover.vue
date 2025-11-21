<template>
	<div>
		<h3 class="zero">Discover</h3>
		<h5>
			Be the first to invest in the <span class="green">next big idea</span>.
		</h5>

		<div style="margin-bottom: 4em; margin-top: 3em" class="flex-center">
			<img style="width: 70%" src="../assets/img/stats.svg" alt="" />
		</div>

		<div class="row">
			<div class="five columns">
				<div v-if="content?.length > 0">
					<div v-for="comp in content.slice(0, 1)" :key="comp">
						<router-link :to="`/company/${comp.username}`">
							<div class="feature center">
								<h5
									class="zero"
									style="
										color: #222;
										background-color: var(--green);
										padding: 0.35em 0;
										font-size: 1.25em;
									"
								>
									Featured Project
								</h5>
							</div>
							<img
								class="compimg"
								:src="comp?.images.length > 0 ? comp?.images[0] : '/comp.png'"
								alt=""
							/>
							<h5 class="zero">{{ comp.name }}</h5>
							<p class="zero">{{ comp.tagline }}</p>
							<p class="zero" v-if="comp?.investment?.goal">
								Goal:
								<span class="green"
									>₹{{
										comp?.investment?.goal
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									}}</span
								>
							</p>
						</router-link>
					</div>
				</div>
			</div>

			<div class="seven columns">
				<div class="recommended" v-if="content?.length > 0">
					<h6 style="letter-spacing: 0.1em; font-weight: 600">
						RECOMMENDED FOR YOU
					</h6>
					<div v-for="comp in content.slice(1, 3)" :key="comp">
						<router-link
							:to="`/company/${comp.username}`"
							style="
								display: flex;
								justify-content: flex-start;
								align-items: flex-start;
							"
						>
							<img
								class="compimg2"
								:src="comp?.images.length > 0 ? comp?.images[0] : '/comp.png'"
								alt=""
							/>
							<div>
								<h5 class="zero">{{ comp.name }}</h5>
								<p class="zero">{{ comp.tagline }}</p>
								<p class="zero" v-if="comp?.investment?.goal">
									Goal:
									<span class="green"
										>₹{{
											comp?.investment?.goal
												.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
										}}</span
									>
								</p>
							</div>
						</router-link>
					</div>
				</div>
				<p v-else>no companies found</p>
			</div>
		</div>

		<div class="flex-center">
			<hr style="width: 70%; margin-bottom: 4em" />
		</div>

		<section id="more">
			<div class="recommended" v-if="content?.length > 0">
				<!-- <h6 style="letter-spacing: 0.1em; font-weight: 600">
					RECOMMENDED FOR YOU
				</h6> -->
				<div class="grid">
					<div v-for="comp in content.slice(3)" :key="comp">
						<router-link :to="`/company/${comp.username}`">
							<img
								class="compimg"
								:src="comp?.images.length > 0 ? comp?.images[0] : '/comp.png'"
								alt=""
								style="aspect-ratio: 16 / 9"
							/>
							<h5 class="zero">{{ comp?.name }}</h5>
							<p class="zero">{{ comp?.tagline }}</p>
							<p class="zero" v-if="comp?.investment?.goal">
								Goal:
								<span class="green"
									>₹{{
										comp?.investment?.goal
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
									}}</span
								>
							</p>
						</router-link>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import UserService from '../services/user.service'

export default {
	name: 'User',
	data() {
		return {
			content: ''
		}
	},
	mounted() {
		UserService.getDiscoverPage().then(
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
.compimg2 {
	width: 10em;
	margin-right: 2em;
}

.recommended {
	a {
		margin-bottom: 2em;
	}
	.grid {
		display: grid;
		grid-gap: 3em;
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 750px) {
	.grid {
		display: grid;
		grid-gap: 3em;
		grid-template-columns: repeat(1, 1fr);
	}
}
</style>
