<template>
	<div>
		<h3>Profile</h3>

		<div class="rect">
			<h4>
				{{ content?.user?.fullname || content?.user?.username || 'username' }}
			</h4>
		</div>
	</div>

	<div
		style="display: flex; justify-content: space-between; align-items: center"
		class="flexdata"
	>
		<div
			style="display: flex; justify-content: flex-start; align-items: center"
		>
			<div class="inv center dat">
				<h3 class="zero green">
					{{ content?.investments?.length }}
				</h3>
				<h5 class="zero">Investments</h5>
			</div>

			<div class="com center dat">
				<h3 class="zero green">
					{{ content?.companies?.length }}
				</h3>
				<h5 class="zero">Companies</h5>
			</div>
		</div>
		<div>
			<button @click="show = true" class="upload link">Upload image</button>
			<button @click="logOut()" class="logout link">Logout</button>
		</div>
	</div>

	<my-upload
		field="img"
		@crop-success="cropSuccess"
		v-model="show"
		:width="300"
		:height="300"
		img-format="png"
		langType="en"
		:noCircle="true"
	></my-upload>

	<div style="margin-top: 0em">
		<section class="info">
			<div class="row">
				<div class="seven columns">
					<br />
					<!-- {{ content?.totalinv }} -->
					<!-- {{ content?.investments }} -->
					<h6 class="smltitle">Edit information</h6>

					<h6 class="label">Full name</h6>
					<input type="text" v-model="form.name" placeholder="Full name" />

					<h6 class="label">Profile picture</h6>
					<input
						type="text"
						placeholder="Profile picture link"
						v-model="form.propic"
					/>
					<button
						class="link zero upload"
						@click.prevent="addName()"
						style="float: right"
					>
						Save
					</button>
				</div>

				<div class="u-cf"></div>
			</div>
		</section>

		<h6 class="smltitle" v-if="content?.companies?.length > 0">
			Your companies
		</h6>

		<div class="grid">
			<div class="comp" v-for="comp in content?.companies" :key="comp">
				<!-- <router-link
				:to="
					!comp?.firstEditComplete
						? `/company/${comp.username}/edit?firstEdit=true`
						: `/company/${comp.username}/edit`
				"
			>
				<h5 class="zero">{{ comp.name }}</h5>
				<p class="zero">{{ comp.tagline }}</p>
				<hr />
			</router-link> -->
				<router-link
					:to="
						!comp?.firstEditComplete
							? `/company/${comp.username}/edit?firstEdit=true`
							: `/company/${comp.username}/edit`
					"
				>
					<img
						class="compimg"
						:src="comp?.images.length > 0 ? comp?.images[0] : '/comp.png'"
						alt=""
						style="aspect-ratio: 16 / 9"
					/>
					<h5 class="zero" style="margin-bottom: -0.2em">{{ comp?.name }}</h5>
					<p class="zero">
						{{ comp?.tagline ? comp?.tagline : 'This is a tagline' }}
					</p>
					<p
						v-if="!comp?.firstEditComplete"
						style="
							color: red;
							text-transform: uppercase;
							font-weight: 700;
							font-size: 0.85em;
							letter-spacing: 0.1em;
						"
					>
						incomplete company
					</p>
				</router-link>
			</div>
		</div>

		<h6 class="smltitle" v-if="content?.investments?.length > 0">
			Your investments
		</h6>

		<div class="grid">
			<div
				class="comp"
				v-for="(comp, index) in content?.investments"
				:key="comp"
			>
				<!-- <img
					class="compimg"
					:src="comp?.images.length > 0 ? comp?.images[0] : '/comp.png'"
					alt=""
					style="aspect-ratio: 16 / 9"
				/> -->
				<div class="card">
					<h5 class="zero" style="color: var(--green-dark)">
						{{ content?.compids[index]?.name }}
					</h5>
					<h5 style="font-size: 1.25em" class="zero">
						${{
							comp?.amount
								? comp?.amount
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
								: '000'
						}}
						invested
					</h5>
					<h5 style="font-size: 1.25em" class="zero">
						{{ comp?.percentage }}% stake
					</h5>
				</div>
			</div>
		</div>

		<br />
	</div>
</template>

<script>
import UserService from '../services/user.service'
import myUpload from 'vue-image-crop-upload'
import axios from 'axios'

export default {
	name: 'Profile',
	computed: {
		currentUser() {
			return this.$store.state.auth.user
		}
	},
	data() {
		return {
			form: {
				name: '',
				propic: ''
			},
			content: '',
			show: false,
			params: {
				token: '123456798',
				name: 'avatar'
			},
			imgDataUrl: '' // the datebase64 url of created image
		}
	},
	components: {
		'my-upload': myUpload
	},
	methods: {
		logOut() {
			this.$store.dispatch('auth/logout')
			this.$router.push('/login')
		},
		toggleShow() {
			this.show = !this.show
		},
		/**
		 * crop success
		 *
		 * [param] imgDataUrl
		 * [param] field
		 */
		async cropSuccess(imgDataUrl, field) {
			console.log('-------- crop success --------')
			this.imgDataUrl = imgDataUrl

			var bodyFormData = new FormData()

			bodyFormData.append('image', this.imgDataUrl)

			// axios
			// 	.post('https://api.imgur.com/3/image', bodyFormData, {
			// 		headers: {
			// 			Authorization: 'Client-ID ea3ab9016c11242'
			// 		}
			// 	})
			// 	.then((res) => {
			// 		console.log(res.data)
			// 	})
			// 	.catch((err) => {
			// 		console.log(err.message)
			// 	})
		},
		addName() {
			UserService.addNameImg(this.form.name, this.form.propic).then(
				(response) => {
					this.form.name = response.data.name
					this.form.propic = response.data.image
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
		UserService.getProfile().then(
			(response) => {
				this.content = response.data
				this.form.name = this.content?.user?.fullname
				this.form.propic = this.content?.user?.image
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
.grid {
	display: grid;
	grid-gap: 3em;
	grid-template-columns: repeat(3, 1fr);
	img {
		border-radius: 0.75em;
	}
}

.card {
	padding: 2em;
	border: solid 2px var(--green);
	border-radius: 1em;
}

@media (max-width: 750px) {
	.grid {
		display: grid;
		grid-gap: 3em;
		grid-template-columns: repeat(1, 1fr);
	}
}

.smltitle {
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-weight: 700;
	margin-top: 2em;
}

.label {
	margin: 0;
}

.propic {
	border-radius: 100em;
	width: 7em;
	margin-right: 2em;
	transform: translateY(2.5em);
}

.logout {
	background-color: rgb(212, 77, 77);
	color: #fff;
	&:hover {
		color: #fff;
		background-color: rgb(235, 97, 97);
	}
}

.upload {
	background-color: #cacaca;
	&:hover {
		background-color: #b3b3b3;
	}
}

.name {
	transform: translateY(0.5em);
	font-weight: 700;
	font-size: 3em;
}

.flexdata {
	margin-left: 11em;
	margin-top: 1em;
}

.flex {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.dat {
	margin-right: 2em;
	h5 {
		font-size: 1.25em;
	}
	h3 {
		font-size: 2.5em;
		margin-bottom: -0.25em;
	}
}
button {
	width: 15em;
	margin-left: 3em;
}

.rect {
	background-color: #eaeaea;
	border-radius: 1em;
	padding: 1em 2em 0 2em;
}
</style>
