import styles from './ContentSubgraphs.module.scss';
import Aux from 'components/_Aux';

const ContentAccount = props => {
  
  function contentPoints() {
    return (
      <Aux>
        <div style={{ paddingTop: '80px' }}>
          <p className={styles.referrals_header_subtitle}>
            Count: {props.subgraphData.length}
          </p>
        </div>

        <div style={{ paddingTop: '50px' }}>
          {props.subgraphData.map((data, i) => (
            <Aux key={i}>
              <p className={styles.referrals_header_subtitle}>
                Affiliate: {data.affiliate}
              </p>
              <p className={styles.referrals_header_subtitle}>
                Player: {data.player}
              </p>
              <p className={styles.referrals_header_subtitle}>
                Points: {data.points}
              </p>
              <p className={styles.referrals_header_subtitle}>
                Total: {data.total}
              </p>
              <p className={styles.referrals_header_subtitle}>
                ----------------------------------------------
              </p>
            </Aux>
          ))}
        </div>
      </Aux>
    );
  }

  
  if (props.content === 'points') {
    return contentPoints();
  } else if (props.content === 'profit') {
    return contentPointer();
  }
};

export default ContentAccount;
