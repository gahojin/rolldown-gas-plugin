const { defineConfig } = require('npm-check-updates')

module.exports = defineConfig({
  target: (name) => {
    if (name === '@types/node' || name === 'vitest' || name.startsWith('@vitest/')) {
      return 'minor'
    }
    return 'newest'
  },
  cooldown: 7,
})
