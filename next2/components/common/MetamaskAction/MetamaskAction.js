import styles from './MetamaskAction.module.scss';

// valid action states are either:
// 'initial' = blank circle with white outline
// 'clicked' = green circle with elipsis
// 'done' = green circle with tick
const MetamaskAction = ({
  onClick,
  actionState,
  primaryText,
  secondaryText,
  disabled,
}) => {
  return (
    <div className={styles.metamask_action_container}>
      <span onClick={() => (disabled ? null : onClick())}>
        <>
          {actionState === 'initial' && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="white"
                stroke-opacity="0.25"
                strokeWidth="4"
              />
            </svg>
          )}

          {actionState === 'clicked' && (
            <>
              <div className={styles.animate_action} />
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="#35AB3A" />
              </svg>
            </>
          )}

          {actionState === 'done' && (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#35AB3A" />
              <path
                d="M14.7197 23.5601C15.4375 23.5601 15.9941 23.3037 16.375 22.7471L23.084 12.8594C23.3477 12.4712 23.4648 12.0684 23.4648 11.7095C23.4648 10.6841 22.6445 9.90771 21.5898 9.90771C20.8794 9.90771 20.4106 10.1641 19.9785 10.8452L14.6904 19.0483L12.105 16.1553C11.7388 15.7378 11.2993 15.54 10.7134 15.54C9.65137 15.54 8.86768 16.3164 8.86768 17.3491C8.86768 17.8252 8.99219 18.1914 9.39502 18.6455L13.1523 22.8862C13.5698 23.355 14.0825 23.5601 14.7197 23.5601Z"
                fill="white"
              />
            </svg>
          )}
        </>
      </span>

      <div className={styles.action_right}>
        <p className={styles.action_top_text}>{primaryText}</p>
        <p className={styles.action_bottom_text}>{secondaryText}</p>
      </div>
    </div>
  );
};

export default MetamaskAction;
