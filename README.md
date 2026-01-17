# IIUC Lost & Found

Welcome to the IIUC Lost & Found platform! This web application helps students and staff at IIUC report, find, and claim lost items on campus, making it easier to reconnect people with their belongings.

---

## 🚀 Features

- **Report Lost Items:** Easily submit details and photos of lost items.
- **Find Items:** Browse and search for items found on campus.
- **Claim Process:** Securely claim items with verification steps.
- **User Profiles:** Manage your reports and claims in your personal dashboard.
- **Authentication:** Sign up and log in securely.
- **Image Uploads:** Upload images for better identification.
- **Responsive Design:** Works smoothly on mobile and desktop.

---

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Firebase (for authentication)
- Tailwind CSS
- React Router

**Backend:**
- Node.js (Express)
- Prisma ORM
- PostgreSQL (or your configured database)
- Cloudinary (for image uploads)


---

## ⚡ Getting Started

### Prerequisites
- Node.js & npm
- PostgreSQL (or your preferred database)

### Setup

1. **Clone the repository:**
	```bash
	git clone https://github.com/yourusername/iiuc-lost-found.git
	cd iiuc-lost-found
	```
2. **Install dependencies:**
	```bash
	cd client && npm install
	cd ../server && npm install
	```
3. **Configure environment variables:**
	- Create a `.env` file in `server/` and add your `DATABASE_URL` and Cloudinary credentials.
	- Set up Firebase config in `client/src/firebase.js`.
4. **Run database migrations:**
	```bash
	npx prisma migrate deploy
	```
5. **Start the backend server:**
	```bash
	npm start
	```
6. **Start the frontend app:**
	```bash
	cd ../client
	npm run dev
	```

---

## 📝 Usage

1. Register or log in.
2. Report a lost item or browse found items.
3. Claim items by following the verification process.
4. Manage your reports and claims in your profile.

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

