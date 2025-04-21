"use client";
import { motion } from "framer-motion";
import { LogIn } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa";
import { useLoading } from "../contexts/UnifiedContext";
import { GlassmorphismButton, LevitatingNeonButton } from "../ui/pentama-button";
import { PentamaLogoWithParticles } from "../ui/pentama-logo";


export default function Landing() {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleNavigate = (path: string) => {
    startLoading();
    router.push(path);
  };
  return (
    <div className="min-h-screen bg-linear-to-br/oklch from-black to-purple-950 text-white overflow-hidden">
      {/* Header Sticky */}
      <header className="fixed w-full top-0 z-30  backdrop-brightness-100 border-b border-white/10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center">
            <PentamaLogoWithParticles />
            {/* Hanya tombol login */}
            <GlassmorphismButton
              icon={<LogIn size={20} />}
              onClick={() => handleNavigate("/login")}
            >
              Login
            </GlassmorphismButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8">

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Kelola Tugas Akhir dengan Mudah
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl mb-8 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Platform untuk mahasiswa dan dosen dalam mengelola proses tugas akhir dari awal hingga akhir dengan lancar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <LevitatingNeonButton onClick={() => handleNavigate("/register")}>Daftar Sekarang</LevitatingNeonButton>
            </motion.div>
          </div>

          {/* Gambar animasi dengan framer-motion */}
          <div className="md:w-1/2 mt-12 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Ilustrasi utama */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Image
                  src="/assets/img/student.png"
                  alt="PENTAMA Preview"
                  className="rounded-lg shadow-2xl"
                  width={800}
                  height={800}
                />
              </motion.div>

              {/* Elemen dekoratif yang bergerak */}
              <motion.div
                className="absolute -right-12 -bottom-8 w-24 h-24 rounded-full bg-purple-400/30 backdrop-blur-md"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              />

              <motion.div
                className="absolute -left-8 top-10 w-16 h-16 rounded-full bg-indigo-300/40 backdrop-blur-md"
                animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Fitur Unggulan
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Manajemen Dokumen",
              description: "Upload, revisi, dan kelola semua dokumen tugas akhir dalam satu platform.",
              icon: "📄",
            },
            {
              title: "Penjadwalan Konsultasi",
              description: "Atur jadwal konsultasi dengan dosen pembimbing dengan mudah.",
              icon: "🗓️",
            },
            {
              title: "Tracking Progress",
              description: "Pantau kemajuan tugas akhir dari awal hingga sidang akhir.",
              icon: "📊",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)" }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Apa Kata Mereka
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              quote: "PENTAMA membantu saya menyelesaikan skripsi tepat waktu dengan pengelolaan yang lebih terstruktur.",
              name: "Budi Santoso",
              role: "Mahasiswa Teknik Informatika",
            },
            {
              quote: "Sebagai dosen pembimbing, platform ini memudahkan saya mengatur jadwal dan memberikan feedback untuk mahasiswa.",
              name: "Dr. Siti Rahayu",
              role: "Dosen Fakultas Ekonomi",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 * index }}
            >
              <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-white/70 text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <FaGraduationCap className="text-xl" />
              <span className="text-lg font-bold">PENTAMA</span>
            </div>

            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} PENTAMA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};