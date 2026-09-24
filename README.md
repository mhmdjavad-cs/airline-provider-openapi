# ✈️ Airlines Open API

یک REST API برای مدیریت سیستم فروش بلیط هواپیما، با قابلیت مدیریت پروازها، هواپیماها، فرودگاه‌ها، فروشندگان بلیط، کیف پول و خرید و لغو بلیط.

---

## 🛠️ تکنولوژی‌ها

* **NestJS** — Backend Framework
* **TypeScript** — Programming Language
* **SQLite** — Database
* **Drizzle ORM** — Database ORM
* **better-sqlite3** — SQLite Driver
* **Swagger / OpenAPI** — API Documentation
* **Cookie-based Sessions** — Authentication

---

# 🚀 نصب و اجرای پروژه

## 1. دریافت پروژه

ابتدا repository را clone کنید:

```bash
git clone <REPOSITORY_URL>
cd airlines-open-api
```

## 2. نصب Dependencyها

```bash
npm install
```

## 3. ساخت Database

پروژه از SQLite استفاده می‌کند و فایل دیتابیس به صورت زیر ساخته می‌شود:

```text
airlines.db
```

برای ایجاد و اجرای migrationها:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

> در صورتی که migrationها از قبل در repository موجود باشند، معمولاً اجرای `migrate` کافی است.

## 4. اجرای پروژه

برای اجرای پروژه در محیط development:

```bash
npm run start:dev
```

پس از اجرا، API روی آدرس زیر در دسترس خواهد بود:

```text
http://localhost:3000
```

---

# 📚 مستندات API

مستندات کامل API با Swagger در دسترس است:

```text
http://localhost:3000/docs
```

در Swagger می‌توانید تمام endpointها، requestها و responseهای API را مشاهده و تست کنید.

---

# 🔐 احراز هویت

سیستم احراز هویت پروژه بر اساس **Session** و Cookie پیاده‌سازی شده است.

پس از Login، یک Cookie با نام:

```text
sessionId
```

برای کاربر ایجاد می‌شود.

دو نوع کاربر در سیستم وجود دارد:

* **Admin**
* **Ticket Seller**

دسترسی‌های این دو نوع کاربر توسط Guardهای مربوطه کنترل می‌شود.

---

# 🔄 گردش کار سیستم

## 1. ایجاد Admin

ابتدا یک حساب Admin ایجاد می‌شود:

```text
POST /admin
```

پس از ایجاد Admin، یک Session برای او ایجاد می‌شود.

---

## 2. ورود به سیستم

کاربر با استفاده از:

```text
POST /auth/login
```

و ارسال username و password وارد سیستم می‌شود.

در صورت موفقیت، یک `sessionId` در Cookie قرار می‌گیرد.

از این Session برای احراز هویت درخواست‌های بعدی استفاده می‌شود.

---

# 👨‍💼 گردش کار Admin

ادمین مسئول مدیریت اطلاعات اصلی سیستم است.

### مدیریت فرودگاه‌ها

ادمین می‌تواند:

* فرودگاه ایجاد کند
* لیست فرودگاه‌ها را مشاهده کند
* اطلاعات فرودگاه را مشاهده کند
* فرودگاه را ویرایش کند
* فرودگاه را حذف کند

---

### مدیریت هواپیماها

ادمین می‌تواند هواپیما ایجاد کند.

هنگام ایجاد هواپیما، بر اساس ظرفیت آن، Seatهای هواپیما به صورت خودکار ساخته می‌شوند.

برای مثال:

```text
Capacity = 180
        ↓
180 Seats
```

ظرفیت هواپیما پس از ایجاد قابل تغییر نیست تا تعداد Seatها با اطلاعات هواپیما ناسازگار نشود.

---

### مدیریت پروازها

ادمین  می‌تواند پرواز ایجاد و مدیریت کند.

هر پرواز شامل مواردی مانند:

* شماره پرواز
* فرودگاه مبدا
* فرودگاه مقصد
* هواپیما
* قیمت
* زمان حرکت
* زمان رسیدن
* وضعیت پرواز

است.

قیمت در سطح **Flight** تعریف می‌شود و تمام Seatهای آن پرواز همان قیمت را دارند.

---

### مدیریت Ticket Sellerها

ادمین می‌تواند فروشندگان بلیط را ایجاد و مدیریت کند.

هر Ticket Seller هنگام ایجاد، یک Wallet نیز دریافت می‌کند.

---

### مدیریت کیف پول فروشندگان

ادمین می‌تواند برای Ticket Sellerها موجودی اضافه کند.

برای مثال:

```text
Deposit: $5,000
        ↓
Seller Wallet
        ↓
Balance: $5,000
```

هر تغییر موجودی در `WalletTransaction` ثبت می‌شود.

