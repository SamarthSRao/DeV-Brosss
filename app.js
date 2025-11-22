const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()

const allowedOrigins = [
    'http://localhost:8081',
    'http://localhost:3000',
    'https://de-v-brosss-a4cj.vercel.app/',
    'https://de-v-brosss-a4cj.vercel.app/',
    'https://de-v-brosss-a4cj.vercel.app/'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

const db = require('./app/models')
const Role = db.role

db.mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Successfully connect to MongoDB.')
		initial()
	})
	.catch((err) => {
		console.error('Connection error', err)
		process.exit()
	})

app.get('/', (req, res) => {
	res.json({ message: 'API' })
})

// routes
app.use('/api', require('./app/routes/user.routes'))
app.use('/api/auth', require('./app/routes/auth.routes'))

app.get('/*', (req, res) => {
	return res.status(404).send('Page not found')
})

// set port, listen for requests
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}.`)
})

function initial() {
	Role.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			new Role({
				name: 'user'
			}).save((err) => {
				if (err) {
					console.log('error', err)
				}

				console.log("added 'user' to roles collection")
			})

			new Role({
				name: 'moderator'
			}).save((err) => {
				if (err) {
					console.log('error', err)
				}

				console.log("added 'moderator' to roles collection")
			})

			new Role({
				name: 'admin'
			}).save((err) => {
				if (err) {
					console.log('error', err)
				}

				console.log("added 'admin' to roles collection")
			})
		}
	})
}

