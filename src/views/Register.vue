<template>
	<div class="row">
		<div class="flex-center">
			<div class="four columns">
				<div class="card">
					<h3 class="zero">Sign up</h3>
					<h5 style="font-size: 1.25em">
						Create and account and start
						<span class="green">raising money</span> or
						<span class="green">invest</span>.
					</h5>
					<Form @submit="handleRegister" :validation-schema="schema">
						<div v-if="!successful">
							<label for="fullname">Name</label>
							<Field
								name="fullname"
								type="text"
								placeholder="Name"
								class="form-control"
							/>
							<ErrorMessage name="fullname" class="error-feedback" />

							<label for="username">Username</label>
							<Field
								name="username"
								type="text"
								placeholder="Username"
								class="form-control"
							/>
							<ErrorMessage name="username" class="error-feedback" />

							<br />

							<label for="email">Email</label>
							<Field
								name="email"
								type="email"
								placeholder="Email"
								class="form-control"
							/>
							<ErrorMessage name="email" class="error-feedback" />

							<br />

							<label for="password">Password</label>
							<Field
								name="password"
								type="password"
								placeholder="Password"
								class="form-control"
							/>
							<ErrorMessage name="password" class="error-feedback" />

							<br />

							<button class="cool" :disabled="loading">
								<span
									v-show="loading"
									class="spinner-border spinner-border-sm"
								></span>
								Sign Up
							</button>
						</div>
					</Form>

					<div
						v-if="message"
						class="alert"
						:class="successful ? 'alert-success' : 'alert-danger'"
					>
						{{ message }}
					</div>
				</div>
			</div>
			<div class="u-cf" />
		</div>
		<br /><br /><br />
	</div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

export default {
	name: 'Register',
	components: {
		Form,
		Field,
		ErrorMessage
	},
	data() {
		const schema = yup.object().shape({
			username: yup
				.string()
				.required('Username is required!')
				.min(3, 'Must be at least 3 characters!')
				.max(20, 'Must be maximum 20 characters!'),
			fullname: yup
				.string()
				.required('Name is required!')
				.min(3, 'Must be at least 3 characters!'),
			email: yup
				.string()
				.required('Email is required!')
				.email('Email is invalid!')
				.max(50, 'Must be maximum 50 characters!'),
			password: yup
				.string()
				.required('Password is required!')
				.min(6, 'Must be at least 6 characters!')
				.max(40, 'Must be maximum 40 characters!')
		})

		return {
			successful: false,
			loading: false,
			message: '',
			schema
		}
	},
	computed: {
		loggedIn() {
			return this.$store.state.auth.status.loggedIn
		}
	},
	mounted() {
		if (this.loggedIn) {
			this.$router.push('/profile')
		}
	},
	methods: {
		handleRegister(user) {
			this.message = ''
			this.successful = false
			this.loading = true

			this.$store.dispatch('auth/register', user).then(
				(data) => {
					this.message = data.message
					this.successful = true
					this.loading = false
				},
				(error) => {
					this.message =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString()
					this.successful = false
					this.loading = false
				}
			)
		}
	}
}
</script>

<style scoped>
.error-feedback {
	color: red;
}

.card {
	border: 2px solid rgba(34, 34, 34, 0.192);
	padding: 3em 2em 0 2em;
	border-radius: 0.75em;
}

button {
	width: 100%;
	color: #fff !important;
}
</style>
