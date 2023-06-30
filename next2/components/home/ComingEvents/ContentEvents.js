import {React, useState } from 'react';
import Countdown from 'react-countdown';
import cn from 'classnames';
import { useMediaQuery } from 'hooks';
import { Button, Grid, Image } from 'semantic-ui-react';

import styles from './ComingEvents.module.scss';

function getSentences(str) {
  const ss = str.match(/.*?[?!.]/g);
  const f = ss.slice(0, 2).join(' ');
  return f;
}

const ContentEvents = ({ events, eventOngoing }) => {

  const [completed, setCompleted] = useState(false);
  const isWideScreen = useMediaQuery('(min-width: 1200px)');

  return (
    <span className={styles.custom_events} >
      <div className={styles.account_other_tabs} style={{ marginTop: '-10px' }}>
        <div className="ml-0">
          <span className="d-flex justify-content-between">
            {eventOngoing ? (
              <span className={styles.title}>Next Event: Now</span>
            ) : (
              <span className="d-flex">
                <span className={styles.title}>Next Event in:&nbsp;</span>
                {completed? (
                  <span>
                    Currently Active!
                  </span>
                ) : (
                  <Countdown
                    className={styles.countdown}
                    date={events[0].next_start_at}                    
                    onComplete={() => {
                      setCompleted(true);
                    }}
                  />
                )}
              </span>
            )}
          </span>
        </div>
      </div>

      <div>
        <a 
          href={`https://events.decentraland.org/en/?event=${events[0].id}`} 
          className={cn('mt-0', styles.nft_container)}
          target="_blank"
        >
          <span className={styles.featured_event_grid}>
            <Image
              src={events[0].image}
              className={cn(styles.event_pic, styles.featured)}
            />

            <div className={cn(styles.post_info, styles.featured)}>
              <span className={styles.featured_info}>
                {events[0].next_start_at}
              </span>

              <h3 className={cn(styles.event_title, styles.featured)}>
                {events[0].name}
              </h3>

              <p className={styles.events_featured_p}>
                {getSentences(events[0].description)}
              </p>

              <span className={styles.button_group}>
                <Button
                  className={styles.nft_read_button}
                  target="_blank"
                  href={`https://events.decentraland.org/en/?event=${events[0].id}`}
                >
                  Info
                </Button>
                <Button
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={events[0].url}
                >
                  Hop In
                </Button>
              </span>
            </div>
          </span>
        </a>
      </div>

      <div className={styles.account_other_tabs} style={{ paddingTop: '26px'}}>
        <div className="ml-0">
          <span className={styles.all_events}>All Upcoming Events</span>
        </div>
      </div>

      <span>
        <div className={styles.outter_games_container}>
          {events.slice(1).map((event, i) => (
            <a
              href={`https://events.decentraland.org/en/?event=${event.id}`}
              className={styles.games_container}
              target="_blank"
            >
              <img
                src={event.image}
                className={styles.nft_image}
              />

              <div className={styles.nft_description}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className={styles.nft_info}>
                    {event.next_start_at}
                  </p>
                </span>
                <h3 className={styles.nft_h3}>{event.name}</h3>
                <p className={styles.nft_p}>{getSentences(event.description)}</p>
              </div>
              <Button
                color="blue"
                className={styles.nft_button}
                target="_blank"
                href={`https://events.decentraland.org/en/?event=${event.id}`}
              >
                Learn More
              </Button>
            </a>
          ))}
        </div>
      </span>
    </span>
  );
};

export default ContentEvents;
