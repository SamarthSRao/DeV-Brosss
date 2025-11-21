const { authJwt } = require('../middlewares')
const controller = require('../controllers/user.controller')

const express = require('express')
const app = express.Router()

const User = require('../models/user.model')
const Company = require('../models/company.model')
const Thread = require('../models/threads.model')
const Investment = require('../models/investment.model')
// const axios = require('axios') // Removed Setu dependency

// 🚀 Stripe Initialization
// Initialize Stripe with your secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
// Define the base domain without Heroku
const BASE_DOMAIN = process.env.NODE_ENV === 'production' ? 'https://getpayout.co' : 'http://localhost:3000'

app.get('/all', controller.allAccess)

app.post('/notifications', async (req, res) => {
	return res.send(req.body)
})

// ✨ Stripe Checkout Session Endpoint
app.get('/checkout-session', async (req, res) => {
	// Extract query parameters for dynamic information
	const { amt, company, percent, username, userid } = req.query

	// Stripe expects amount in the smallest currency unit (cents/paise).
	// Assuming 'amt' is in INR and converting to paise (multiplying by 100).
	const amountInPaise = parseInt(amt) * 100

	if (isNaN(amountInPaise) || amountInPaise <= 0) {
		return res.status(400).send({ message: "Invalid amount." });
	}

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'inr',
						product_data: {
							name: `Investment in ${company}`,
							description: `Investment amount: ₹${(amountInPaise / 100).toFixed(2)}`,
						},
						unit_amount: amountInPaise,
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			// Success URL redirects user back, passing the session_id to verify the payment.
			success_url: `${BASE_DOMAIN}/api/success/pay?session_id={CHECKOUT_SESSION_ID}&company=${company}&amt=${amt}&percent=${percent}&compuser=${username}&userid=${userid}`,
			cancel_url: `${BASE_DOMAIN}/cancel`,

			// Optional: Pass metadata, useful even without webhooks for logging/verification
			metadata: {
				compusername: username,
				userid: userid,
				amount: amt,
				companyname: company,
				percent: percent
			}
		});

		// Redirect the user to the Stripe Checkout page
		return res.redirect(303, session.url);

	} catch (error) {
		console.error('Stripe Checkout Error:', error);
		return res.status(500).send({ message: 'Error creating checkout session', error: error.message });
	}
})

// ✨ Reinstated /success/pay Endpoint (Handles DB updates via browser redirect)
app.get('/success/pay', async (req, res) => {
	const { session_id, company, amt, percent, compuser, userid } = req.query;

	// ⚠️ CRITICAL NOTE: This endpoint is less secure. We fetch the session
	// to verify payment status, but database operations triggered by a browser 
	// redirect can fail or be manually manipulated.

	try {
		// 1. Fetch the session to verify payment
		const session = await stripe.checkout.sessions.retrieve(session_id);

		if (session.payment_status !== 'paid') {
			console.log('Payment not yet paid or failed for session:', session_id);
			// Redirect to a failure page if payment isn't marked as paid
			return res.redirect(`${BASE_DOMAIN}/payment-failed`);
		}

		// 2. Prepare investment data (using query params)
		var investData = {
			compusername: compuser,
			userid: userid,
			amount: amt,
			percentage: percent,
			companyname: company
		}

		// 3. Create Investment Log
		Investment.create(investData, (error, log) => {
			if (error) {
				console.error("Investment log error:", error);
				// Log and continue, but this needs manual review if it fails
			}
			console.log("Investment logged successfully.");
		})

		// 4. Update Company Investment Status
		Company.findOne({
			username: compuser
		}).exec((err, comp) => {
			if (err) {
				console.error("Company update error:", err);
				// Still redirecting to success, as payment was confirmed by Stripe.
			}

			if (comp) {
				comp.investment.current = `${parseFloat(comp.investment.current || 0) + parseFloat(amt)}`
				comp.save()
				console.log('Updated current company investment value')
			}

			// 5. Redirect to the final success page on the frontend
			return res.redirect(
				`${BASE_DOMAIN}/success?company=${company}&amt=${amt}&percent=${percent}&compuser=${compuser}`
			)
		})

	} catch (error) {
		console.error('Stripe Session Retrieve Error:', error);
		// Fallback redirect if the Stripe API call fails
		return res.status(500).send({ message: 'Error verifying payment', error: error.message });
	}
})

// --- REST OF THE ROUTES (UNCHANGED) ---

app.get('/discover', [authJwt.verifyToken], (req, res) => {
	Company.find({
		firstEditComplete: true
	}).exec((err, companies) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}
		return res.send(companies)
	})
})

