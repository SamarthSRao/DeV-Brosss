<template>
	<div>
		<h3 class="zero">Threads</h3>
		<h5>Your text chains</h5>

		<div v-if="content?.threads?.length > 0">
			<div class="row">
				<div class="six columns">
					<div
						v-for="(thread, index) in content?.threads"
						class="thing"
						:key="thread"
					>
						<router-link
							class="zero threadlink"
							style="
								display: flex;
								justify-content: flex-start;
								align-items: center;
								margin-bottom: 2em;
							"
							:to="`/threads/${thread._id}`"
						>
							<div
								style="
									display: flex;
									justify-content: flex-start;
									align-items: center;
									width: 70%;
								"
							>
								<img
									style="width: 3.5em; border-radius: 10em; margin-right: 1.5em"
									:src="
										content?.users[index]?.image
											? content?.users[index]?.image
											: 'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'
									"
									alt=""
								/>
								<div>
									<h5 class="zero">
										{{
											content?.users[index]?.fullname
												? content?.users[index]?.fullname
												: 'Full Name'
										}}
									</h5>
									<h6 class="zero">
										{{
											content?.users[index]?.username
												? content?.users[index]?.username
												: 'username'
										}}
									</h6>
								</div>
							</div>
							<div class="arr">&rarr;</div>
						</router-link>
					</div>
				</div>
				<div class="six columns">
					<!-- <img src="../assets/img/text.svg" alt="" /> -->
				</div>
				<div class="u-cf"></div>
			</div>
		</div>
		<br /><br /><br /><br />
		<br /><br /><br /><br />
		<br /><br /><br /><br />
		<br /><br /><br /><br />
	</div>
</template>

<script>
import UserService from '../services/user.service'

export default {
	name: 'Profile',
	computed: {
		currentUser() {
			return this.$store.state.auth.user
		}
	},
	data() {
		return {
			content: ''
		}
	},
	mounted() {
		if (!this.currentUser) {
			this.$router.push('/login')
		}
		UserService.getThreads().then(
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
a:hover {
	color: var(--green-dark);
}

.thing {
	.arr {
		transition: 0.3s;
	}
}

.thing:hover {
	.arr {
		margin-left: 2em;
	}
}
</style>
