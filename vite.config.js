import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Components({
			dts: true,
			include: [/\.vue$/, /\.vue\?vue/, /\.md$/]
		})
	],
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})
