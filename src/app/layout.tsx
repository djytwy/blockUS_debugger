import '@rainbow-me/rainbowkit/styles.css';
import './global.css';
import { Montserrat, Roboto_Slab } from 'next/font/google';
import { Providers } from './providers';
import { GlobalProvider } from '../globalCtx';
import { StyledEngineProvider } from '@mui/material/styles';
import Script from 'next/script';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const metadata = {
  title: 'Account center',
};

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const roboto = Roboto_Slab({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

function App({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // const theme = createTheme({
  //   typography: {
  //     fontFamily: ['var(--font-montserrat)'].join(','),
  //   },
  //   // palette: {
  //   //   primary: {
  //   //     main: '#FF4125',
  //   //   },
  //   // },
  // });

  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable}`}>
      <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
      <Script async defer src="https://www.google.com/recaptcha/api.js" />
      <Script async defer src="https://www.recaptcha.net/recaptcha/api.js" />
      <body className="bg-back bg-blend-color-burn bg-[100%_auto] bg-top overflow-y-hidden">
        <Providers>
          <StyledEngineProvider injectFirst>
            <GlobalProvider>
              <App>{children}</App>
            </GlobalProvider>
          </StyledEngineProvider>
        </Providers>
      </body>
    </html>
  );
}
