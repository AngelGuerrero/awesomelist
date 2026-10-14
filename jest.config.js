module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  testMatch: ['<rootDir>/tests/unit/**/*.spec.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup.js'],
  moduleNameMapper: {
    '^@/data/FirebaseConfig$': '<rootDir>/tests/unit/mocks/firebase.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': '<rootDir>/tests/unit/mocks/style.js',
    '\\.(png|jpg|jpeg|svg|mp3)$': '<rootDir>/tests/unit/mocks/asset.js'
  },
  transform: {
    '^.+\\.vue$': '@vue/vue2-jest',
    '^.+\\.js$': 'babel-jest'
  },
  globals: {
    'vue-jest': { pug: { doctype: 'html' } }
  },
  collectCoverageFrom: [
    'src/Views/Access/Shared/EmailForm.vue',
    'src/store/modules/ToDo.js',
    'src/data/ToDoCollections.js',
    'src/components/ToDo/ToDoCollections.vue',
    'src/components/ToDo/ToDoCollectionPicker.vue',
    'src/components/ToDo/ToDoCreate.vue',
    'src/components/ToDo/ToDoConfirmDelete.vue',
    'src/components/ToDo/ToDoMenu.vue',
    'src/components/ToDo/ToDoDetail.vue'
  ],
  coverageDirectory: 'coverage',
  clearMocks: true
}
