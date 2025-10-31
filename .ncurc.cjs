const { defineConfig } = require('npm-check-updates')

module.exports = defineConfig({
  target: (name) => {
    if (name === '@types/node') {
      return 'minor'
    }
    return 'newest'
  },
  cooldown: 7,
})
