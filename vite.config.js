import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, readdirSync } from 'fs';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// Read header for banner injection
const header = readFileSync('./src/js/header.js', 'utf8');

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    // Build configuration
    build: {
      // Output directory
      outDir: 'build',
      
      // Multiple entry points
      rollupOptions: {
        input: {
          'mediaelement': resolve(__dirname, 'src/js/utils/polyfill.js'),
          'mediaelement-and-player': resolve(__dirname, 'src/js/player.js'),
          'renderers/dailymotion': resolve(__dirname, 'src/js/renderers/dailymotion.js'),
          'renderers/facebook': resolve(__dirname, 'src/js/renderers/facebook.js'),
          'renderers/soundcloud': resolve(__dirname, 'src/js/renderers/soundcloud.js'),
          'renderers/twitch': resolve(__dirname, 'src/js/renderers/twitch.js'),
          'renderers/youtube': resolve(__dirname, 'src/js/renderers/youtube.js'),
          'renderers/vimeo': resolve(__dirname, 'src/js/renderers/vimeo.js')
        },
        output: {
          // Remove hash from filenames for consistency with Grunt
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      },
      
      // Generate both unminified and minified versions
      minify: isProduction ? 'terser' : false,
      
      // Source maps for debugging
      sourcemap: !isProduction,
      
      // Target browsers for compatibility
      target: ['es2015', 'chrome61', 'firefox60', 'safari11', 'edge16'],
      
      // Empty outDir before build
      emptyOutDir: true
    },
    
    // Development server configuration
    server: {
      port: 3000,
      open: false
    },
    
    // CSS processing
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['last 5 versions', 'ie > 10', 'ios > 7', 'android > 3']
          }),
          ...(isProduction ? [cssnano()] : [])
        ]
      },
      
      // Process CSS files separately
      modules: false
    },
    
    // Plugin configuration
    plugins: [
      // Custom plugin to handle CSS files like Grunt did
      {
        name: 'css-processing',
        generateBundle(options, bundle) {
          // Handle main CSS files
          const cssFiles = [
            'src/css/mediaelementplayer.css',
            'src/css/mediaelementplayer-legacy.css'
          ];
          
          cssFiles.forEach(cssFile => {
            try {
              const cssContent = readFileSync(cssFile, 'utf8');
              const baseName = cssFile.split('/').pop().replace('.css', '');
              
              // Add processed CSS to bundle
              this.emitFile({
                type: 'asset',
                fileName: `${baseName}.css`,
                source: cssContent
              });
              
              // Add minified version in production
              if (isProduction) {
                this.emitFile({
                  type: 'asset',
                  fileName: `${baseName}.min.css`,
                  source: cssContent // Will be minified by cssnano
                });
              }
            } catch (error) {
              console.warn(`Could not process ${cssFile}:`, error.message);
            }
          });
        }
      },
      
      // Custom plugin to copy static assets
      {
        name: 'copy-assets',
        generateBundle(options, bundle) {
          // Copy images from src/css/
          const imageExtensions = ['png', 'svg', 'gif'];
          imageExtensions.forEach(ext => {
            try {
              const files = readdirSync('src/css');
              files.forEach(file => {
                if (file.endsWith(`.${ext}`)) {
                  const content = readFileSync(`src/css/${file}`, 'utf8');
                  this.emitFile({
                    type: 'asset',
                    fileName: file,
                    source: content
                  });
                }
              });
            } catch (error) {
              console.warn(`Could not copy ${ext} files:`, error.message);
            }
          });
          
          // Copy demo files
          try {
            const demoFiles = readdirSync('demo');
            demoFiles.forEach(file => {
              if (file !== '.' && file !== '..') {
                const content = readFileSync(`demo/${file}`, 'utf8');
                this.emitFile({
                  type: 'asset',
                  fileName: file,
                  source: content
                });
              }
            });
          } catch (error) {
            console.warn('Could not copy demo files:', error.message);
          }
          
          // Copy translation files (except en.js)
          try {
            const langFiles = readdirSync('src/js/languages');
            langFiles.forEach(file => {
              if (file.endsWith('.js') && file !== 'en.js') {
                let content = readFileSync(`src/js/languages/${file}`, 'utf8');
                // Process content like Grunt did
                content = content.replace(/\/\/.*?\.js/gm, '');
                content = content.replace(/\n{2,}/gm, '');
                
                this.emitFile({
                  type: 'asset',
                  fileName: `lang/${file}`,
                  source: content
                });
              }
            });
          } catch (error) {
            console.warn('Could not copy translation files:', error.message);
          }
        }
      },
      
      // Custom plugin to remove console.log statements
      {
        name: 'remove-console-log',
        renderChunk(code, chunk) {
          if (isProduction) {
            // Remove console.log statements but keep other console methods
            return code.replace(/console\.log\([^)]*\);?/g, '');
          }
          return code;
        }
      },
      
      // Custom plugin to add header banner
      {
        name: 'add-header',
        renderChunk(code, chunk) {
          // Add header to JS files (exclude language files and minified versions)
          if (!chunk.fileName.includes('lang/') && !chunk.fileName.includes('.min')) {
            return header + '\n' + code;
          }
          return code;
        }
      }
    ],
    
    // Resolve configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@utils': resolve(__dirname, 'src/js/utils'),
        '@core': resolve(__dirname, 'src/js/core'),
        '@features': resolve(__dirname, 'src/js/features'),
        '@renderers': resolve(__dirname, 'src/js/renderers')
      }
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: ['global', 'svg4everybody']
    }
  };
});
