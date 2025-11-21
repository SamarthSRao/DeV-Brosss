<template>
	<div>
		<h3 class="zero">Create company</h3>
		<h5>Add your company and quickly start looking for investors</h5>

		<br />

		<div class="row">
			<div class="six columns">
				<form v-if="!content" @submit.prevent="onSubmit">
					<input type="text" placeholder="Company name" v-model="form.name" />
					<br />
					<!-- <input type="text" placeholder="Username" v-model="form.username" />
			<br /> -->
					<input
						type="text"
						placeholder="Tagline"
						required
						v-model="form.tagline"
					/>
					<br />
					<input
						type="text"
						placeholder="Direct link to logo"
						required
						v-model="form.logo"
					/>
					<br />
					<button type="submit">Next</button>
				</form>
			</div>
			<div class="three columns">
				<img
					:src="
						form?.logo
							? form?.logo
							: 'https://storage.needpix.com/rsynced_images/gradient-blue.jpg'
					"
					style="border-radius: 1em"
					alt=""
				/>
			</div>

			<div class="three columns">
				<br />
			</div>
		</div>
		<!-- <div v-if="content">
			{{ content }}
		</div> -->
		<br /><br /><br />
		<br /><br /><br />
		<br />
	</div>
</template>

<script>
import UserService from '../services/user.service'

export default {
	name: 'User',
	data() {
		return {
			form: {
				name: this?.$route?.query?.name || '',
				username: '',
				tagline: '',
				logo: ''
				// jobopen: false
			},
			content: false
		}
	},
	methods: {
		onSubmit() {
			UserService.createCompany(this.form).then(
				(response) => {
					// this.content = response.data
					console.log(response.data)
					this.$router.push(
						`/company/${response?.data?.compData?.username}/edit?firstedit=true`
					)
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
			console.log('submit')
		}
	}
	// mounted() {

	// }
}
</script>

<style scoped>
img {
	width: 100% !important;
}
</style>
