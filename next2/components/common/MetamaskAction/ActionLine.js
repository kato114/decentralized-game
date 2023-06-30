import styles from './MetamaskAction.module.scss';

// the line displayed between actions
// will be blank between actions, and green when the previous action is completed
// you only need to provide the previous action let name
const ActionLine = ({ previousAction }) => {
  return (
    <div className={styles.steps_line}>
      {/** if previous step state is done, then fill the line, if not it stays gray */}
      <svg className={previousAction === 'done' ? styles.line_done : styles.line_initial} width="4" height="22" viewBox="0 0 4 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="4" height="22" rx="2" />
      </svg>
    </div>
  );
};

export default ActionLine;
