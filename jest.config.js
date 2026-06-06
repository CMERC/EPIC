module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      '<rootDir>/node_modules/jest-transform-stub',
    '^.+\\.(js|jsx)?$': '<rootDir>/node_modules/babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.[jt]s?(x)',
    '<rootDir>/src/**/__tests__/*.[jt]s?(x)'
  ]
}
