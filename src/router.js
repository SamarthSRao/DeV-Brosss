import { createWebHistory, createRouter } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
// lazy-loaded
const Profile = () => import('./views/Profile.vue')
const Discover = () => import('./views/discover.vue')
const CreateComp = () => import('./views/CreateComp.vue')
const company = () => import('./views/company.vue')
const editcompany = () => import('./views/editcompany.vue')
const Threads = () => import('./views/threads.vue')
const textchain = () => import('./views/textchain.vue')
const success = () => import('./views/success.vue')
// const BoardAdmin = () => import('./views/BoardAdmin.vue')
// const BoardModerator = () => import('./views/BoardModerator.vue')
// const BoardUser = () => import('./views/BoardUser.vue')

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: { title: 'Home' }
	},
	{
		path: '/home',
		component: Home
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/threads',
		component: Threads
	},
	{
		path: '/register',
		component: Register
	},
	{
		path: '/profile',
		name: 'profile',
		// lazy-loaded
		component: Profile
	},
	// {
	// 	path: '/admin',
	// 	name: 'admin',
	// 	// lazy-loaded
	// 	component: BoardAdmin
	// },
	// {
	// 	path: '/mod',
	// 	name: 'moderator',
	// 	// lazy-loaded
	// 	component: BoardModerator
	// },
	// {
	// 	path: '/user',
	// 	name: 'user',
	// 	// lazy-loaded
	// 	component: BoardUser
	// },
	{
		path: '/discover',
		name: 'discover',
		// lazy-loaded
		component: Discover
	},
	{
		path: '/create/company',
		name: 'createcompany',
		// lazy-loaded
		component: CreateComp
	},
	{
		path: '/company/:companyname',
		name: 'company',
		// lazy-loaded
		component: company
	},
	{
		path: '/company/:companyname/edit',
		name: 'editcompany',
		// lazy-loaded
		component: editcompany
	},
	{
		path: '/threads/:threadid',
		name: 'textchain',
		// lazy-loaded
		component: textchain
	},
	{
		path: '/success',
		name: 'success',
		// lazy-loaded
		component: success
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router
