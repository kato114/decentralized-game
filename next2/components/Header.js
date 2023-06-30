import Head from 'next/head';
import { NextSeo } from 'next-seo';
import Aux from './_Aux';
import Global from './Constants';
import { useContext } from 'react';
import { GlobalContext } from '@/store';

const Header = props => {
  const [state, dispatch] = useContext(GlobalContext);

  function segmentSnippet() {
    // create a queue, but don't obliterate an existing one
    let analytics = (window.analytics = window.analytics || []);

    // if the real analytics.js is already on the page return
    if (analytics.initialize) return;

    // if the snippet was invoked already show an error
    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error('Segment snippet included twice.');
      }
      return;
    }

    // invoked flag, to make sure the snippet is never invoked twice
    analytics.invoked = true;

    // list of the methods in Analytics.js to stub
    analytics.methods = [
      'trackSubmit',
      'trackClick',
      'trackLink',
      'trackForm',
      'pageview',
      'identify',
      'reset',
      'group',
      'track',
      'ready',
      'alias',
      'debug',
      'page',
      'once',
      'off',
      'on',
      'addSourceMiddleware',
      'addIntegrationMiddleware',
      'setAnonymousId',
      'addDestinationMiddleware'
    ];

    // define a factory to create stubs. These are placeholders for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is stored as the first argument, so we can replay the data
    analytics.factory = function (method) {
      return function () {
        let args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    // for each of our methods, generate a queueing stub
    for (let i = 0; i < analytics.methods.length; i++) {
      let key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }

    // define a method to load Analytics.js from our CDN, and that will be sure to only ever load it once
    analytics.load = function (key, options) {
      // create an async script element based on your key
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';

      // insert our script next to the first script element.
      let first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
      analytics._loadOptions = options;
    };

    // add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = '4.1.0';

    // load Analytics.js with your key, which will automatically load the tools you've enabled for your account
    analytics.load(Global.KEYS.SEGMENT_WRITE_KEY);
  }

  return (
    <Aux>
      <Head>
        <title>{props.title}</title>
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
        <meta property="og:url" content={Global.CONSTANTS.BASE_URL} />
        <meta name="twitter:site" content={'@' + Global.CONSTANTS.SOCIAL_HANDLE} />
        <meta name="robots" content="index, follow" />
        // AMNESIA_COMMENT: remove this whole conditional chunk after we are done with amnesia
        {state.isAmnesiaPage ? (
          <>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632944120/amnesia/amnesia_favicon_zqlqyz.ico"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632944120/amnesia/amnesia_favicon_zqlqyz.ico"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632944120/amnesia/amnesia_favicon_zqlqyz.ico"
            />
            <link rel="manifest" href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632944120/amnesia/amnesia_favicon_zqlqyz.ico" />
            <link
              rel="mask-icon"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1632944120/amnesia/amnesia_favicon_zqlqyz.ico"
              color="#5bbad5"
            />
          </>
        ) : (
          <>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/apple-touch-icon_xrz57z.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/favicon-32x32_uljekk.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1621630083/favicon-16x16_qjnn8u.png"
            />
            <link rel="manifest" href="/static/js/site.webmanifest" />
            <link rel="mask-icon" href="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1593959829/safari-pinned-tab_brhtah.svg" color="#5bbad5" />
          </>
        )}
        {typeof window !== 'undefined' ? typeof window.analytics === 'undefined' ? <script dangerouslySetInnerHTML={{ __html: segmentSnippet() }} /> : null : null}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-V2YT3FT17V"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-V2YT3FT17V');`
          }}
        />
      </Head>

      <NextSeo
        openGraph={{
          type: 'website',
          url: Global.CONSTANTS.BASE_URL,
          title: props.title,
          description: props.description,
          images: [
            {
              url: props.image,
              width: 800,
              height: 600,
              alt: props.title
            }
          ]
        }}
      />
    </Aux>
  );
};

export default Header;
