<template>
	<div class="row">
		<div class="flex-center">
			<div class="four columns">
				<div style="margin-top: 3.2em" class="card">
					<h3 class="zero">Login</h3>
					<h5 style="font-size: 1.25em">
						Enter your credentials and get going.
					</h5>
					<Form @submit="handleLogin" :validation-schema="schema">
						<label for="username">Username</label>
						<Field
							name="username"
							type="text"
							placeholder="Username"
							class="form-control"
						/>
						<ErrorMessage name="username" class="error-feedback" />

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

						<div class="flex-center">
							<button class="cool" :disabled="loading">
								<span
									v-show="loading"
									class="spinner-border spinner-border-sm"
								></span>
								<span>Login</span>
							</button>
						</div>

						<div class="flex-center" style="margin-top: 1em">
							<a href @click.prevent class="center zero">Forgot password?</a>
						</div>

						<br />

						<div v-if="message" role="alert">
							{{ message }}
						</div>
					</Form>
				</div>
			</div>
			<div class="u-cf"></div>
		</div>
		<br /><br /><br />
	</div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

export default {
	name: 'Login',
	components: {
		Form,
		Field,
		ErrorMessage
	},
	data() {
		const schema = yup.object().shape({
			username: yup.string().required('Username is required!'),
			password: yup.string().required('Password is required!')
		})

		return {
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
	created() {
		if (this.loggedIn) {
			this.$router.push('/profile')
		}
	},
	methods: {
		handleLogin(user) {
			this.loading = true

			this.$store.dispatch('auth/login', user).then(
				() => {
					this.$router.push('/profile')
				},
				(error) => {
					this.loading = false
					this.message =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString()
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
	margin-top: 1.5em !important;
}
</style>
