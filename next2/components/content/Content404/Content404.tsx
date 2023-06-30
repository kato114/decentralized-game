import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';
import styles from './Content404.module.scss';

const Content404 = (): ReactElement => {
  function notFound(): ReactElement {
    return (
      <span className={styles.outter_container}>
        <img className={styles.missing_img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_39_e6ceyn.png" />
        <p className={styles.header_text}> Page Not Found </p>
        <p className={styles.lower_text}> We can&apos;t find the page you&apos;re looking for, please return to the home page or try searching again.</p>

        <Button className={styles.home_button} href="/">
          Back to Home
        </Button>
      </span>
    );
  }

  return notFound();
};

export default Content404;
