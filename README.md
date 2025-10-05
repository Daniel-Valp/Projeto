# 🧠 ULSVDL FORMAÇÕES
🎓 **This project was developed as the final project of my degree in software engineer (Grade - 19/20 )**

A full-stack web application built with **React + TypeScript + Node.js + Express + PostgreSQL** that allows users to create and manage courses, chapters, videos, manuals, and interactive quizzes.

Report included in pt-pt
----------------------------------

## 🚀 Main Features

- 👨‍🏫 **Course Management** — create, edit, and view courses organized by sections and chapters.  
- 📚 **Dynamic Chapters** — each chapter can include existing videos, manuals, or quizzes from the platform.  
- 🎥 **Video Management** — integrate YouTube videos or upload local files.  
- 📘 **Manual Management** — upload PDF documents and cover images.  
- ❓ **Quiz Management** — create quizzes with multiple questions and performance statistics.  
- 👤 **User System** — role-based access for teachers and students.  
- 💎 **Modern & Responsive UI** — built with Tailwind CSS and shadcn/ui for a clean, professional design.

----------------------------------


## 🛠️ Tech Stack

### 🔹 Frontend
- React + TypeScript  
- Redux Toolkit (global state management)  
- React Hook Form + Zod (form validation)  
- Tailwind CSS + shadcn/ui (UI components)

### 🔹 Backend
- Node.js + Express  
- PostgreSQL + Sequelize ORM  
- Multer (file uploads)  
- JWT (secure authentication)


----------------------------------


## ⚙️ Getting Started

# Backend Dependencies
npm install


# Configure the Database

Create a .env file inside the Server/ directory:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASS=your_password
PORT=5000

# Then run migrations:

npx sequelize-cli db:migrate

## 🗄️ Database Design

The platform uses **PostgreSQL** with Sequelize ORM for relational data management. (use your own)

## 🔐 Authentication (Clerk)

This project integrates **Clerk** for authentication and user management. (use your own)


----------------------------------

  Start the Backend
cd .\Server\
npm run dev

  Start the Frontend
cd cliente
npm run dev

go to http://localhost:3000/

----------------------------------



## Pictures

<img width="1918" height="977" alt="pic" src="https://github.com/user-attachments/assets/a4cd9f6f-6217-4c96-97d3-4f56c95050ed" />


<img width="856" height="434" alt="image" src="https://github.com/user-attachments/assets/cc0ed8a1-064a-461a-bf02-bd13752fecf6" />


<img width="627" height="736" alt="image" src="https://github.com/user-attachments/assets/5b41c628-7a4f-45a5-a4ac-c545efb296be" />


<img width="856" height="435" alt="image" src="https://github.com/user-attachments/assets/903b45ba-4bb5-47f2-870e-2183bd3b6dbc" />

