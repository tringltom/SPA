module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1280px',          
    },
    colors: {
      'error': '#E8384D',            
      'success': '#07bc0c',
      'primary': '#01B7FF',
      'secondary': '#1a2045',
      'tertiary': '#7D36DC',
      'white': '#FFFFFF',
      'black': '#000',
      'formBg': '#F2EFF8',
      'divider': '#d9dada',
      'text': '#1B0740',
      'light': 'rgba(255,255,255,.5)',
      'transparent': 'transparent'
    },   
    extend: {
      gridTemplateColumns: {        
        'welcome': '201px repeat(2, minmax(100px, 390px))',
      },
      borderWidth: {
        '3': '3px',
      },
      height: {
        '17': '4.25rem',
      },
      fontSize: {
        'xs': '0.7rem',
        'tiny': '1rem',
      },
      fontFamily: {
        primary: ['Comfortaa, cursive']
      },
      maxWidth: {
        'modal': '650px'
      }, 
    },
  },
  plugins: [],
}