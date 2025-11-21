# 👤 Login Credentials

These credentials work for **BOTH Web App and Mobile App**.

---

## 🔐 Admin

**Email:** `admin@example.com`  
**Password:** `admin123`

**Access:**
- Manage users (customers, providers)
- Create/edit categories and services
- View all bookings
- Track job statuses

---

## 👤 Customer

### Primary Customer
**Email:** `kamal@example.com`  
**Password:** `customer123`

### Other Customers
- **Email:** `nimal@example.com` / **Password:** `customer123`
- **Email:** `sunil@example.com` / **Password:** `customer123`

**Access:**
- Browse services by category
- Create bookings with map location picker
- Track booking status
- View booking history

---

## 🚚 Provider/Driver

### Primary Provider
**Email:** `ravi@example.com`  
**Password:** `provider123`

### Other Providers
- **Email:** `dilshan@example.com` / **Password:** `provider123`
- **Email:** `chaminda@example.com` / **Password:** `provider123`

**Access:**
- View pending jobs
- Accept/reject jobs
- Update job status (On the way → Started → Completed)
- See nearby parcels on same route
- Navigate to locations
- Upload job images

---

## 📝 Notes

- These credentials are created when you run `npm run seed` in the backend directory
- If you haven't seeded the database, only the admin account exists:
  - **Admin:** `admin@example.com` / `admin123`
- You can also register new users through the registration page
- All passwords are the same for each role for easy testing

---

## 🚀 Quick Access

**Web App:** http://localhost:3000  
**Mobile App:** Scan QR code with Expo Go

Both use the same backend and same credentials!

