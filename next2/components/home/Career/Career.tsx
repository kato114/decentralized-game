import React, { ReactElement, useEffect, useContext, useState } from 'react';
import { GlobalContext } from '@/store';
import { Button, Table } from 'semantic-ui-react';
import Fetch from 'common/Fetch';
import styles from './Career.module.scss';

export interface CareerType {
  className?: string;
}

const CareerComponent = (): ReactElement => {
  // define local variables
  const [state, dispatch] = useContext<any>(GlobalContext);
  const [listing, setListing] = useState([]);

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const response = await Fetch.GET_JOB_LISTING();

        setListing(response && response.length > 0 ? response : []);
      } catch (error) {
        dispatch({
          type: 'show_toastMessage',
          data: 'Error fetching careers info, please try again.'
        });
      }
    })();
  }, []);

  return (
    <section className={styles.career_section} style={{ paddingTop: state.appConfig.webNotice ? '240px' : '180px' }}>
      <div className={styles.title}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1648583021/Briefcase_2x_sjncgu.png" alt="career" />
        <p>Join us in the metaverse!</p>
      </div>

      <div className={styles.container}>
        {listing && listing.length > 0 ? (
          <div>
            <Table fixed unstackable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell className={styles.position} style={{ textAlign: 'left', paddingLeft: '7%' }}>
                    Position
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles.location}>Location</Table.HeaderCell>
                  <Table.HeaderCell className={styles.team}>Team</Table.HeaderCell>
                  <Table.HeaderCell className={styles.listing}>Listing</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>

            {listing && listing.length > 0 ? (
              <Table fixed unstackable>
                <Table.Body>
                  {listing.map((row, i) => {
                    let style = '';

                    {
                      i % 2 === 0 ? (style = 'rgba(255, 255, 255, 0.08)') : (style = 'black');
                    }

                    return (
                      <Table.Row key={i} style={{ background: style }}>
                        <Table.Cell className={styles.position}>
                          <a href={row.listingLink} target="_blank" rel="noreferrer">
                            {row.position}
                          </a>
                        </Table.Cell>
                        <Table.Cell className={styles.location}>{row.location}</Table.Cell>
                        <Table.Cell className={styles.team}>{row.team}</Table.Cell>
                        <Table.Cell className={styles.listing}>
                          <Button
                            onClick={() => {
                              window.open(`${row.listingLink}`, '_blank');
                            }}
                          >
                            See Listing
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            ) : null}
          </div>
        ) : (
          <div className={styles.no_listing}>No Listings Currently Available</div>
        )}
      </div>
    </section>
  );
};

export default CareerComponent;
