<template>
	<div>
		<router-link to="/threads">
			<h6>&larr; Back to all threads</h6>
		</router-link>
		<h3 class="zero">Specific Textchain</h3>
		<h5>
			Your messages with
			<span style="color: var(--green-dark)">{{
				content?.thread?.otheruser?.username
			}}</span>
		</h5>
		<hr />

		<div class="row">
			<div class="flex-center">
				<div class="four columns card">
					<div class="messages">
						<div
							v-for="msg in content?.thread?.messages"
							class="zero"
							:key="msg"
						>
							<p
								class="zero who"
								:style="
									msg.from == currentUser.id
										? 'text-align: right'
										: `text-align: left`
								"
							>
								{{
									msg.from == currentUser.id
										? 'You'
										: `${content?.thread?.otheruser?.username}`
								}}
							</p>

							<p
								:style="
									msg.from == currentUser.id
										? 'text-align: right'
										: 'text-align: left'
								"
								class="msgcontent"
							>
								{{ msg.content }}
							</p>
						</div>
					</div>

					<form @submit.prevent="sendmsg()">
						<input
							style="margin-top: 1em"
							v-model="msgcon"
							type="text"
							placeholder="Message"
							required
						/>
					</form>
				</div>
				<div class="u-cf"></div>
			</div>
		</div>
	</div>
</template>

<script>
import UserService from '../services/user.service'
import dateFormat from 'dateformat'

export default {
	name: 'Profile',
	computed: {
		currentUser() {
			return this.$store.state.auth.user
		}
	},
	data() {
		return {
			content: '',
			userDesign: false,
			msgcon: ''
		}
	},
	methods: {
		getmsgs() {
			UserService.setSeenandThread(this.$route.params.threadid).then(
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
		},

		sendmsg() {
			UserService.sendmsg(
				this.$route.params.threadid,
				this.msgcon,
				Date.now()
			).then(
				(response) => {
					this.content = response.data
					this.msgcon = ''
					this.getmsgs()
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
	},
	mounted() {
		if (!this.currentUser) {
			this.$router.push('/login')
		}
		this.getmsgs()
	}
}
</script>

<style scoped lang="scss">
.who {
	color: var(--green-dark);
}

.msgcontent {
	margin-bottom: 0.2em;
}

.card {
	padding: 2em 1em 0.5em 1em;
	border: solid 2px var(--green);
	border-radius: 1em;
	input {
		margin-bottom: 0;
	}
}
</style>