---

# 🧑‍💼 گردش کار Ticket Seller

یک Ticket Seller مسئول فروش بلیط به مسافران است.

## 1. مشاهده پروازها

فروشنده می‌تواند پروازهای موجود را مشاهده و جستجو کند:

```text
GET /sellers/flights
```

---

## 2. مشاهده صندلی‌های پرواز

پس از انتخاب یک پرواز:

```text
GET /sellers/flights/:id/seats
```

لیست Seatها و وضعیت availability نمایش داده می‌شود.

مثلاً:

```json
[
  {
    "id": 25,
    "number": "25",
    "price": 15000,
    "available": true
  }
]
```

---

## 3. خرید بلیت

فروشنده اطلاعات مسافر و Seat انتخاب‌شده را ارسال می‌کند:

```text
POST /sellers/tickets
```

در زمان خرید:

```text
Flight Price
     ↓
Check Seat
     ↓
Check Seller Wallet
     ↓
Create Ticket
     ↓
Deduct Wallet Balance
     ↓
Create Wallet Transaction
```

قیمت از خود Flight گرفته می‌شود و فروشنده نمی‌تواند قیمت بلیط را در request تغییر دهد.

---

## 4. مشاهده بلیت‌ها

فروشنده می‌تواند بلیط‌های خودش را مشاهده کند:

```text
GET /sellers/tickets
```

همچنین می‌تواند جزئیات یک بلیط خاص را مشاهده کند:

```text
GET /sellers/tickets/:id
```

فروشنده فقط به بلیط‌های متعلق به خودش دسترسی دارد.

---

## 5. لغو بلیت

برای لغو بلیط:

```text
POST /sellers/tickets/:id/cancel
```

در این حالت:

```text
Ticket → CANCELLED
       ↓
Refund
       ↓
Seller Wallet
       ↓
REFUND Transaction
```

بلیط حذف نمی‌شود و برای حفظ تاریخچه در Database باقی می‌ماند.

---

# 💰 Wallet و تراکنش‌ها

موجودی Wallet به صورت **integer cents** ذخیره می‌شود.

مثلاً:

```text
15000 = $150.00
50000 = $500.00
```

این روش از مشکلات مربوط به ذخیره مستقیم مقادیر اعشاری پول جلوگیری می‌کند.

هر تغییر موجودی شامل اطلاعات زیر در `WalletTransaction` ثبت می‌شود:

* نوع تراکنش
* مبلغ
* موجودی قبل
* موجودی بعد
* Ticket مرتبط
* توضیحات
* زمان تراکنش

انواع تراکنش:

```text
DEPOSIT
TICKET_PURCHASE
REFUND
```

---

# 📡 API Endpoints

## 🔐 Authentication

| Method | Endpoint       | توضیح                       |
| ------ | -------------- | --------------------------- |
| `POST` | `/auth/login`  |TicketSeller یا Admin ورود |
| `POST` | `/auth/logout` | Session خروج و حذف          |
| `GET`  | `/auth/me`     | دریافت اطلاعات کاربر فعلی   |

---

# 👨‍💼 Admin

## مدیریت Admin

| Method | Endpoint | توضیح       |
| ------ | -------- | ----------- |
| `POST` | `/admin` |admin ایجاد |

---

## فرودگاه‌ها

| Method   | Endpoint              | توضیح                  |
| -------- | --------------------- | ---------------------- |
| `POST`   | `/admin/airports`     | ایجاد فرودگاه          |
| `GET`    | `/admin/airports`     | دریافت تمام فرودگاه‌ها |
| `GET`    | `/admin/airports/:id` | دریافت یک فرودگاه      |
| `PATCH`  | `/admin/airports/:id` | ویرایش فرودگاه         |
| `DELETE` | `/admin/airports/:id` | حذف فرودگاه            |

---

## هواپیماها

| Method   | Endpoint                       | توضیح                 |
| -------- | ------------------------------ | --------------------- |
| `POST`   | `/admin/airplanes`             | ایجاد هواپیما         |
| `GET`    | `/admin/airplanes`             | دریافت تمام هواپیماها |
| `GET`    | `/admin/airplanes/:id`         | دریافت یک هواپیما     |
| `PATCH`  | `/admin/airplanes/:id`         | ویرایش هواپیما        |
| `DELETE` | `/admin/airplanes/:id`         | حذف هواپیما           |
| `GET`    | `/admin/airplanes/:id/flights` | پروازهای یک هواپیما   |

---

## پروازها

