// This module replaces the real Firebase initialization for the entire suite.
export const db = { collection: jest.fn(), runTransaction: jest.fn() }
export const usersCollection = { doc: jest.fn(), where: jest.fn() }
export const firebase = { auth: jest.fn() }
