ang port ay 3000
mongodb://localhost:27017/ramenxpressApp

# API Endpoints

## Register
POST http://localhost:3000/api/v1/auth/register
Body (JSON):
{
  "username": "adminuser",
  "password": "securepassword",
  "role": "admin" // or "cashier"
}

## Login
POST http://localhost:3000/api/v1/auth/login
Body (JSON):
{
  "username": "adminuser",
  "password": "securepassword"
}