app.get('/user', [authJwt.verifyToken], (req, res) => {
	User.findById(req.userId, { password: 0 }).exec((err, user) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		Company.find({ creatorID: req.userId }).exec((err, companies) => {
			if (err) {
				console.log(err)
				return res.status(500).send({ message: 'ERROR' })
			}

			Investment.find({ userid: req.userId }).exec((err, investments) => {
				if (err) {
					console.log(err)
					return res.status(500).send({ message: 'ERROR' })
				}

				var compids = []
				var totalsum = 0

				investments.forEach((i) => {
					totalsum = totalsum + parseFloat(i.amount)
					compids.push(i.compusername)
				})

				Company.find({ username: { $in: compids } }, { password: 0 }).exec(
					(err, compdata) => {
						if (err) {
							console.log(err)
							return res.status(500).send({ message: 'ERROR' })
						}

						return res.send({
							user,
							companies,
							investments,
							compids: compdata,
							totalinv: totalsum
						})
					}
				)
			})
		})
	})
})

// create company
app.post('/createcomp', [authJwt.verifyToken], (req, res) => {
	var compData = {
		name: req.body.name,
		username: req.body.name.split(' ').join('').toLowerCase(),
		tagline: req.body.tagline,
		icon: req.body.icon,
		creatorID: req.userId
	}

	Company.create(compData, (error, log) => {
		if (error) {
			console.log('Error creating company:', error)
			return res.status(500).send({ message: 'Error creating company', error })
		}
		console.log('company created')
		return res.send({ compData })
	})
})

// edit company
app.post('/editcomp', [authJwt.verifyToken], (req, res) => {
	Company.findOne({ username: req.body.username }).exec((err, company) => {
		if (err) {
			return res.status(400).send('ERROR')
		}

		company.name = req.body.name
		company.tagline = req.body.tagline
		company.icon = req.body.icon
		company.website = req.body.website
		company.location = req.body.location
		company.employees = req.body.employees
		company.compcreated = req.body.compcreated
		company.jobopening = req.body.jobopening
		company.joblink = req.body.joblink
		company.investment.goal = req.body.investment.goal
		company.investment.percentage = req.body.investment.percentage
		company.pitchdeck = req.body.deck
		company.video = req.body.video
		company.images = req.body.images
		company.description = req.body.description

		company.firstEditComplete = true
		company.save()

		return res.send('done')
	})
})

app.post('/editcompname', [authJwt.verifyToken], (req, res) => {
	Company.findOne({ username: req.body.username }).exec((err, company) => {
		if (err) {
			return res.status(400).send('ERROR')
		}

		company.name = req.body.name
		company.tagline = req.body.tagline
		company.save()

		return res.send('done')
	})
})

//add name and img to user

app.post('/addnameimg', [authJwt.verifyToken], (req, res) => {
	User.findOne({ _id: req.userId }).exec((err, user) => {
		if (err) {
			return res.status(400).send('ERROR')
		}

		user.fullname = req.body.name
		user.image = req.body.image
		user.save()

		return res.send({ name: req.body.name, image: req.body.image })
	})
})

//get company information
app.get('/comp/:compname', [authJwt.verifyToken], (req, res) => {
	const companyname = req.params.compname
	Company.findOne({ username: companyname }).exec((err, company) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		// Check if company exists
		if (!company) {
			console.log(`Company not found: ${companyname}`)
			return res.status(404).send({ message: 'Company not found' })
		}

		var isOwned = false
		if (company?.creatorID == req.userId) {
			isOwned = true
		}

		Thread.findOne({
			$and: [
				{ $or: [{ p1: req.userId }, { p2: req.userId }] },
				{ $or: [{ p1: company.creatorID }, { p2: company.creatorID }] }
			]
		}).exec((err, thread) => {
			if (err) {
				console.log(err)
				return res.status(500).send({ message: 'ERROR' })
			}

			User.findOne({ _id: company.creatorID }, { password: 0, roles: 0 }).exec(
				(err, userdata) => {
					if (err) {
						console.log(err)
						return res.status(500).send({ message: 'ERROR' })
					}

					Investment.findOne(
						{ compusername: companyname, userid: req.userId },
						{ password: 0, roles: 0 }
					).exec((err, investdata) => {
						if (err) {
							console.log(err)
							return res.status(500).send({ message: 'ERROR' })
						}

						var invested
						if (investdata) {
							invested = investdata
						} else {
							invested = false
						}

						if (thread) {
							return res.send({
								company,
								isOwned,
								owner: userdata,
								threadStarted: true,
								threadID: thread._id,
								invested
							})
						} else {
							return res.send({
								company,
								isOwned,
								owner: userdata,
								threadStarted: false,
								invested
							})
						}
					})
				}
			)
		})
	})
})

//get user information
app.get('/user/:userid', [authJwt.verifyToken], (req, res) => {
	const userid = req.params.userid
	User.findOne({ _id: userid }, { password: 0 }).exec((err, userdata) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		return res.send({ userdata })
	})
})

//get all users
app.get('/users', [authJwt.verifyToken], (req, res) => {
	User.find(
		{},
		{ password: 0, roles: 0, salt: 0, hash: 0, createdAt: 0, updatedAt: 0 }
	).exec((err, userdata) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		return res.send({ users: userdata })
	})
})

