# Music Music App Backend

The **Music App Backend** is the server-side application that powers the **Meshay Studio** platform. It provides APIs for user authentication, music data management, real-time messaging, and more. This backend is built with **Node.js**, **Express.js**, **TypeScript**, and **Prisma**, and leverages tools like **Supabase**, **Redis**, and **PostgreSQL** for robust performance and scalability.

---

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT.
- **Music Management**: Manage artists, albums, playlists, and songs.
- **Real-Time Messaging**: Built with Redis and WebSockets.
- **File Uploads**: Music and image uploads handled via Supabase.
- **Database**: PostgreSQL with Prisma ORM for robust queries.
- **Error Handling**: Centralized and consistent error responses.

---

## 🛠 Technology Stack

| Component             | Technology        |
| --------------------- | ----------------- |
| **Backend Framework** | Node.js + Express |
| **Language**          | TypeScript        |
| **Database**          | PostgreSQL        |
| **Storage**           | Supabase          |
| **Real-Time**         | Redis, WebSockets |
| **ORM**               | Prisma            |
| **Authentication**    | JWT + bcrypt      |
| **Environment**       | dotenv            |

---

## 🔧 Prerequisites

Make sure you have the following installed:

- **Node.js**: v18+
- **PostgreSQL**: v13+
- **Redis**: v6+

---

## ⚡ Installation Quick Start

1. **🌟 Clone the Repository**

   ```bash
   git clone https://github.com/Shazzy911/Meshay-music-backend.git
   cd music-app-backend
   ```

1. **🌟 Install Dependencies**

   - npm install

1. **🌟 Set Up Environment Variables**

   Create a .env file in the project root and configure the following variables

   - DATABASE_URL=your_postgres_connection_string
   - SUPABASE_URL=your_supabase_project_url
   - SUPABASE_KEY=your_supabase_api_key
   - JWT_SECRET=your_jwt_secret

1. **🌟 Run Migrations**

   - npx prisma migrate dev

1. **🌟 Start the Server**

   - Development mode

     npm run dev

   - Production build

     npm run build
     npm start

## 📋 API Overview

| Endpoint               | Method | Description                    |
| ---------------------- | ------ | ------------------------------ |
| **/api/auth/register** | POST   | Register a new user            |
| **/api/auth/login**    | POST   | User login with JWT            |
| **/api/artists**       | GET    | Fetch all artists              |
| **/api/playlists**     | POST   | Create a new playlist          |
| **/api/songs/:id**     | GET    | Get details of a specific song |
| **/api/albums/:id**    | GET    | Get album details              |

---

## 📦 Folder Structure

    ```
        src/
        ├── controllers/ # Request handlers
        ├── middleware/ # Custom middleware
        ├── models/ # Prisma models
        ├── routes/ # API routes
        ├── utils/ # Utility functions
        ├── index.ts # Entry point
    ```

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

- Fork the repository.
- Create a feature branch: git checkout -b feature-name.
- Commit your changes: git commit -m "Add feature description".
- Push to your branch: git push origin feature-name.
- Submit a pull request.

## 🙌 Acknowledgments

- [**Shahzaib Saleem**] - Developer and maintainer of the Music App Backend.
- Thanks to Node.js, Express.js, Prisma, Supabase, Redis, and PostgreSQL for providing the essential tools to build a scalable and robust backend.
- A special thanks to the open-source community for all the resources and contributions that made this project possible.

## 📝 MIT License

Copyright (c) 2024 Meshay Music App

- Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
