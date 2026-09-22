# Airline Provider API — Endpoint Map

## `/auth`

Authentication and session management.

```text
POST /auth/login
POST /auth/logout
GET  /auth/me
POST /auth/change-password
```

---

# `/admin`

Admin management API.
Admins can manage the airline's resources and ticket sellers.

## Airports

```text
POST   /admin/airports
GET    /admin/airports
GET    /admin/airports/:id
PATCH  /admin/airports/:id
DELETE /admin/airports/:id
```

## Airplanes

```text
POST   /admin/airplanes
GET    /admin/airplanes
GET    /admin/airplanes/:id
PATCH  /admin/airplanes/:id
DELETE /admin/airplanes/:id
GET    /admin/airplanes/:id/flights
```

> Seats are automatically generated when an airplane is created.

## Flights

```text
POST   /admin/flights
GET    /admin/flights
GET    /admin/flights/:id
PATCH  /admin/flights/:id
DELETE /admin/flights/:id
GET    /admin/flights/:id/seats
GET    /admin/flights/:id/tickets
```

* `/admin/flights/:id/seats` shows all seats and their current availability.
* `/admin/flights/:id/tickets` shows all tickets, including cancelled tickets.

## Ticket Sellers

```text
POST   /admin/ticket-sellers
GET    /admin/ticket-sellers
GET    /admin/ticket-sellers/:id
PATCH  /admin/ticket-sellers/:id
DELETE /admin/ticket-sellers/:id
```

## Seller Wallet Management

```text
GET  /admin/ticket-sellers/:id/wallet
POST /admin/ticket-sellers/:id/wallet/deposit
GET  /admin/ticket-sellers/:id/wallet/transactions
```

---

# `/sellers`

API specifically designed for ticket sellers.

## Flight Browsing

```text
GET /sellers/flights
GET /sellers/flights/:id
GET /sellers/flights/:id/seats
```

`GET /sellers/flights` supports searching and filtering.

Example:

```text
GET /sellers/flights?from=IKA&to=IST&date=2026-10-01
```

`GET /sellers/flights/:id/seats` shows only seats that are currently available for purchase.

## Tickets

```text
POST /sellers/tickets
GET  /sellers/tickets
GET  /sellers/tickets/:id
POST /sellers/tickets/:id/cancel
```

A seller can only access their own tickets.

## Wallet

```text
GET /sellers/wallet
GET /sellers/wallet/transactions
```

---

# Complete API Structure

```text
/api
│
├── /auth
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /me
│   └── POST   /change-password
│
├── /admin
│   │
│   ├── /airports
│   │   ├── POST
│   │   ├── GET
│   │   ├── GET    /:id
│   │   ├── PATCH  /:id
│   │   └── DELETE /:id
│   │
│   ├── /airplanes
│   │   ├── POST
│   │   ├── GET
│   │   ├── GET    /:id
│   │   ├── PATCH  /:id
│   │   ├── DELETE /:id
│   │   └── GET    /:id/flights
│   │
│   ├── /flights
│   │   ├── POST
│   │   ├── GET
│   │   ├── GET    /:id
│   │   ├── PATCH  /:id
│   │   ├── DELETE /:id
│   │   ├── GET    /:id/seats
│   │   └── GET    /:id/tickets
│   │
│   ├── /ticket-sellers
│   │   ├── POST
│   │   ├── GET
│   │   ├── GET    /:id
│   │   ├── PATCH  /:id
│   │   └── DELETE /:id
│   │
│   └── /ticket-sellers/:id/wallet
│       ├── GET
│       ├── POST   /deposit
│       └── GET    /transactions
│
└── /sellers
    │
    ├── /flights
    │   ├── GET
    │   ├── GET    /:id
    │   └── GET    /:id/seats
    │
    ├── /tickets
    │   ├── POST
    │   ├── GET
    │   ├── GET    /:id
    │   └── POST   /:id/cancel
    │
    └── /wallet
        ├── GET
        └── GET    /transactions
```
