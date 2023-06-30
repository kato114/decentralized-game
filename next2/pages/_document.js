import Document, { Html, Head, Main, NextScript } from 'next/document';
import Global from 'components/Constants';

export default class MyDocument extends Document {
  static async getServerSideProps(ctx) {
    const initialProps = await Document.getServerSideProps(ctx);
    console.log(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content={Global.CONSTANTS.DESCRIPTION} />
          <link rel="shortcut icon" />
          <link rel="apple-touch-icon" sizes="180x180" />
          <link rel="icon" type="image/png" sizes="32x32" href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/favicon-32x32_uljekk.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/favicon-16x16_qjnn8u.png" />
          <link rel="manifest" href="/static/js/site.webmanifest" />
          <link rel="mask-icon" href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1593959829/safari-pinned-tab_brhtah.svg" color="#0086f4" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="theme-color" content="#000000" />
          <meta name="google-site-verification" content="9aU-7WbT0IK2q6vq2v6jciIc8At4qeagmjmKNhVUhFE" />
          <link rel="manifest" href="public/static/js/manifest.json" crossOrigin="use-credentials" />
          <link rel="preload" href="public/static/fonts/Larsseit/Larsseit5.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="public/static/fonts/Larsseit/Larsseit16.otf" as="font" crossOrigin="" />
          <link rel="preload" href="pubic/static/fonts/Larsseit/Larsseit13.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="public/static/fonts/Larsseit/Larsseit2.ttf" as="font" crossOrigin="" />
          <link rel="preload" href="public/static/fonts/Larsseit/Larsseit5.ttf" as="font" crossOrigin="" />
          <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet" />
          <meta name="facebook-domain-verification" content="ymawpiy7irzznvqvm922lfvr0cph0f" />
        </Head>

        <body className="body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
