/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        move: {
          '0%, 49.99%': {
            opacity: '0',
            zIndex: '1',
          },
          '50%, 100%': {
            opacity: '1',
            zIndex: '5',
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      animation: {
        move: 'move 0.6s',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    },
    fontFamily: {
      monts: ['Montserrat', 'sans-serif'],
      popps: ['Poppins', 'sans-serif'],
    },
    dropShadow: {
      purple: '0 4px 6px rgba(139, 92, 246, 0.5)', // Menggunakan warna ungu dengan opacity
      'neon-red': [
        '0 0 4px rgba(255, 0, 0, 0.6)', // Shadow merah yang lebih kecil dan lebih terang
        '0 0 8px rgba(255, 0, 0, 0.7)', // Shadow merah yang sedikit lebih besar dan lebih terang
        '0 0 12px rgba(255, 0, 0, 0.8)', // Shadow merah yang lebih besar untuk memberikan efek neon
      ],
      'neon-red-md': [
        '0 0 2px rgba(255, 0, 0, 0.6)', // Shadow merah yang lebih kecil dan lebih terang
        '0 0 4px rgba(255, 0, 0, 0.7)', // Shadow merah yang sedikit lebih besar dan lebih terang
        '0 0 8px rgba(255, 0, 0, 0.8)', // Shadow merah yang lebih besar untuk memberikan efek neon
      ],
      'neon-dark-md': [
        '0 0 2px rgba(0, 0, 0, 0.6)', // Shadow hitam yang lebih kecil dan lebih terang
        '0 0 4px rgba(0, 0, 0, 0.7)', // Shadow hitam yang sedikit lebih besar dan lebih terang
        '0 0 8px rgba(0, 0, 0, 0.8)', // Shadow hitam yang lebih besar untuk memberikan efek neon
      ],
      'neon-indigo-purple': [
        '0 0 4px rgba(102, 126, 234, 0.6)', // Warna indigo, sedikit terang
        '0 0 8px rgba(139, 92, 246, 0.7)', // Warna purple, lebih terang
        '0 0 12px rgba(139, 92, 246, 0.8)', // Shadow lebih besar, memberikan kesan neon
      ],
      'neon-indigo-purple-md': [
        '0 0 2px rgba(102, 126, 234, 0.6)', // Warna indigo, sedikit terang
        '0 0 4px rgba(139, 92, 246, 0.7)', // Warna purple, lebih terang
        '0 0 8px rgba(139, 92, 246, 0.8)', // Shadow lebih besar, memberikan kesan neon
      ],
      'neon-indigo-purple-sm': [
        '0 0 0.5px rgba(102, 126, 234, 0.6)', // Warna indigo, sedikit terang
        '0 0 1.5px rgba(139, 92, 246, 0.7)', // Warna purple, lebih terang
        '0 0 3px rgba(139, 92, 246, 0.8)', // Shadow lebih besar, memberikan kesan neon
      ],
      'neon-indigo-purple-right': [
        '5px 0 1px rgba(102, 126, 234, 0.68)', // Bayangan dengan offset ke kanan (indigo)
        '10px 0 40px rgba(139, 92, 246, 0.9)', // Bayangan lebih terang dengan offset ke kanan (purple)
        '15px 0 100px rgba(139, 92, 246, 1)', // Shadow lebih besar dengan offset lebih jauh
      ],
    },
  },
  plugins: [],
};
