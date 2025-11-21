import axios from 'axios'
import authHeader from './auth-header'
import { baseStuff } from '../plugins/base.js'

const API_URL = `${baseStuff?.baseRoute}api/`

class UserService {
	getPublicContent() {
		return axios.get(API_URL + 'all')
	}

	//get profile
	getProfile() {
		return axios.get(API_URL + 'user', { headers: authHeader() })
	}

	//discover page
	getDiscoverPage() {
		return axios.get(API_URL + 'discover', { headers: authHeader() })
	}

	//create company
	createCompany(data) {
		return axios.post(
			API_URL + 'createcomp',
			{
				name: data.name,
				username: data.username,
				tagline: data.tagline,
				icon: data.logo
			},
			{ headers: authHeader() }
		)
	}

	//edit company
	editComp(company, username) {
		return axios.post(
			API_URL + 'editcomp',
			{
				username,
				name: company.compname,
				tagline: company.tagline,
				icon: company.icon,
				website: company.website,
				location: company.location,
				employees: company.employees,
				compcreated: company.date,
				jobopening: company.jobs.open,
				joblink: company.jobs.link,
				investment: {
					goal: company.investment.goal,
					percentage: company.investment.percentage
				},
				deck: company.deck,
				video: company.video,
				images: company.images,
				description: company.additional
			},
			{ headers: authHeader() }
		)
	}

	//add name, img to user
	addNameImg(name, img) {
		return axios.post(
			API_URL + 'addnameimg',
			{
				name,
				image: img
			},
			{ headers: authHeader() }
		)
	}

	// get company info
	getCompanyInfo(username) {
		return axios.get(`${API_URL}comp/${username}`, { headers: authHeader() })
	}

	// get user info
	getUserInfo(userid) {
		return axios.get(`${API_URL}user/${userid}`, { headers: authHeader() })
	}

	// get all threads
	getThreads() {
		return axios.get(`${API_URL}threads`, { headers: authHeader() })
	}

	// get all users
	getAllUsers() {
		return axios.get(`${API_URL}users`, { headers: authHeader() })
	}

	//get specific thread (also sets seen indication)
	getSpecificThread(threadid) {
		return axios.get(`${API_URL}threads/${threadid}`, { headers: authHeader() })
	}

	// set seen indication and get thread
	setSeenandThread(threadid) {
		return axios.post(
			`${API_URL}set/seen`,
			{
				threadid
			},
			{ headers: authHeader() }
		)
	}

	// send a message to existing thread
	sendmsg(threadid, content, date) {
		return axios.post(
			`${API_URL}sendmsg`,
			{
				threadid,
				content,
				date
			},
			{ headers: authHeader() }
		)
	}

	//start a thread
	createThread(data) {
		console.log(data)
		return axios.post(
			API_URL + 'create/thread',
			{
				p2: data.p2,
				content: data.content,
				date: Date.now()
			},
			{ headers: authHeader() }
		)
	}

	getModeratorBoard() {
		return axios.get(API_URL + 'mod', { headers: authHeader() })
	}

	getAdminBoard() {
		return axios.get(API_URL + 'admin', { headers: authHeader() })
	}
}

export default new UserService()
