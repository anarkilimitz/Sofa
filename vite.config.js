import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
	// Указываем корень проекта, если нужно (по умолчанию текущая директория)
	root: './',

	plugins: [
		viteImagemin({
			mozjpeg: { quality: 78 },
			pngquant: { quality: [0.7, 0.85], speed: 4 },
			svgo: {
				plugins: [
					{ name: 'removeViewBox', active: false },
					{ name: 'cleanupIDs', active: false },
				],
			},
			webp: { quality: 78 },
		}),
	],

	build: {
		outDir: 'dist',
		emptyOutDir: true, // очистка dist перед сборкой
		rollupOptions: {
			input: {
				main: 'index.html',
			},
			output: {
				// Настройка имен файлов для порядка в dist
				assetFileNames: (assetInfo) => {
					let extType = assetInfo.name.split('.').at(1);
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
						extType = 'img';
					} else if (/woff|woff2/.test(extType)) {
						extType = 'fonts';
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
	},
	// Настройки сервера для удобства
	server: {
		port: 3000,
		open: true,
	},
});
