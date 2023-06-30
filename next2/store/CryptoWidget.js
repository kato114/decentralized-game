import { useEffect } from 'react';
import { useMediaQuery } from 'hooks';

function CryptoWidget(props) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://crypto.com/price/static/widget/index.js';
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="crypto-widget" style={{ display: `${props.pathName === '/' ? 'block' : 'none'}` }}>
      <div
        id="crypto-widget-CoinMarquee"
        data-transparent="true"
        data-design="classic"
        data-coins="ethereum,decentral-games,decentral-games-ice,decentral-games-governance-xdg"
        style={{ marginTop: '-48px', marginLeft: '-17px' }}
      />
    </section>
  );
}

export default CryptoWidget;
