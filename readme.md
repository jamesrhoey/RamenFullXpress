# RamenXpress - Restaurant Management System

A thorough restaurant management system with point-of-sale work, mobile ordering skills, and stock keeping. Truly, this system gives all the needed tools for today's restaurant work.

## This work lives on my machine. If it not lives on thine, thou shalt fix it thyself.

## 🍜 Features

| Part | Work | What it does |
|------|------|-------------|
| **Backend** | User Check | JWT-based user checking (admin/cashier roles) |
| | Food List Work | CRUD work for food items with pictures |
| | Stock System | Stock watching and food stuff management |
| | Sales Watch | Order work and sales number watching |
| | Mobile Orders | Real-time order work |
| | Payment Work | Many payment ways (Cash, GCash, Maya) |
| **Frontend** | POS System | Point of sale with cart work |
| | Number Board | Sales number watching and telling |
| | Stock Work | Stock watching screen |
| | Mobile Order Screen | Customer-facing order system |
| **Mobile App** | Customer App | Mobile ordering with real-time updates |
| | Order Watch | Live order standing updates |
| | Payment Ways | Many payment choices |
| | Account Work | Customer account work |

## 🚀 Quick Start

### Backend Setup
Mayhap you'll need to set up the backend first:
```bash
cd backend
npm install
npm start
```

### Frontend Setup
Next, you might want to set up the frontend:
```bash
cd frontend
# Open index.html in browser or use live server
```

### Mobile App Setup
Last, if you need the mobile app:
```bash
cd ramenmobileapp
flutter pub get
flutter run
```

## 📁 Project Structure

```
ramenmobileapp/
├── backend/           # Node.js API server
├── frontend/          # Web interface (POS, Dashboard)
└── ramenmobileapp/   # Flutter mobile app
```

## 🔧 Environment Variables

Create `.env` in the backend directory:
```
JWT_SECRET=your_secret_key
MONGODB_URI=your_mongodb_connection
PORT=3000
```

## 📱 Key Features

Truly, the system has many good things:

| Feature | Description |
|---------|-------------|
| **Real-time Order Work** | Live order updates |
| **Multi-role User Check** | Admin and cashier access levels |
| **Picture Work** | Food item picture uploads |
| **Stock Work** | Self-acting stock taking away |
| **Good Design** | Works on desktop and mobile |
| **Payment Work** | Many payment way support |

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Node.js, Express, MongoDB, JWT |
| **Frontend** | HTML5, CSS3, JavaScript, Bootstrap 5 |
| **Mobile** | Flutter, Dart |
| **Database** | MongoDB |
| **Authentication** | JWT Tokens |

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | User authentication |
| `GET` | `/api/v1/menu` | Menu items |
| `POST` | `/api/v1/sales/new-sale` | Process orders |
| `GET` | `/api/v1/inventory` | Inventory management |
| `POST` | `/api/v1/mobile-orders` | Mobile order processing |

## 🎯 Usage

The system may be used as follows:

| Step | Role | Action |
|------|------|--------|
| 1 | **Admin Setup** | Make admin account and add food items |
| 2 | **POS Work** | Cashiers can work on orders and payments |
| 3 | **Mobile Orders** | Customers can put orders through mobile app |
| 4 | **Stock Work** | Watch stock levels and food stuff |
| 5 | **Sales Watch** | Watch sales work and trends |

---

**Built with ❤️ for modern restaurant management**
