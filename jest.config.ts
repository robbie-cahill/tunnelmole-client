export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)"
  ]  
};