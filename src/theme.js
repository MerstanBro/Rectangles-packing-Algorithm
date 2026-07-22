import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Syne', system-ui, sans-serif`,
    body: `'DM Sans', system-ui, sans-serif`,
    mono: `'IBM Plex Mono', ui-monospace, monospace`,
  },
  colors: {
    ink: {
      50: '#f3f6f4',
      100: '#e2e9e5',
      200: '#c5d2cb',
      300: '#9bb0a5',
      400: '#6f8a7c',
      500: '#546f62',
      600: '#42584e',
      700: '#364841',
      800: '#2d3b36',
      900: '#1a2421',
      950: '#0e1513',
    },
    citrus: {
      50: '#f7fce9',
      100: '#ecf8c9',
      200: '#d9f19a',
      300: '#bfe55d',
      400: '#a3d32f',
      500: '#84b419',
      600: '#669012',
      700: '#4d6e13',
      800: '#3f5815',
      900: '#364a16',
    },
  },
  semanticTokens: {
    colors: {
      'app.bg': { default: 'ink.50', _dark: 'ink.950' },
      'app.surface': { default: 'white', _dark: 'ink.900' },
      'app.surfaceMuted': { default: 'ink.50', _dark: 'ink.800' },
      'app.border': { default: 'ink.100', _dark: 'ink.700' },
      'app.borderStrong': { default: 'ink.200', _dark: 'ink.600' },
      'app.text': { default: 'ink.900', _dark: 'ink.50' },
      'app.muted': { default: 'ink.500', _dark: 'ink.300' },
      'app.nav': { default: 'ink.900', _dark: 'ink.800' },
      'app.navText': { default: 'ink.50', _dark: 'ink.50' },
      'app.accent': { default: 'citrus.400', _dark: 'citrus.300' },
      'app.gridBg': { default: 'ink.950', _dark: 'black' },
      'app.gridFg': { default: 'citrus.200', _dark: 'citrus.200' },
    },
  },
  styles: {
    global: (props) => ({
      'html, body, #root': {
        minHeight: '100%',
        height: '100%',
      },
      body: {
        bg: props.colorMode === 'dark' ? 'ink.950' : 'ink.50',
        color: props.colorMode === 'dark' ? 'ink.50' : 'ink.900',
        fontFamily: 'body',
        backgroundImage:
          props.colorMode === 'dark'
            ? 'radial-gradient(ellipse 80% 50% at 10% -10%, rgba(163, 211, 47, 0.12), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(84, 111, 98, 0.2), transparent), linear-gradient(180deg, #0e1513 0%, #1a2421 100%)'
            : 'radial-gradient(ellipse 80% 50% at 10% -10%, rgba(163, 211, 47, 0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(84, 111, 98, 0.12), transparent), linear-gradient(180deg, #f3f6f4 0%, #e8eee9 100%)',
        backgroundAttachment: 'fixed',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        letterSpacing: '0.01em',
      },
      variants: {
        solid: {
          bg: 'ink.900',
          color: 'citrus.200',
          _hover: { bg: 'ink.800' },
          _active: { bg: 'ink.950' },
          _dark: {
            bg: 'citrus.400',
            color: 'ink.950',
            _hover: { bg: 'citrus.300' },
          },
        },
        ghost: {
          color: 'ink.800',
          _hover: { bg: 'ink.100' },
          _dark: {
            color: 'ink.100',
            _hover: { bg: 'ink.800' },
          },
        },
        outline: {
          borderColor: 'ink.300',
          color: 'ink.800',
          _hover: { bg: 'ink.100' },
          _dark: {
            borderColor: 'ink.600',
            color: 'ink.100',
            _hover: { bg: 'ink.800' },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          borderRadius: 'xl',
          bg: 'app.surface',
          border: '1px solid',
          borderColor: 'app.border',
        },
      },
    },
  },
})

export default theme
