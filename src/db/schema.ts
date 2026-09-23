
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const admins = sqliteTable('admins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id').notNull(),
  userType: text('user_type').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const ticketSellers = sqliteTable('ticket_sellers', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  name: text('name').notNull(),

  username: text('username').notNull().unique(),

  email: text('email').notNull().unique(),

  passwordHash: text('password_hash').notNull(),

  status: text('status').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const wallets = sqliteTable("wallets", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  ticketSellerId: integer("ticket_seller_id")
    .notNull()
    .unique()
    .references(() => ticketSellers.id),

  balance: integer("balance").notNull().default(0),

  status: text("status").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const walletTransactions = sqliteTable('wallet_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  walletId: integer('wallet_id')
    .notNull()
    .references(() => wallets.id),

  type: text('type').notNull(),

  amount: integer('amount').notNull(),

  balanceBefore: integer('balance_before').notNull(),

  balanceAfter: integer('balance_after').notNull(),

  ticketId: integer('ticket_id'),

  description: text('description'),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const airports = sqliteTable("airports", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  name: text("name").notNull(),

  code: text("code").notNull().unique(),

  city: text("city").notNull(),

  country: text("country").notNull(),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const airplanes = sqliteTable('airplanes', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  model: text('model').notNull(),

  registrationNumber: text('registration_number').notNull().unique(),

  capacity: integer('capacity').notNull(),

  status: text('status').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const seats = sqliteTable('seats', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  airplaneId: integer('airplane_id')
    .notNull()
    .references(() => airplanes.id),

  number: text('number').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const flights = sqliteTable('flights', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  flightNumber: text('flight_number').notNull().unique(),

  price: integer("price").notNull(),

  departureAirportId: integer('departure_airport_id')
    .notNull()
    .references(() => airports.id),

  arrivalAirportId: integer('arrival_airport_id')
    .notNull()
    .references(() => airports.id),

  airplaneId: integer('airplane_id')
    .notNull()
    .references(() => airplanes.id),

  departureTime: integer('departure_time', { mode: 'timestamp' }).notNull(),

  arrivalTime: integer('arrival_time', { mode: 'timestamp' }).notNull(),

  status: text('status').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const tickets = sqliteTable('tickets', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  flightId: integer('flight_id')
    .notNull()
    .references(() => flights.id),

  seatId: integer('seat_id')
    .notNull()
    .references(() => seats.id),

  ticketSellerId: integer('ticket_seller_id')
    .notNull()
    .references(() => ticketSellers.id),

  passengerName: text('passenger_name').notNull(),

  passengerPassportNumber: text('passenger_passport_number').notNull(),

  price: integer('price').notNull(),

  status: text('status').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),

  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
