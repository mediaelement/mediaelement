export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: ['last 5 versions', 'ie > 10', 'ios > 7', 'android > 3']
    }),
    ...(process.env.NODE_ENV === 'production' ? [cssnano()] : [])
  ]
};
