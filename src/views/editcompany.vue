<template>
	<div>
		<div class="row">
			<div class="three columns">
				<img
					v-if="form?.icon"
					:src="form.icon"
					class="icon"
					:alt="`₹{form.compname} Icon`"
				/>
				<img
					v-else
					src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
					alt=""
					style="border: solid 2px var(--green); border-radius: 1em"
				/>
			</div>
			<div class="nine columns">
				<h5 class="label">Company name</h5>
				<input
					class="biginput"
					type="text"
					v-model="form.compname"
					placeholder="Company name"
				/>

				<br />

				<h5 class="label tag">Tagline</h5>
				<input
					type="text"
					class="smlinput"
					placeholder="Tagline"
					v-model="form.tagline"
				/>

				<button
					v-if="
						form.compname !== content?.company?.name ||
						form.tagline !== content?.company?.tagline
					"
					style="margin-top: 1em"
					class="cool"
					@click.prevent="
						() => {
							content.company.name = form.compname
							content.company.tagline = form.tagline
							postCompData()
						}
					"
				>
					Save changes
				</button>
			</div>
		</div>

		<br />

		<div class="row">
			<div class="eight columns">
				<div class="tabs">
					<div class="tablist">
						<a
							@click.prevent="() => (tabsIndex = 1)"
							:class="[tabsIndex == 1 ? 'selected tab' : 'tab']"
							href
							>Overview</a
						>

						<a
							@click.prevent="() => (tabsIndex = 2)"
							:class="[tabsIndex == 2 ? 'selected tab' : 'tab']"
							href
							>Investment</a
						>

						<a
							@click.prevent="() => (tabsIndex = 3)"
							:class="[tabsIndex == 3 ? 'selected tab' : 'tab']"
							href
							>Presentation</a
						>

						<!-- <a
							@click.prevent="() => (tabsIndex = 4)"
							:class="[tabsIndex == 4 ? 'selected tab' : 'tab']"
							href
							>FAQs</a
						> -->
					</div>
					<div class="panels">
						<div v-if="tabsIndex == 1">
							<h6 class="label">Company website</h6>
							<input
								type="text"
								v-model="form.website"
								placeholder="https://website.com"
							/>
							<br />

							<h6 class="label">Company logo</h6>
							<input
								type="text"
								v-model="form.icon"
								placeholder="Link to logo"
							/>
							<br />

							<h6 class="label">How many employees do you have?</h6>
							<input type="number" v-model="form.employees" placeholder="50" />
							<br />

							<h6 class="label">Where is your company based?</h6>
							<input
								type="text"
								v-model="form.location"
								placeholder="City, Country"
							/>
							<br />

							<h6 class="label">When was the company created?</h6>
							<input type="text" v-model="form.date" placeholder="DD/MM/YYYY" />
							<br />

							<div class="flex">
								<input
									type="checkbox"
									id="jobopen"
									name="jobopen"
									value="true"
									v-model="form.jobs.open"
								/>
								{{ form.jobs.open }}
								<label for="jobopen">Have any job openings?</label>
							</div>
							<div v-if="form.jobs.open">
								<h6 class="label">Link to recruitments webpage</h6>
								<input
									type="text"
									v-model="form.jobs.link"
									placeholder="Website"
								/>
							</div>

							<button
								class="cool"
								@click="
									() => {
										tabsIndex = 2
										postCompData()
									}
								"
								style="float: right"
							>
								Save
							</button>
						</div>

						<div v-if="tabsIndex == 2">
							<h6 style="font-size: 1.15em" class="label">
								What percentage of your company do you want to put up?
							</h6>
							<div
								style="
									display: flex;
									justify-content: flex-start;
									align-items: center;
								"
							>
								<input
									type="number"
									v-model="form.investment.percentage"
									placeholder="00"
									class="dollar"
									style="width: 1.25em; margin-right: 0.15em"
									min="00"
									max="99"
								/>
								<h3 style="font-size: 1.65em; margin: 0">%</h3>
							</div>
							<br />

							<h6 style="font-size: 1.15em" class="label">
								Link to your pitch deck
							</h6>
							<input type="text" v-model="form.deck" placeholder="Pitch deck" />
							<br />
							<!-- {{ '10000000'.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} -->

							<button
								class="cool"
								@click="
									() => {
										tabsIndex = 3
										postCompData()
									}
								"
								style="float: right"
							>
								Save
							</button>
						</div>

						<div v-if="tabsIndex == 3">
							<h5 class="biglabel">YouTube video</h5>
							<input
								type="text"
								placeholder="YouTube link"
								v-model="form.video"
							/>

							<section id="images">
								<h5 class="biglabel">Images</h5>
								<div v-if="form.images.length == 0">
									<input
										type="text"
										placeholder="Image link"
										v-model="form.img.one"
									/>
									<div
										style="
											display: flex;
											justify-content: space-between;
											align-items: center;
										"
									>
										<a href @click.prevent>&nbsp;</a>
										<a
											href
											style="color: green"
											@click.prevent="
												() => {
													if (form.img.one.length > 0) {
														form.images.push(form.img.one)
														form.img.one = ''
													}
												}
											"
											>+ add image</a
										>
									</div>
								</div>
								<div v-if="form.images.length > 0">
									<div v-for="img in form.images" :key="img">
										<input
											type="text"
											placeholder="Image link"
											:value="img"
											disabled
										/>
										<!-- {{ img }} -->
									</div>
									<input
										type="text"
										placeholder="Image link"
										v-model="currentimg"
									/>
									<div
										style="
											display: flex;
											justify-content: space-between;
											align-items: center;
										"
									>
										<a
											href
											style="color: red"
											@click.prevent="
												() => {
													form.images.pop()
												}
											"
											>- remove image</a
										>
										<a
											href
											style="color: green"
											@click.prevent="
												() => {
													if (currentimg.length > 0) {
														form.images.push(currentimg)
														currentimg = ''
													}
												}
											"
											>+ add image</a
										>
									</div>
								</div>
							</section>
							<br />
							<section id="text">
								<h5 class="zero">Additional info (Markdown supported)</h5>
								<textarea
									style="min-width: 100%; max-width: 100%; min-height: 7em"
									v-model="form.additional"
									placeholder="Anything else you wanna tell investors?"
								></textarea>
							</section>

							<!-- tabsIndex = 1 -->
							<button
								class="cool"
								@click="
									() => {
										$router.push(`/company/${this.content?.company?.username}`)
										postCompData()
									}
								"
								style="float: right"
							>
								Save
							</button>
						</div>

						<!-- faqs tab -->
						<!-- <div v-if="tabsIndex == 4">
							Content 4
							<button
								class="cool"
								@click="() => (tabsIndex = 1)"
								style="float: right"
							>
								Save
							</button>
						</div> -->
					</div>
				</div>
				<!-- <Carousel :items-to-show="1" :wrap-around="true">
					<Slide v-for="slide in 4" :key="slide">
						<div class="carousel__item">
							<img
								src="https://res.cloudinary.com/arhaanb/image/upload/delhidesignfoundry.png"
								alt=""
							/>
						</div>
					</Slide>

					<template #addons>
						<Navigation />
						<Pagination />
					</template>
				</Carousel> -->
			</div>
			<div class="four columns">
				<div class="card">
					<div v-if="content.isOwned">
						<h5 class="zero" style="margin-bottom: 0.5em">Invite investors</h5>
						<div>
							<div class="row">
								<div class="six columns">
									<input type="text" v-model="invite.name" placeholder="Name" />
								</div>
								<div class="six columns">
									<input
										type="email"
										v-model="invite.email"
										placeholder="Email"
									/>
								</div>
							</div>
						</div>
						<p v-if="invite.success" class="green" style="margin-bottom: 0.5em">
							Invited successfully!
						</p>
						<button
							class="link"
							@click="
								() => {
									if (invite.name.length > 0 && invite.email.length > 0) {
										invite.name = ''
										invite.email = ''
										invite.success = true
									}
								}
							"
						>
							Invite
						</button>

						<!-- <div v-if="invest.open">
							<div v-if="allusers?.users?.length > 0">
								<div v-for="user in allusers.users" :key="user.username">
									invite {{ user.fullname ? user.fullname : user.username }} to
									invest
								</div>
							</div>
						</div> -->
					</div>
					<!-- <h5 class="zero">Owner</h5>
					<p>{{ content?.owner }}</p> -->
				</div>

				<!-- <div v-if="content?.company?.jobopening">
					<div class="job">
						<h5 class="zero">{{ content?.company?.name }} is hiring!</h5>
					</div>
				</div> -->
			</div>
		</div>

		<br /><br /><br />
	</div>
</template>

<script>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import UserService from '../services/user.service'

import { defineComponent } from 'vue'
import { Carousel, Navigation, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
	name: 'User',
	components: {
		Carousel,
		Slide,
		Pagination,
		Navigation,
		TabGroup,
		TabList,
		Tab,
		TabPanels,
		TabPanel
	},

	data() {
		return {
			tabsIndex: 1,
			invite: {
				name: '',
				email: ''
			},
			content: '',
			user: false,
			msg: {
				open: false,
				msg: ''
			},
			invest: {
				open: false
			},
			allusers: false,
			form: {
				website: '',
				additional: '',
				employees: '',
				deck: '',
				jobs: {
					open: '',
					link: ''
				},
				compname: '',
				tagline: '',
				icon: '',
				location: '',
				date: '',
				video: '',
				images: [],
				currentimg: '',
				img: {
					one: ''
				},
				investment: {
					goal: '',
					percentage: ''
				}
			}
		}
	},
	methods: {
		sendmsg() {
			UserService.createThread({
				content: this.msg.msg,
				p2: this.content.company.creatorID
			}).then(
				(response) => {
					// this.content = response.data
					this.$router.push('/threads')
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
			console.log(this.msg.msg)
		},

		postCompData() {
			UserService.editComp(this.form, this.content.company.username).then(
				(response) => {
					// this.content = response.data
					console.log(response.data)
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
		UserService.getCompanyInfo(this.$route.params.companyname).then(
			(response) => {
				this.content = response.data
				if (!this.content.isOwned) {
					this.$router.push('/discover')
				}

				//setting data
				this.form.compname = this.content.company.name
				this.form.tagline = this.content.company.tagline
				this.form.icon = this.content.company.icon
				this.form.employees = this.content.company.employees
				this.form.website = this.content.company.website
				this.form.location = this.content.company.location
				this.form.date = this.content.company.compcreated
				this.form.jobs.open = this.content.company.jobsopening
				this.form.jobs.link = this.content.company.joblink
				this.form.investment.goal = this.content.company.investment.goal
				this.form.investment.percentage =
					this.content.company.investment.percentage
				this.form.deck = this.content.company.pitchdeck
				this.form.video = this.content.company.video
				this.form.images = this.content.company.images
				this.form.additional = this.content.company.description
			},
			(error) => {
				this.$router.push('/discover')
				this.content =
					(error.response &&
						error.response.data &&
						error.response.data.message) ||
					error.message ||
					error.toString()
			}
		)

		UserService.getAllUsers().then(
			(response) => {
				this.allusers = response.data
			},
			(error) => {
				this.allusers =
					(error.response &&
						error.response.data &&
						error.response.data.message) ||
					error.message ||
					error.toString()
			}
		)
	}
})
</script>

<style scoped lang="scss">
.tabs {
	button {
		background-color: var(--green);
	}
	.tab {
		font-size: 1.35em;
		border-bottom: solid 2px transparent;
		&:hover {
			color: var(--green);
		}
		margin-right: 2.5em;
	}
	.selected {
		color: var(--green);
		border-bottom: solid 2px var(--green);
	}
	.tablist {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 2em;
	}
	.biglabel {
		font-size: 1.5em;
		margin-bottom: 0.25em;
	}
	.flex {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-top: 0.25em;
		input {
			width: auto;
			margin-right: 0.6em;
		}
		label {
			margin-top: -0.25em;
		}
	}
	input.dollar {
		font-size: 2em;
		border: none;
		padding: 0;
		margin: 0;
	}
}

img {
	width: 100%;
	border-radius: 0.5em;
}

.label {
	margin: 0;
}

h5.label {
	font-size: 1em;
}

.biginput {
	border: none;
	padding: 0.5em 0;
	font-size: 2em;
	&:focus {
		border: none;
	}
}

.label.tag {
	margin-bottom: -0.25em;
}

.smlinput {
	border: none;
	padding: 0;
	font-size: 1.35em;
	&:focus {
		border: none;
	}
}
</style>
