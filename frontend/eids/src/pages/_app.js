
import Layout from '../app/layout';
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
      <Layout>
        <Component {...pageProps} />
    </Layout>
  );
  }
