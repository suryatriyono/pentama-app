# Pentama App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Aplikasi Penilaian Tugas Akhir Mahasiswa.

## Deskripsi

Pentama App adalah aplikasi web yang dirancang untuk memudahkan proses penilaian tugas akhir mahasiswa. Aplikasi ini memiliki fitur-fitur seperti:

*   Autentikasi pengguna (admin, dosen, mahasiswa)
*   _Role-based access control_
*   Penilaian tugas akhir
*   ...

## Teknologi yang Digunakan

*   Frontend: React, Redux Toolkit, React Router
*   Backend: Node.js, Express.js, MongoDB
*   ...

## Instalasi

1.  Clone _repository_ ini: `git clone <URL_REPOSITORY>`
2.  Install _dependency frontend_: `cd frontend && npm install @reduxjs/toolkit axios classnames jwt-decode react react-dom react-redux react-router-dom react-scripts sweetalert2`
3.  Install _dependency backend_: `cd backend && npm install bcryptjs cookie-parser cors dotenv express express-rate-limit express-validator jsonwebtoken mongoose multer sharp`
4.  Konfigurasi environment variables:
    *   Buat file `.env` di _root directory_  _backend_
    *   Isi dengan variabel-variabel yang dibutuhkan (misalnya,  `MONGODB_URI`,  `JWT_SECRET`, dan sebagainya)
5.  Jalankan aplikasi:
    *   Frontend: `npm start`
    *   Backend: `npm start`

## Kontribusi

_Pull request_  sangat diterima. Untuk perubahan besar, silakan buka  _issue_  terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

## Lisensi

Proyek ini dilisensikan di bawah  [MIT License](https://opensource.org/licenses/MIT).
