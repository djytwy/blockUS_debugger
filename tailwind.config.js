// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // corePlugins: {
  //   preflight: false,
  // },
  // important: '#root',
  theme: {
    screens: {
      thanMb: '600px',
      lg: '1080px',
      desktop: '1440px',
      // v1:
      xl: '1280px',
      md: '768px',
    },
    colors: {
      primary: '#FF4125',
      back: '#2A2A2A',
      white: 'white',
      black80: '#465358',
      black50: '#4A4A4A',
      // v1:
      rust: '#FF4125',
      rustDark: '#B7220C',
      rustLight: '#FF5940',
      greyDark: '#465358',
      greyLight: '#A8A8A8',
      'grey-medium': '#A0A4B0',
      greyBorder: '#F0F0F0',
      blackBg: '#2A2A2A',
      ligntGreen: '#CCFF00',
      metamask: '#F6851B',
      tips: '#4A4A4A',
      card: '#333333',
      ust: '#FF4125',
      eventHsRed: '#FF3D00',
      gameNavImg: 'linear-gradient(180deg, #3F3F3F 0%, #444444 100%)',
      white_1: '#f0f0f0',
      red_1: '#b7220c',
      stone: '#BBBBBB',
      silver: '#DDDDDD',
      'black/10': 'rgba(0,0,0,0.1)',
      'black/20': 'rgba(0,0,0,0.2)',
      'black/30': 'rgba(0,0,0,0.3)',
      'black/40': 'rgba(0,0,0,0.4)',
      'black/50': 'rgba(0,0,0,0.5)',
      'black/70': 'rgba(0,0,0,0.7)',
      'white/20': 'rgba(255,255,255,0.2)',
      transparent: '#00000000',
    },
    boxShadow: {
      none: '0,0,0,0',
      // v1:
      'nft-sale': '0px 4px 12px rgba(0, 0, 0, 0.15)',
      'statusCheck-drawer-modal': '0px -4px 8px rgba(0, 0, 0, 0.2)',
      'sidebar-nav-item': '0px 4px 8px rgba(0, 0, 0, 0.2)',
      'wallet-button': '0px 4px 10px rgba(0, 0, 0, 0.2)',
      button: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    },
    dropShadow: {
      // v1:
      'nft-modal': '0px 4px 24px rgba(0, 0, 0, 0.4)',
      'statusCheck-head-modal': '0px 4px 8px rgba(0, 0, 0, 0.2)',
      'wallet-popover': '0px 4px 10px rgba(0, 0, 0, 0.2)',
      'account-info': 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
      'account-nav': 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
    },
    // backgroundSize: {
    //   // v1:
    //   highStreet: 'linear-gradient(90deg, rgba(0, 0, 0, 0.55) 0%, rgba(217, 217, 217, 0) 50%, rgba(0, 0, 0, 0) 50%)',
    // },
    extend: {
      backgroundColor: {},
      backgroundImage: {
        mainImg: 'url(/common/mainBg.jpg)',
        play_fallen_arena: 'url(/common/play_fallen_arena.webp)',
        play_fallen_arena_hover: 'url(/common/play_fallen_arena_hover.webp)',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)'],
        roboto: ['var(--font-roboto)'],
      },
    },
  },
  plugins: [],
};
