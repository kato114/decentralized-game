import { useEffect, useContext, useState } from 'react';
import { isEmpty } from 'lodash';
import { GlobalContext } from '@/store';
import ContentEvents from './ContentEvents';
import Spinner from 'components/Spinner';
import Global from 'components/Constants';

import styles from './ComingEvents.module.scss';
import Fetch from '../../../common/Fetch';

const ComingEvents = () => {
  // get DCL events data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventOngoing, setEventOngoing] = useState(false);

  // Get Events data from Decentraland
  useEffect(() => {
    (async () => {
      // Fetch data if not within the app state
      if (!state.eventsData) {
        let json = await Fetch.EVENTS();

        dispatch({
          type: 'events_data',
          data: json
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEmpty(state.eventsData)) {
      const events = [];
      state.eventsData.data.map(event => {
        if (event.user === Global.ADDRESSES.DECENTRAL_GAMES_EVENTS) {
          const date = new Date(event.next_start_at);
          event.next_start_at = date.toUTCString().replace('GMT', 'UTC');
          events.push(event);
        }
      });

      const eventDate = new Date(state.eventsData.data[0].next_start_at).getTime();
      const currentDate = new Date().getTime();

      setEventOngoing(eventDate > currentDate);
      setEvents(events);
      setLoading(false);
    }
  }, [state.eventsData]);

  return (
    <div className={styles.main_container} style={{ marginTop: state.appConfig.webNotice ? '50px' : '0px' }}>
      {loading === true ? (
        <Spinner background={1} />
      ) : (
        <div className={styles.page_container}>
          <ContentEvents eventOngoing={eventOngoing} events={events} />
        </div>
      )}
    </div>
  );
};

export default ComingEvents;
