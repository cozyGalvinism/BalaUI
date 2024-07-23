/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        "balatro-red": '#fe5f55',
        "balatro-mult": '#fe5f55',
        "balatro-blue": '#009dff',
        "balatro-chips": '#009dff',
        "balatro-green": '#4BC292',
        "balatro-money": '#f3b958',
        "balatro-gold": '#eac058',
        "balatro-attention": '#ff9a00',
        "balatro-purple": '#8867a5',
        "balatro-white": '#ffffff',
        "balatro-inactive": '#88888899',
        "balatro-spades": '#403995',
        "balatro-hearts": '#f03464',
        "balatro-clubs": '#235955',
        "balatro-diamonds": '#f06b3f',
        "balatro-tarot": '#a782d1',
        "balatro-planet": '#13afce',
        "balatro-spectral": '#4584fa',
        "balatro-legendary": '#b26cbb',
        "balatro-enhanced": '#8389DDFF',
      }
    },
  },
  plugins: [],
}

