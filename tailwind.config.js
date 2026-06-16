/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        g: {
          // Background — warm cream (single source of cream)
          bg: '#F4F1EC',

          // Card surfaces — explicitly different from bg
          card: '#FFFFFF',           // white card (pops from cream bg)
          'card-sage': '#E8F0E8',    // visibly sage green
          'card-blush':'#FDF1ED',    // visibly blush pink
          'card-sky':  '#EDF3F9',    // visibly sky blue
          'card-warm': '#FDF7EF',    // visibly warm cream

          // Dark surfaces
          'bg-dark': '#1A1D1A',
          'card-dark': '#222522',
          'card-sage-dark':'#1B221D',
          'card-blush-dark':'#241F1D',
          'card-sky-dark':'#1B2025',
          'card-warm-dark':'#23211C',

          // Shadows
          shadow: '#D9D4CC',
          'shadow-dark': '#0F110F',

          // Text
          text: '#3D3A35',
          'text-sub': '#8A8580',
          'text-dark': '#D8D6D2',
          'text-dark-sub': '#9A9894',

          // Accent colors (for icons, highlights, borders)
          sage:  '#8FA88F',   // moss/sage green
          blush: '#E2B8AC',  // peach blush
          sky:   '#95AEC0',  // soft blue-gray
          warm:  '#CCB890',  // warm gold
          rose:  '#D4A89A',  // muted terracotta
        },
      },
      fontFamily: {
        title: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '28px', lg: '34px',
        btn: '20px', input: '18px', tag: '14px',
      },
      boxShadow: {
        // Soft drop shadows (not neumorphic — more practical)
        'card': '0 2px 16px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-dark': '0 2px 16px rgba(0,0,0,0.2)',
        'card-dark-hover': '0 8px 30px rgba(0,0,0,0.3)',
      },
      animation: {
        'in': 'fadeIn 0.5s ease-out forwards',
        'in-up': 'slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'meteor': 'meteor 2s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'pulse': 'softPulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', filter: 'blur(4px)' }, '100%': { opacity: '1', filter: 'blur(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        twinkle: { '0%,100%': { opacity: '0.2', transform: 'scale(0.7)' }, '50%': { opacity: '1', transform: 'scale(1.3)' } },
        meteor: { '0%': { transform: 'translateX(0) translateY(0) rotate(-30deg)', opacity: '0' }, '5%': { opacity: '1' }, '20%': { opacity: '0' }, '100%': { transform: 'translateX(-500px) translateY(400px) rotate(-30deg)', opacity: '0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        softPulse: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
