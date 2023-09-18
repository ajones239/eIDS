
import Layout from '../app/layout';


export default function App({ Component, pageProps }) {
  return (
      <Layout>
        <Component {...pageProps} />
    </Layout>
  );
  }