//start a texting thread
app.post('/create/thread', [authJwt.verifyToken], (req, res) => {
	var threadData = {
		p1: req.userId,
		p2: req.body.p2,
		p1seen: true,
		p2seen: false,
		messages: [
			{
				content: req.body.content,
				from: req.userId,
				date: req.body.date
			}
		],
		lastMessage: req.body.date
	}

	Thread.create(threadData, (error, log) => {
		if (error) {
			console.log(error)
			return res.status(400).send({ error })
		}
		console.log('company created')
		return res.send('text thread created')
	})
})

//send a message (in existing thread)
app.post('/sendmsg', [authJwt.verifyToken], (req, res) => {
	msgdata = {
		content: req.body.content,
		from: req.userId,
		date: req.body.date
	}

	Thread.findOne({ _id: req.body.threadid }).exec((err, threaddata) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		if (threaddata) {
			threaddata.messages.push(msgdata)
			threaddata.lastMessage = req.body.date
			if (req.userId == threaddata.p1) {
				threaddata.p1seen = true
				threaddata.p2seen = false
			} else {
				threaddata.p2seen = true
				threaddata.p1seen = false
			}
			threaddata.save()

			var newthread = JSON.parse(JSON.stringify(threaddata))
			newthread.p1 = undefined
			newthread.p2 = undefined
			newthread.p1seen = undefined
			newthread.p2seen = undefined

			var otherid
			if (req.userId == threaddata.p1) {
				otherid = threaddata.p2
			} else {
				otherid = threaddata.p1
			}

			User.findById(otherid, { password: 0, roles: 0 }).exec((err, user) => {
				if (err) {
					console.log(err)
					return res.status(500).send({ message: 'ERROR' })
				}

				newthread.otheruser = user

				if (user) {
					return res.send({
						msg: 'set seen indication',
						thread: newthread
					})
				} else {
					return res.status(403).send({ error: true, msg: 'nahi h thread' })
				}
			})

			// return res.send({ thread: threaddata })
		} else {
			return res.status(403).send('error')
		}
	})
})

//set seen indication
app.post('/set/seen', [authJwt.verifyToken], (req, res) => {
	Thread.findOne({ _id: req.body.threadid }).exec((err, threaddata) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		if (threaddata) {
			var prsn
			if (req.userId == threaddata.p1) {
				threaddata.p1seen = true
				prsn = 'p1'
			} else {
				threaddata.p2seen = true
				prsn = 'p2'
			}
			threaddata.save()

			var newthread = JSON.parse(JSON.stringify(threaddata))
			newthread.p1 = undefined
			newthread.p2 = undefined
			newthread.p1seen = undefined
			newthread.p2seen = undefined

			var otherid
			if (prsn == 'p1') {
				otherid = threaddata.p2
			} else {
				otherid = threaddata.p1
			}

			User.findById(otherid, { password: 0, roles: 0 }).exec((err, user) => {
				if (err) {
					console.log(err)
					return res.status(500).send({ message: 'ERROR' })
				}

				newthread.otheruser = user

				if (user) {
					return res.send({
						msg: 'set seen indication',
						thread: newthread,
						prsn
					})
				} else {
					return res.status(403).send({ error: true, msg: 'nahi h thread' })
				}
			})
		} else {
			return res.status(403).send({ error: true, msg: 'nahi h thread' })
		}
	})
})

//get all threads
app.get('/threads', [authJwt.verifyToken], (req, res) => {
	Thread.find({ $or: [{ p1: req.userId }, { p2: req.userId }] }).exec(
		(err, threads) => {
			if (err) {
				console.log(err)
				return res.status(500).send({ message: 'ERROR' })
			}

			var users = []
			var newthreads = JSON.parse(JSON.stringify(threads))

			newthreads.forEach((t, index) => {
				if (t.p1 == req.userId) {
					users.push(t.p2)
				} else {
					users.push(t.p1)
				}
			})
			// newthreads[0].hello = 'yo'
			// console.log(newthreads[0])

			var userarray = []

			// users.forEach((u, index) => {
			User.find({ _id: { $in: users } }, { password: 0 }).exec(
				(err, userbro) => {
					if (err) {
						console.log(err)
						return res.status(500).send({ message: 'ERROR' })
					}

					// var revthread =
					return res.send({
						threads: newthreads.reverse(),
						users: userbro.reverse()
					})
				}
			)
			// })
		}
	)
})

//get specific thread
app.get('/threads/:threadid', [authJwt.verifyToken], (req, res) => {
	Thread.findOne({ _id: req.params.threadid }).exec((err, threads) => {
		if (err) {
			console.log(err)
			return res.status(500).send({ message: 'ERROR' })
		}

		return res.send({ threads })
	})
})

module.exports = app