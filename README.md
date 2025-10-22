# User Management API 
Proyek ini merupakan RESTful API menggunakan Express.js dan PostgreSQL untuk mengelola data pengguna.  
API ini dilengkapi dengan fitur autentikasi JWT, keamanan server (CORS + Helmet), serta upload avatar ke Cloudinary.

# Fitur Utama 
| Fitur | Deskripsi |
|-------|------------|
| Autentikasi | Register dan Login dengan enkripsi password (bcrypt) serta token JWT |
| CRUD User | Akses data user menggunakan token JWT (Protected Route) |
| Upload Avatar | Upload foto profil ke Cloudinary, simpan URL ke database |
| Keamanan | Gunakan Helmet & CORS untuk keamanan server |
| Struktur Modular | File dipisahkan berdasarkan fungsi (config, routes, controller, model, middleware) |

# Struktur Folder
```
user_management_api/
│
├── index.js
├── .env
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   └── models/
│       └── userModels.js

````

# Instalasi & Menjalankan Server
## 1. Clone Repository
```bash
git clone <URL_REPOSITORI_KAMU>
cd user_management_api
````
## 2. Instal Library
Pastikan semua dependensi dari `package.json` telah terinstal:
```json
"dependencies": {
  "bcryptjs": "^3.0.2",
  "cloudinary": "^2.7.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "helmet": "^8.1.0",
  "jsonwebtoken": "^9.0.2",
  "multer": "^2.0.2",
  "pg": "^8.16.3",
  "streamifier": "^0.1.1"
},
"devDependencies": {
  "nodemon": "^3.1.10"
}
```

## 3. Jalankan perintah:
```bash
npm install
```

## 4. Konfigurasi File `.env`
Buat file `.env` di root project dan isi seperti berikut:
```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/user
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret
```

# Pembuatan Database PostgreSQL
  Jalankan perintah berikut di **psql** atau terminal database kamu:
    
    ```sql
    CREATE DATABASE user;
    
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      avatar_url TEXT
    );
    
    ALTER TABLE users
    ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    ```

# Endpoint API
  ## AUTH ROUTES (`/api/auth`)
    | Method | Endpoint             | Deskripsi                       |
    | ------ | -------------------- | ------------------------------- |
    | POST   | `/api/auth/register` | Mendaftarkan user baru          |
    | POST   | `/api/auth/login`    | Login dan mendapatkan token JWT |
  
  ## USER ROUTES (`/api/users`)
    Semua endpoint berikut memerlukan **Authorization: Bearer Token**
    | Method | Endpoint            | Deskripsi                        |
    | ------ | ------------------- | -------------------------------- |
    | GET    | `/api/users`        | Menampilkan semua user           |
    | PUT    | `/api/users/update` | Update data profil user          |
    | POST   | `/api/users/avatar` | Upload foto profil ke Cloudinary |
  
  # Pengujian API (Postman)
    Berikut endpoint yang diuji di Postman (Collection: **USER API**):
    | Method   | Endpoint         | Keterangan                            |
    | -------- | ---------------- | ------------------------------------- |
    | **POST** | `/auth/register` | Register user baru                    |
    | **POST** | `/auth/login`    | Login dan dapatkan token JWT          |
    | **GET**  | `/users`         | Tampilkan seluruh user (dengan token) |
    | **POST** | `/users/avatar`  | Upload foto profil ke Cloudinary      |
    | **PUT**  | `/users/update`  | Update profil user                    |
  
   a. Langkah Pengujian:
   
     1. Buka Postman → Buat Collection baru: `USER API`
     2. Tambahkan seluruh endpoint di atas.
     3. Pada endpoint yang butuh token, tambahkan header:
        ```
        Authorization: Bearer <token_dari_login>
        ```
      4. Simpan Collection → klik kanan → *Publish Documentation*
         Salin URL hasil publish dan masukkan ke README:
         [Lihat Dokumentasi Postman di Sini] : (https://documenter.getpostman.com/view/49159863/2sB3QQK8AC)

##  Teknologi yang Digunakan
    Node.js + Express.js,
    PostgreSQL (pg),
    Cloudinary (upload avatar),
    JWT (jsonwebtoken),
    bcryptjs (hash password),
    Helmet + CORS (keamanan),
    Multer + Streamifier (upload handler),
    Nodemon (development mode).