| Method   | Endpoint                     | توضیح                        |
| -------- | ---------------------------- | ---------------------------- |
| `POST`   | `/admin/flights`             | ایجاد پرواز                  |
| `GET`    | `/admin/flights`             | دریافت تمام پروازها          |
| `GET`    | `/admin/flights/:id`         | دریافت یک پرواز              |
| `PATCH`  | `/admin/flights/:id`         | ویرایش پرواز                 |
| `DELETE` | `/admin/flights/:id`         | حذف پرواز                    |
| `GET`    | `/admin/flights/:id/seats`   | مشاهده Seatها و availability |
| `GET`    | `/admin/flights/:id/tickets` | های پرواز Ticket مشاهده‌ی تمام  |

---

## هاTicket Seller

| Method   | Endpoint                    | توضیح                 |
| -------- | --------------------------- | --------------------- |
| `POST`   | `/admin/ticket-sellers`     | ایجاد فروشنده         |
| `GET`    | `/admin/ticket-sellers`     | دریافت تمام فروشندگان |
| `GET`    | `/admin/ticket-sellers/:id` | دریافت یک فروشنده     |
| `PATCH`  | `/admin/ticket-sellers/:id` | ویرایش فروشنده        |
| `DELETE` | `/admin/ticket-sellers/:id` | حذف فروشنده           |

---

## Wallet فروشندگان — Admin

| Method | Endpoint                                        | توضیح                 |
| ------ | ----------------------------------------------- | --------------------- |
| `GET`  | `/admin/ticket-sellers/:id/wallet`              | فروشنده Wallet مشاهده |
| `POST` | `/admin/ticket-sellers/:id/wallet/deposit`      | افزایش موجودی         |
| `GET`  | `/admin/ticket-sellers/:id/wallet/transactions` | مشاهده تراکنش‌ها      |

---

# 🧑‍💼 Seller API

## پروازها

| Method | Endpoint                     | توضیح                        |
| ------ | ---------------------------- | ---------------------------- |
| `GET`  | `/sellers/flights`           | جستجو و مشاهده پروازها       |
| `GET`  | `/sellers/flights/:id`       | مشاهده جزئیات پرواز          |
| `GET`  | `/sellers/flights/:id/seats` | availability ها و Seat مشاهده |

---

## بلیت‌ها

| Method | Endpoint                      | توضیح                    |
| ------ | ----------------------------- | ------------------------ |
| `POST` | `/sellers/tickets`            | خرید بلیط                |
| `GET`  | `/sellers/tickets`            | مشاهده بلیط‌های فروشنده  |
| `GET`  | `/sellers/tickets/:id`        | مشاهده جزئیات یک بلیط    |
| `POST` | `/sellers/tickets/:id/cancel` | Refund لغو بلیط و دریافت |

---

## Wallet

| Method | Endpoint                       | توضیح                    |
| ------ | ------------------------------ | ------------------------ |
| `GET`  | `/sellers/wallet`              | Wallet مشاهده‌ی موجودی     |
| `GET`  | `/sellers/wallet/transactions` | مشاهده تاریخچه تراکنش‌ها |

---

# 🗄️ ساختار کلی سیستم

```text
                    ┌──────────────┐
                    │    Admin     │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
     Airports          Airplanes         Sellers
          │                │                │
          │                ↓                ↓
          │              Seats            Wallet
          │                │                │
          └────────────┐   │                │
                       ↓   ↓                ↓
                       Flights ←─────── Tickets
                           │                │
                           └──────┬─────────┘
                                  ↓
                         Wallet Transactions
```

---

# 📌 نکات مهم

* تمام endpointهای Admin با `AdminGuard` محافظت می‌شوند.
* تمام endpointهای Seller با `TicketSellerGuard` محافظت می‌شوند.
* Session از طریق `sessionId` Cookie مدیریت می‌شود.
* هر Ticket به یک Seller مشخص تعلق دارد.
* Seller فقط می‌تواند Ticketهای خودش را مشاهده یا لغو کند.
* قیمت Ticket از قیمت Flight گرفته می‌شود.
* قیمت Ticket پس از خرید داخل Ticket ذخیره می‌شود تا قیمت تاریخی خرید حفظ شود.
* Seatهای یک هواپیما هنگام ایجاد هواپیما به صورت خودکار ساخته می‌شوند.
* Ticketهای لغوشده حذف نمی‌شوند و برای حفظ تاریخچه باقی می‌مانند.
* عملیات خرید و Refund به همراه تغییر موجودی Wallet در Transaction انجام می‌شوند.

---

# 📖 API Documentation

برای مشاهده و تست APIها از Swagger استفاده کنید:

```text
http://localhost:3000/docs
```

---

## 👨‍💻 Project
این پروژه با هدف یادگیری و تمرین **NestJS** و آشنایی عملی با مفاهیمی مانند طراحی REST API، احراز هویت، مدیریت Database و Session توسعه داده شده است.

