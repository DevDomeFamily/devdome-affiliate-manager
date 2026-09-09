import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  // Preflight ON — the app renders inside an isolated iframe (no WP admin CSS),
  // so the full Tailwind base reset is needed for pixel-identical fidelity.
  content: ['./src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [animate],
};
