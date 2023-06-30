import React, { FC, ReactElement, useState } from 'react';
import { Button } from 'semantic-ui-react';
import FirstStep from './FirstStep/FirstStep';
import SecondStep from './SecondStep/SecondStep';
import ThirdStep from './ThirdStep/ThirdStep';
import FourthStep from './FourthStep/FourthStep';
import styles from './GetStarted.module.scss';

export interface GetStartedType {
  className?: string;
}

const GetStarted: FC<GetStartedType> = ({ className = '' }: GetStartedType): ReactElement => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Connect Wallet', 'Getting ICE Wearable', 'DCL Account Creation', 'Play'];

  return (
    <div className={`get-started component ${className} ${styles.main_wrapper}`}>
      <div className={styles.header_steps}>
        {steps.map((step, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={index + 1 === currentStep ? styles.step_active : styles.step} onClick={() => setCurrentStep(index + 1)}>
              <div>{index + 1}</div>
              <p className={styles.title}>{step}</p>
            </div>

            {index < 3 ? (
              <div className={styles.bullets}>
                <abbr>•</abbr>
                <abbr>•</abbr>
                <abbr>•</abbr>
                <abbr>•</abbr>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {currentStep === 1 ? <FirstStep /> : currentStep === 2 ? <SecondStep /> : currentStep === 3 ? <ThirdStep /> : currentStep === 4 ? <FourthStep /> : null}
      </div>

      <div className={styles.footer_buttons}>
        <Button
          disabled={currentStep === 1 ? true : false}
          onClick={() => {
            setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep);
          }}
        >
          <img className={styles.left} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634587739/back_cskr0x.png" alt="prev" />
          Back
        </Button>

        <Button
          disabled={currentStep === 4 ? true : false}
          onClick={() => {
            setCurrentStep(currentStep < 4 ? currentStep + 1 : currentStep);
          }}
        >
          Next
          <img className={styles.right} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634587739/next_zxguep.png" alt="next" />
        </Button>
      </div>
    </div>
  );
};

export default GetStarted;
