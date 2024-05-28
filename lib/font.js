import { createFont } from '@next/font';

export const font = createFont({
    fontFamily: 'Helvetica',
    files: { 
      regular: '/public/fonts/HelveticaNeue.ttf',
      bold: '/public/fonts/HLBHelvetica.TTF'
      // Add additional font styles if necessary
    },
  });