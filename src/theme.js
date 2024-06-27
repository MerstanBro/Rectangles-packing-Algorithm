import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        background: 'white',
      },
    },
  },
});

export default theme;