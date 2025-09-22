// Export all schemas organized by entity

// Enums (global)
export * from './enums'

// Users schemas
export * as Users from './users'

// Companies schemas  
export * as Companies from './companies'

// Subscriptions/Stripe schemas
export * as Subscriptions from './subscriptions'

// Authentication schemas
export * as Auth from './auth'

// Students schemas
export * as Students from './students'

// Courses schemas
export * as Courses from './courses'

// Materials schemas
export * as Materials from './materials'

// Dashboard schemas
export * as Dashboard from './dashboard'

// Legacy imports (to be removed after migration)
// Note: These will be deprecated once all imports are updated
export * from './env'