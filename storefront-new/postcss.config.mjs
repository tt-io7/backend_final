export default {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {
      // Add specific browser prefixes for better Chrome compatibility
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'Chrome >= 80',
        'Firefox >= 78',
        'Safari >= 13',
        'iOS >= 13',
        'not dead'
      ],
      // Enable all vendor prefixes for maximum compatibility
      grid: true,
      flexbox: true
    },
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
        'nesting-rules': true
      }
    },
    // Add additional PostCSS plugins if needed
    ...(process.env.NODE_ENV === 'production' ? { cssnano: { preset: 'default' } } : {})
  },
}
