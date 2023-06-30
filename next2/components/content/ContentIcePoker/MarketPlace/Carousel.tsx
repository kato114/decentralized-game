import React, { ReactElement, useContext } from 'react';
import Slider from 'react-slick';
import cn from 'classnames';
import { Button, Popup } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import ModalMintWearable from '@/components/modal/ModalMintWearable';
import ModalLoginICE from '@/components/modal/ModalLoginICE';
import Spinner from '@/components/lottieAnimation/animations/SpinnerUpdated';
import CheckMintableModal from '@/components/modal/CheckMintableModal';
import { useWindowSize } from '@/hooks/useWindowSize';
import Global from '@/components/Constants';
import AccessoryCards from './AccessoryCards';
import styles from './MarketPlace.module.scss';

export interface ButtonProps {
  className?: string;
  onClick(): void;
}

export interface CarouselProps {
  isIce?: boolean;
  setDisplayCounts?: any;
  displayCounts?: any;
  previewLevel?: Array<number>;
  setPreviewLevel?: any;
  accessories?: Array<any>;
  onClick?: () => void;
}

const Carousel: React.FC<CarouselProps> = props => {
  const size = useWindowSize();
  // dispatch new user status to Context API store
  const [state] = useContext(GlobalContext);
  const { isIce, displayCounts, setDisplayCounts, previewLevel, setPreviewLevel, accessories, onClick } = props;
  // helper functions
  function updatePreviewLevel(previewIndex, activeId): void {
    const levels = previewLevel;

    levels[previewIndex] = activeId;

    setPreviewLevel([].concat(levels));
  }

  function CarouselNextArrow(props: ButtonProps): ReactElement {
    const { className, onClick } = props;

    return (
      <div className={className} onClick={onClick}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1638236358/Right_Chevron_3x_cxt9x8.png" alt="nextArrow" />
      </div>
    );
  }

  function CarouselPrevArrow(props: ButtonProps): ReactElement {
    const { className, onClick } = props;

    return (
      <div className={className} onClick={onClick}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1638236358/Right_Chevron_3x_cxt9x8.png" alt="nextArrow" />
      </div>
    );
  }

  const settings = {
    className: 'slider variable-width',
    dots: false,
    infinite: false,
    swipeToSlide: true,
    variableWidth: true,
    slidesToShow: size.width <= 499 ? 1 : size.width <= 1040 ? Math.floor((size.width - 120) / 300) : Math.min(Math.floor((size.width - 300) / 300), 6),
    nextArrow: <CarouselNextArrow onClick={() => onClick && onClick()} />,
    prevArrow: <CarouselPrevArrow onClick={() => onClick && onClick()} />
  };

  const checkSoldOutStatus = (itemList, maxMint): ReactElement => itemList.some(item => item[0] - maxMint !== 0);

  const buyOnSecondaryButton = (): ReactElement => <Button className={styles.wearable_button}>Buy on Secondary</Button>;

  const soldOutButton = (): ReactElement => (
    <Button disabled className={styles.sold_button}>
      Sold Out
    </Button>
  );

  return (
    <section>
      {isIce
        ? Global.WEARABLES.map((wearable, index) => {
            let itemLimits = state[`itemLimits${15 - index}`];
            console.log('@@@@@@@@@@@', itemLimits);

            let maxMintCounts = 0;

            if (state.appConfig && state.appConfig.maxMintCounts) {
              Object.keys(state.appConfig.maxMintCounts).map(address => {
                if (address === wearable?.address?.toLowerCase()) {
                  maxMintCounts = state.appConfig.maxMintCounts[address];
                }
              });
            }

            if (index < displayCounts) {
              return (
                <section key={index} className={styles.wearable_section}>
                  {isIce && (
                    <h3>
                      {wearable.title}
                      {index === 0 && state.userLoggedIn && <CheckMintableModal />}
                    </h3>
                  )}

                  <Slider {...settings}>
                    {isIce && (
                      <div className={styles.games_container} style={{ paddingBottom: '20px' }}>
                        <div>
                          {wearable.preview.map((img, i) => (
                            <img key={i} className={i === previewLevel[index] ? styles.preview_nft_image : styles.preview_nft_image_none} src={img} />
                          ))}
                        </div>
                        <div className={styles.preview_description}>
                          <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                          <div className={styles.preview_level_select_div}>
                            {wearable.preview.map((img, i) => (
                              <div key={i} className={previewLevel[index] === i ? styles.selectActive : styles.select} onClick={() => updatePreviewLevel(index, i)}>
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {Object.keys(wearable.details).map((item, i) => (
                      <div key={i} className={styles.games_container}>
                        <div className={styles.wear_box_purple}>
                          <div className={styles.fullDiv}>
                            <div className={styles.imgDiv}>
                              <img
                                className={styles.img}
                                src={
                                  isIce
                                    ? 'https://res.cloudinary.com/dnzambf4m/image/upload/v1646762021/iceenabled-banner1_ark2at.svg'
                                    : 'https://res.cloudinary.com/dnzambf4m/image/upload/v1646762021/accessory-banner1_ouaqux.svg'
                                }
                              />
                              <Popup
                                trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />}
                                position="top left"
                                hideOnScroll={true}
                                className={cn('p2e_enabled_tooltip', styles.popup)}
                              >
                                <Popup.Content className={styles.tooltipContent}>
                                  <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />
                                  {isIce ? (
                                    <p className={styles.popup_content}>
                                      ICE Enabled wearables allow you
                                      <br /> to earn real cash value from
                                      <br /> free-to-play ICE poker tables.
                                    </p>
                                  ) : (
                                    <p className={styles.popup_content}>
                                      Accessories are purely cosmetic.
                                      <br /> They do not give you access to
                                      <br /> ICE Poker tables.
                                    </p>
                                  )}
                                </Popup.Content>
                              </Popup>
                            </div>
                          </div>
                        </div>

                        <img className={styles.nft_image} src={wearable.details[item][0]} />

                        <div className={styles.nft_description}>
                          <span style={{ display: 'flex', justifyContent: 'center' }}>
                            <p className={styles.nft_info}>{wearable.details[item][3]}</p>

                            {state.userStatus >= 4 ? (
                              <p className={styles.nft_info}>
                                {itemLimits[i][0] >= 0 ? maxMintCounts - itemLimits[i][0] : '- '} of {maxMintCounts} left
                              </p>
                            ) : (
                              <p className={styles.nft_info}>- of {maxMintCounts} left</p>
                            )}
                          </span>
                          <p className={styles.nft_other_p}>{wearable.details[item][2]}</p>
                          <h3 className={styles.nft_other_h3}>{wearable.details[item][1]}</h3>
                        </div>

                        <div className={styles.button_container}>
                          {(() => {
                            // Logged In States
                            if (state.userLoggedIn) {
                              if (state.userStatus >= 4 && itemLimits[i][0] < 0) {
                                // Items still loading, display spinner
                                return (
                                  <Button disabled className={styles.sold_button}>
                                    <Spinner width={20} height={20} />
                                  </Button>
                                );

                                // Items loaded
                                // Minting enabled
                              } else if (state.userStatus >= state.appConfig.minMintVerifyStep && maxMintCounts - itemLimits[i][0] > 0) {
                                return (
                                  <div className={styles.flex_50}>
                                    <ModalMintWearable
                                      index={i}
                                      maxMintCounts={maxMintCounts}
                                      numberLeft={itemLimits[i][0]}
                                      itemId={itemLimits[i][1]}
                                      contractAddress={itemLimits[5]}
                                      wearableImg={wearable.details[item][0]}
                                      wearableBodyType={wearable.details[item][3]}
                                      wearableBodyImg={wearable.details[item][4]}
                                      wearableName={wearable.details[item][1]}
                                    />
                                  </div>
                                );

                                // Minting Disabled States
                              } else if (maxMintCounts !== 0 && maxMintCounts - itemLimits[i][0] >= 0 && maxMintCounts - itemLimits[i][0] < 1) {
                                console.log('###########', maxMintCounts, i, itemLimits[i][0]);
                                return (
                                  <a
                                    className={styles.flex_50}
                                    href="https://opensea.io/collection/decentral-games-ice"
                                    target="_blank"
                                    style={{
                                      width: '100%'
                                    }}
                                    rel="noreferrer"
                                  >
                                    {
                                      // Show "Buy on Secondary" if all items in series are sold out, otherwise show "Sold Out" button
                                      checkSoldOutStatus(itemLimits.slice(0, -1), maxMintCounts) ? soldOutButton() : buyOnSecondaryButton()
                                    }
                                  </a>
                                );
                              } else if (
                                state.userStatus < state.appConfig.minMintVerifyStep &&
                                (maxMintCounts - itemLimits[i][0] > 0 || (maxMintCounts === 0 && itemLimits[i][0] === 0))
                              ) {
                                // Coming Soon State
                                return (
                                  <Button disabled className={styles.sold_button}>
                                    Coming Soon!
                                  </Button>
                                );
                              } else {
                                return <p>Failed to load mint button.</p>;
                              }
                            } else {
                              // Logged Out State
                              return (
                                <div className={styles.flex_50}>
                                  <ModalLoginICE />
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>
                    ))}
                  </Slider>
                </section>
              );
            } else {
              return null;
            }
          })
        : accessories &&
          accessories.map((collections, index) => (
            <div key={index} className={styles.accessory_wrapper}>
              <AccessoryCards isIce={isIce} collectionMap={collections.collectionMap} contractAddress={collections.contractAddress} />
            </div>
          ))}
    </section>
  );
};

export default Carousel;
