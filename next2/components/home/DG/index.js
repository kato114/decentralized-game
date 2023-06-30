import { useState, useEffect } from 'react';
import Footer from 'components/home/Footer';
import SectionOne from './SectionOne';
import SectionTwo from './SectionTwo';
import SectionThree from './SectionThree';
import styles from './DG.module.scss';
import cn from 'classnames';

const DGHome = () => {
  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [utm, setUtm] = useState('');

  let buttonPlay = '';

  
  useEffect(() => {
    buttonPlay = document.getElementById('play-now-button-home');
  }, []);

  useEffect(() => {
    if (buttonPlay) {
      analytics.trackLink(buttonPlay, 'Clicked PLAY NOW (home page)');
    }
  }, [buttonPlay]);

  useEffect(() => {
    setVideoPlay(typeof window.orientation === 'undefined');
  }, []);

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  return (
    <div className={styles.home_dashboard}>
      <SectionOne autoPlay={videoPlay} />
      <div className={cn('', styles.gradientLayout)} />
      <SectionTwo />
      <SectionThree />
      <Footer />
    </div>
  );
};

export default DGHome;
