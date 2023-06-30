// third-party public API keys
const KEYS = {
  BICONOMY_API_1: 'iW9B13586.996fe1e6-5969-40cb-b986-6ea37cfeec8f',
  BICONOMY_API_2: 'A7mK3_ymC.92264b6e-1289-4e01-9f5f-6b53de2c69d4',
  TRANSAK_API: '6f2cd88d-b241-4cdb-8f1a-a034cda14bf6',
  GOOGLE_ANALYTICS: 'UA-146057069-1',
  BUTTER_TOKEN: 'd7d6d8425656d3cfe5f45d7a0a3a8470ef09d434',
  SEGMENT_WRITE_KEY: 'pK03oncLYCxY1DJtTmnJnuwLByq2RlAb',
  CONNEXT_PUBLIC_ID: 'vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np'
};

// common constant values
const CONSTANTS = {
  BASE_URL: 'https://decentral.games',
  MAX_AMOUNT: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  GAS_LIMIT: '3000000', // was '900000'
  GAS_AMOUNT: '80000000000', // was '20000000000'
  FACTOR: 1000000000000000000, // ETH-to-WEI multiplication factor
  PARENT_NETWORK_ID: 1, // 1: Mainnet, 3: Ropsten, 5: Goerli
  ACTIVE_PERIOD: 43200, // user account active period: 3600 === 1 hour // 43200
  MAINNET_URL: 'https://mainnet.infura.io/v3/1a359efdd4d04d89b5c1b63de776d444',
  MATIC_NETWORK_ID: 137, // Mumbai: 80001, Mainnet: 137
  MATIC_URL: 'https://rpc-mainnet.maticvigil.com/v1/03db49966edbf82fb60cb4e04b2c3b4fec306219', // 'https://rpc-mainnet.matic.network',
  MATIC_EXPLORER: 'https://explorer-mainnet.maticvigil.com',
  TITLE: 'Decentral Games',
  DESCRIPTION: 'We build games that reward you to play. Play, earn, and scale your own metaverse guild. ICE Poker beta is now live.',
  DISCORD_URL: 'https://discord.gg/cvbSNzY',
  SOCIAL_HANDLE: 'decentralgames',
  MAX_ITEM_COUNT: 70, // maximum number of tokenOfOwner indexes to query on the accessories contract ********** was 10 **********
  MAX_DELEGATION_COUNT: 5, // maximum number of delegated NFTs a user can have
  VERIFY_URL: 'staging.decentral.games',
  WETH_MINT_AMOUNT: 0.25, // amount of WETH required for minting
  ICE_MINT_AMOUNT: 8000, // amount of ICE required for minting
  DG_STAKED_AMOUNT: 1, // amount of DG user is required to have staked in order to mint wearable
  XDG_STAKED_AMOUNT: 1000, // amount of DG user is required to have staked in order to mint wearable
  POOLING_TIME_OUT: 30000, // API endpoint request pool interval (milliseconds)
  POOLING_LIMIT_COUNT: 1, // attempt to call API endpoint this number of times
  MINT_STATUS: 29, // minimum userStatus level for minting wearables (we can replace with appConfig variable when it's available)
  APR_NUMBER: 26071500, // APR constant number,
  TOKEN_DECIMALS: 18, // the decimals of register contract,
  MATIC_CHAIN_ID: 137,
  AUTH_TOKEN_TTL: 60 * 24 * 7 // 7 days; TTL in number of minutes
};

// wallet and contract addresses
const ADDRESSES = (() => {
  const OWNER_WALLET_ADDRESS = '0x3c383b7ffd5d2bf24ebd1fc8509cefa9b7d1976f';
  const WORKER_WALLET_ADDRESS = '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A';
  const ROOT_TOKEN_ADDRESS_DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const ROOT_TOKEN_ADDRESS_MANA = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942';
  const ROOT_TOKEN_ADDRESS_DG = '0xee06a81a695750e71a662b51066f2c74cf4478a0';
  const ROOT_TOKEN_ADDRESS_DG_LIGHT = '0x4b520c812e8430659fc9f12f6d0c39026c83588d';
  const ROOT_TOKEN_ADDRESS_USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  const ROOT_TOKEN_ADDRESS_ATRI = '0xdacD69347dE42baBfAEcD09dC88958378780FB62';
  const ROOT_TOKEN_ADDRESS_ICE = '';
  const ROOT_DG_LIGHT_BRIDGE_ADDRESS = '';

  const ROOT_DG_TOWN_HALL_ADDRESS = '0x4f81c790581b240a5c948afd173620ecc8c71c8d';

  const CHILD_TOKEN_ADDRESS_DAI = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
  const CHILD_TOKEN_ADDRESS_MANA = '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4';
  const CHILD_TOKEN_ADDRESS_DG = '0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4';
  const CHILD_TOKEN_ADDRESS_DG_LIGHT = '0xef938b6da8576a896f6E0321ef80996F4890f9c4';
  const CHILD_TOKEN_ADDRESS_USDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
  const CHILD_TOKEN_ADDRESS_ATRI = '0xB140665ddE25c644c6B418e417C930dE8A8a6Ac9';
  const CHILD_TOKEN_ADDRESS_WETH = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
  const CHILD_TOKEN_ADDRESS_ICE = '0xc6c855ad634dcdad23e64da71ba85b8c51e5ad7c';
  const CHILD_DG_LIGHT_BRIDGE_ADDRESS = '0x0f09D3a5ACeA61F7ceBd5f2FeA62c070c9730a53';

  const CHILD_TOKEN_XDG_ADDRESS = '0xc6480Da81151B2277761024599E8Db2Ad4C388C8';

  const ROPSTEN_TOKEN_ADDRESS_DG = '0x5f3f4a1f10C8F2ca2D589A19D8Fe488f49FAb04A';
  const ROPSTEN_TOKEN_ADDRESS_DG_LIGHT = '0x40E25786ACE1a546b61CE7BD0C0E04bdBd52dF76';
  const ROPSTEN_DG_LIGHT_BRIDGE_ADDRESS = '';
  const ROPSTEN_DG_TOWN_HALL_ADDRESS = '0xAa4Add3f618a59D05d1Ba8c9e6Ce22bB5d819C8f';
  const TREASURY_CONTRACT_ADDRESS = '0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3';
  const DG_POINTER_CONTRACT_ADDRESS = '0x11e46DB40d4438D1c64f68993CA43b03Ac1B6A6B';
  const DG_POINTER_CONTRACT_ADDRESS_NEW = '0xC751C3D67291E95e02E71E713E51D8CD27e8d04B';

  const DG_STAKING_BALANCER_ADDRESS_1 = '0xA9380E21fF4Ed3218a7a518D16c464ff0DcBf143';
  const DG_STAKING_BALANCER_ADDRESS_2 = '0x444b3917f08a0c7a39267b1ec2f46713c5492db2';

  const DG_STAKING_UNISWAP_ADDRESS = '0x55ceb773c494cf7ad4f2e3170936866bd7eff1c9';

  const DG_STAKING_GOVERNANCE_ADDRESS = '0xf1d113059517dbddd99ab9caffa76fc01f0557cd';

  const DG_KEEPER_CONTRACT_ADDRESS = '0x6b5C29B035Ec40a7cE567f1F11cc90eBfa4f1D17';
  const ICE_REGISTRANT_ADDRESS = '0xC9a67eD1472A76d064C826B54c144Ca00DAE4015';

  const NON_ICE_REGISTRANT_COLLECTION_ADDRESS = '0x966dc1f18d8a870550b3addc52b5493f7df6ca44';
  const NON_ICE_REGISTRANT_NFT_PURCHASER_ADDRESS = '0xF022E5D2c3F4Fb8ab4ae0ECB1d3596c12A00B12F';

  const BP_TOKEN_ADDRESS_1 = '0xca54c398195fce98856888b0fd97a9470a140f71';
  const BP_TOKEN_ADDRESS_2 = '0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d';
  const UNISWAP_ADDRESS_STAKING = '0x44c21f5dcb285d92320ae345c92e8b6204be8cdf';
  const UNISWAP_ADDRESS_WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const TOMINOYA_CONTRACT_ADDRESS = '0xF4618abb5E8031454238696A0F013DcD1476dc33';
  const DECENTRAL_GAMES_EVENTS = '0x154620ddfdcd6ab15dd9c1682386debad1eef536';
  const COLLECTION_V2_ADDRESS = '0xcb06f6aee0655252a3f6f2884680421d55d3c645';
  const COLLECTION_PH_ADDRESS = '0x4cd15dcd96362cf85e19039c3c2d661e5e43145e';
  const COLLECTION_LINENS_ADDRESS = '0xd79cf5a41d8caec4688e01b4754ea2da6f51e856';
  const COLLECTION_BOMBER_ADDRESS = '0xd07a56f7198ae6e4e3d6738bd8c4b81d21bf0403';
  const COLLECTION_CRYPTO_DRIP_ADDRESS = '0x897243a54b03b46a17b55d5609465e9719a6ffa0';
  const COLLECTION_FOUNDING_FATHERS_ADDRESS = '0x09eeac7dff0dc304e25cbb7bdbfae798488fc34f';
  const COLLECTION_JOKER_ADDRESS = '0x451612c0e742e27f2cfb3888ad2813eec8dd1ba3';
  const COLLECTION_CHEF_ADDRESS = '0xa96f7f2102c27a61e3a660d964e9aa613b68fe6b';
  const COLLECTION_BEACH_ADDRESS = '0x49cb83b4c4980029200b6759d5fb7d3b21f10134';
  const COLLECTION_AIRLINE_ADDRESS = '0xc60f0a9df4d42f593b3675755a55e1de97f82a05';
  const COLLECTION_POET_ADDRESS = '0x5b2d60db65d80593bd5c5d36fcd99717ef03e850';
  const COLLECTION_SPARTAN_ADDRESS = '0xda41c9e3808237b4ab8f6abd6936a828f4225263';
  const COLLECTION_CYBERPUNK_ADDRESS = '0x446c19903c267ae944eab6eca1f8603245be6b80';
  const COLLECTION_VIKING_ADDRESS = '0x62340bf727c536400a15bd41f62b4c684232c57a';
  const COLLECTION_MUTANT_ADDRESS = '0x0a2568fde974948cfa6541193d3e018d9451a932';
  const ICE_TOKEN_ADDRESS = '0xc6C855AD634dCDAd23e64DA71Ba85b8C51E5aD7c';

  console.log('OWNER_WALLET_ADDRESS: ' + OWNER_WALLET_ADDRESS);
  console.log('WORKER_WALLET_ADDRESS: ' + WORKER_WALLET_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('ROOT_TOKEN_ADDRESS_DG: ' + ROOT_TOKEN_ADDRESS_DG);
  console.log('ROOT_TOKEN_ADDRESS_DG_LIGHT: ' + ROOT_TOKEN_ADDRESS_DG_LIGHT);
  console.log('ROOT_TOKEN_ADDRESS_USDT: ' + ROOT_TOKEN_ADDRESS_USDT);
  console.log('ROOT_TOKEN_ADDRESS_ATRI: ' + ROOT_TOKEN_ADDRESS_ATRI);
  console.log('ROOT_TOKEN_ADDRESS_ICE: ' + ROOT_TOKEN_ADDRESS_ICE);
  console.log('ROOT_DG_LIGHT_BRIDGE_ADDRESS: ' + ROOT_DG_LIGHT_BRIDGE_ADDRESS);
  console.log('ROOT_DG_TOWN_HALL_ADDRESS: ' + ROOT_DG_TOWN_HALL_ADDRESS);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DG: ' + CHILD_TOKEN_ADDRESS_DG);
  console.log('CHILD_TOKEN_ADDRESS_DG_LIGHT: ' + CHILD_TOKEN_ADDRESS_DG_LIGHT);
  console.log('CHILD_TOKEN_ADDRESS_USDT: ' + CHILD_TOKEN_ADDRESS_USDT);
  console.log('CHILD_TOKEN_ADDRESS_ATRI: ' + CHILD_TOKEN_ADDRESS_ATRI);
  console.log('CHILD_TOKEN_ADDRESS_WETH: ' + CHILD_TOKEN_ADDRESS_WETH);
  console.log('CHILD_TOKEN_ADDRESS_ICE: ' + CHILD_TOKEN_ADDRESS_ICE);
  console.log('CHILD_DG_LIGHT_BRIDGE_ADDRESS: ' + CHILD_DG_LIGHT_BRIDGE_ADDRESS);

  console.log('CHILD_TOKEN_XDG_ADDRESS: ' + CHILD_TOKEN_XDG_ADDRESS);

  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
  console.log('DG_POINTER_CONTRACT_ADDRESS: ' + DG_POINTER_CONTRACT_ADDRESS);
  console.log('DG_POINTER_CONTRACT_ADDRESS_NEW: ' + DG_POINTER_CONTRACT_ADDRESS_NEW);
  console.log('DG_STAKING_BALANCER_ADDRESS_1: ' + DG_STAKING_BALANCER_ADDRESS_1);
  console.log('DG_STAKING_BALANCER_ADDRESS_2: ' + DG_STAKING_BALANCER_ADDRESS_2);
  console.log('DG_STAKING_UNISWAP_ADDRESS: ' + DG_STAKING_UNISWAP_ADDRESS);
  console.log('DG_STAKING_GOVERNANCE_ADDRESS: ' + DG_STAKING_GOVERNANCE_ADDRESS);
  console.log('DG_KEEPER_CONTRACT_ADDRESS: ' + DG_KEEPER_CONTRACT_ADDRESS);
  console.log('ICE_REGISTRANT_ADDRESS: ' + ICE_REGISTRANT_ADDRESS);
  console.log('BP_TOKEN_ADDRESS_1: ' + BP_TOKEN_ADDRESS_1);
  console.log('BP_TOKEN_ADDRESS_2: ' + BP_TOKEN_ADDRESS_2);
  console.log('UNISWAP_ADDRESS_STAKING: ' + UNISWAP_ADDRESS_STAKING);
  console.log('UNISWAP_ADDRESS_WETH: ' + UNISWAP_ADDRESS_WETH);
  console.log('TOMINOYA_CONTRACT_ADDRESS: ' + TOMINOYA_CONTRACT_ADDRESS);
  console.log('DECENTRAL_GAMES_EVENTS: ' + DECENTRAL_GAMES_EVENTS);
  console.log('COLLECTION_V2_ADDRESS: ' + COLLECTION_V2_ADDRESS);
  console.log('COLLECTION_PH_ADDRESS: ' + COLLECTION_PH_ADDRESS);
  console.log('COLLECTION_LINENS_ADDRESS: ' + COLLECTION_LINENS_ADDRESS);
  console.log('COLLECTION_BOMBER_ADDRESS: ' + COLLECTION_BOMBER_ADDRESS);
  console.log('ICE_TOKEN_ADDRESS: ' + ICE_TOKEN_ADDRESS);

  return {
    OWNER_WALLET_ADDRESS,
    WORKER_WALLET_ADDRESS,
    ROOT_TOKEN_ADDRESS_DAI,
    ROOT_TOKEN_ADDRESS_MANA,
    ROOT_TOKEN_ADDRESS_DG,
    ROOT_TOKEN_ADDRESS_DG_LIGHT,
    ROOT_TOKEN_ADDRESS_USDT,
    ROOT_TOKEN_ADDRESS_ATRI,
    ROOT_TOKEN_ADDRESS_ICE,
    ROOT_DG_LIGHT_BRIDGE_ADDRESS,
    ROOT_DG_TOWN_HALL_ADDRESS,
    CHILD_TOKEN_ADDRESS_DAI,
    CHILD_TOKEN_ADDRESS_MANA,
    CHILD_TOKEN_ADDRESS_DG,
    CHILD_TOKEN_ADDRESS_DG_LIGHT,
    CHILD_TOKEN_ADDRESS_USDT,
    CHILD_TOKEN_ADDRESS_ATRI,
    CHILD_TOKEN_ADDRESS_WETH,
    CHILD_TOKEN_ADDRESS_ICE,
    CHILD_DG_LIGHT_BRIDGE_ADDRESS,
    CHILD_TOKEN_XDG_ADDRESS,
    ROPSTEN_TOKEN_ADDRESS_DG,
    ROPSTEN_TOKEN_ADDRESS_DG_LIGHT,
    ROPSTEN_DG_LIGHT_BRIDGE_ADDRESS,
    ROPSTEN_DG_TOWN_HALL_ADDRESS,
    TREASURY_CONTRACT_ADDRESS,
    DG_POINTER_CONTRACT_ADDRESS,
    DG_POINTER_CONTRACT_ADDRESS_NEW,
    DG_STAKING_BALANCER_ADDRESS_1,
    DG_STAKING_BALANCER_ADDRESS_2,
    DG_STAKING_UNISWAP_ADDRESS,
    DG_STAKING_GOVERNANCE_ADDRESS,
    DG_KEEPER_CONTRACT_ADDRESS,
    ICE_REGISTRANT_ADDRESS,
    NON_ICE_REGISTRANT_COLLECTION_ADDRESS,
    NON_ICE_REGISTRANT_NFT_PURCHASER_ADDRESS,
    BP_TOKEN_ADDRESS_1,
    BP_TOKEN_ADDRESS_2,
    UNISWAP_ADDRESS_STAKING,
    UNISWAP_ADDRESS_WETH,
    TOMINOYA_CONTRACT_ADDRESS,
    DECENTRAL_GAMES_EVENTS,
    COLLECTION_V2_ADDRESS,
    COLLECTION_PH_ADDRESS,
    COLLECTION_LINENS_ADDRESS,
    COLLECTION_BOMBER_ADDRESS,
    COLLECTION_CRYPTO_DRIP_ADDRESS,
    COLLECTION_FOUNDING_FATHERS_ADDRESS,
    COLLECTION_JOKER_ADDRESS,
    COLLECTION_CHEF_ADDRESS,
    COLLECTION_BEACH_ADDRESS,
    COLLECTION_AIRLINE_ADDRESS,
    COLLECTION_POET_ADDRESS,
    COLLECTION_SPARTAN_ADDRESS,
    COLLECTION_CYBERPUNK_ADDRESS,
    COLLECTION_VIKING_ADDRESS,
    COLLECTION_MUTANT_ADDRESS,
    ICE_TOKEN_ADDRESS
  };
})();

const WEARABLES = [
  {
    title: 'Mutant Cartel',
    address: ADDRESSES.COLLECTION_MUTANT_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913548/ICE%20Mutant/Fit_1_cz4bcu.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913548/ICE%20Mutant/Fit_2_m9qjmn.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913548/ICE%20Mutant/Fit_3_r913ey.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913548/ICE%20Mutant/Fit_4_pbx2jk.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913548/ICE%20Mutant/Fit_5_kefk2l.png'
    ],
    details: {
      Hat: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913587/ICE%20Mutant%20%28Square%29/hat_m_1_saxhkh.png',
        'Mutant Cartel Hat',
        'Mutant Cartel',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1650913587/ICE%20Mutant%20%28Square%29/hat_m_1_saxhkh.png'
      ]
    }
  },
  {
    title: 'ICE Viking',
    address: ADDRESSES.COLLECTION_VIKING_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095253/ICE%20Viking/lvl1_ibacml.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095253/ICE%20Viking/lvl2_ipxadt.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095254/ICE%20Viking/lvl3_umlbsl.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095253/ICE%20Viking/lvl4_sd2omb.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095253/ICE%20Viking/lvl5_ini5fh.png'
    ],
    details: {
      Mjolnir: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095294/ICE%20Viking%20%28Square%29/Mjolnir_ICE_Level_1_mvaztb.png',
        'Mjolnir',
        'ICE Viking',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095294/ICE%20Viking%20%28Square%29/Mjolnir_ICE_Level_1_mvaztb.png'
      ],
      BerserkerHelmet: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095292/ICE%20Viking%20%28Square%29/Berserker_Helmet_ICE_Level_1_f6b5t4.png',
        'Berserker Helmet',
        'ICE Viking',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095292/ICE%20Viking%20%28Square%29/Berserker_Helmet_ICE_Level_1_f6b5t4.png'
      ],
      FenrisQuilt: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095291/ICE%20Viking%20%28Square%29/Fenris_Quilt_ICE_Level_1_j4vdbq.png',
        'Fenris Quilt',
        'ICE Viking',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095291/ICE%20Viking%20%28Square%29/Fenris_Quilt_ICE_Level_1_j4vdbq.png'
      ],
      RuneGarments: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095301/ICE%20Viking%20%28Square%29/Rune_Garments_ICE_Level_1_rcyzcx.png',
        'Rune Garments',
        'ICE Viking',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095301/ICE%20Viking%20%28Square%29/Rune_Garments_ICE_Level_1_rcyzcx.png'
      ],
      RavenBoots: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095297/ICE%20Viking%20%28Square%29/Raven_Boots_ICE_Level_1_ktq8ve.png',
        'Raven Boots',
        'ICE Viking',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1649095297/ICE%20Viking%20%28Square%29/Raven_Boots_ICE_Level_1_ktq8ve.png'
      ]
    }
  },
  {
    title: 'ICE Cyberpunk',
    address: ADDRESSES.COLLECTION_CYBERPUNK_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1647569973/ICE%20Cyberpunk%20Fit/fit_1_jwile7.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1647569973/ICE%20Cyberpunk%20Fit/fit_2_pmb7oq.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1647569973/ICE%20Cyberpunk%20Fit/fit_3_iuigql.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1647569973/ICE%20Cyberpunk%20Fit/fit_4_quopxr.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1647569973/ICE%20Cyberpunk%20Fit/fit_5_f73duj.png'
    ],
    details: {
      Richard: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570030/ICE%20Cyberpunk%20%28Square%29/Richard_ICE_Level_1_k5i64r.png',
        'Richard',
        'ICE Cyberpunk',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570030/ICE%20Cyberpunk%20%28Square%29/Richard_ICE_Level_1_k5i64r.png'
      ],
      GweiMask: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570023/ICE%20Cyberpunk%20%28Square%29/Gwei_Mask_ICE_Level_1_g5kbyn.png',
        'Gwei Mask',
        'ICE Cyberpunk',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570023/ICE%20Cyberpunk%20%28Square%29/Gwei_Mask_ICE_Level_1_g5kbyn.png'
      ],
      SynthJacket: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570031/ICE%20Cyberpunk%20%28Square%29/Synth_Jacket_ICE_Level_1_s6fmhj.png',
        'Synth Jacket',
        'ICE Cyberpunk',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570031/ICE%20Cyberpunk%20%28Square%29/Synth_Jacket_ICE_Level_1_s6fmhj.png'
      ],
      BionicLegs: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570023/ICE%20Cyberpunk%20%28Square%29/Bionic_Legs_ICE_Level_1_dxibrf.png',
        'Bionic Legs',
        'ICE Cyberpunk',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570023/ICE%20Cyberpunk%20%28Square%29/Bionic_Legs_ICE_Level_1_dxibrf.png'
      ],
      HyronShoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570026/ICE%20Cyberpunk%20%28Square%29/Hyron_Shoes_ICE_Level_1_k0y9k9.png',
        'Hyron Shoes',
        'ICE Cyberpunk',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1647570026/ICE%20Cyberpunk%20%28Square%29/Hyron_Shoes_ICE_Level_1_k0y9k9.png'
      ]
    }
  },
  {
    title: 'ICE Spartan',
    address: ADDRESSES.COLLECTION_SPARTAN_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356529/ICE%20Spartan/Fit_1_n972jm.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356529/ICE%20Spartan/Fit_2_gdyyst.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356530/ICE%20Spartan/Fit_3_lll2uc.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356529/ICE%20Spartan/Fit_4_ostjpj.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356530/ICE%20Spartan/Fit_5_x5vyfa.png'
    ],
    details: {
      Apsis: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356622/ICE%20Spartan%20%28Square%29/shield_1_bxhxy5.png',
        'Apsis',
        'ICE Spartan',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356622/ICE%20Spartan%20%28Square%29/shield_1_bxhxy5.png'
      ],
      Galea: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356608/ICE%20Spartan%20%28Square%29/helmet_m_1_vuqtnk.png',
        'Galea',
        'ICE Spartan',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356608/ICE%20Spartan%20%28Square%29/helmet_m_1_vuqtnk.png'
      ],
      Linothorax: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356628/ICE%20Spartan%20%28Square%29/upperbody_m_1_tsdqjf.png',
        'Linothorax',
        'ICE Spartan',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356628/ICE%20Spartan%20%28Square%29/upperbody_m_1_tsdqjf.png'
      ],
      Pteruges: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356614/ICE%20Spartan%20%28Square%29/lowerbody_m_1_j6xmht.png',
        'Pteruges',
        'ICE Spartan',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356614/ICE%20Spartan%20%28Square%29/lowerbody_m_1_j6xmht.png'
      ],
      Soleae: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356620/ICE%20Spartan%20%28Square%29/shoes_1_f2vq9v.png',
        'Soleae',
        'ICE Spartan',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1646356620/ICE%20Spartan%20%28Square%29/shoes_1_f2vq9v.png'
      ]
    }
  },
  {
    title: 'ICE Poet',
    address: ADDRESSES.COLLECTION_POET_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_1_bzdlbm.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_2_wbssai.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_3_naqye8.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_4_ndrkvo.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_5_inpdfb.png'
    ],
    details: {
      SonnetShades: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863934/ICE%20Poet%20%28Square%29/glasses_1_uf5elp.png',
        'Sonnet Shades',
        'ICE Poet',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863934/ICE%20Poet%20%28Square%29/glasses_1_uf5elp.png'
      ],
      Beret: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/hat_1_fnlgwr.png',
        'Beret',
        'ICE Poet',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/hat_1_fnlgwr.png'
      ],
      TurtleNeck: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863938/ICE%20Poet%20%28Square%29/shirt_1_enafi5.png',
        'Turtle Neck',
        'ICE Poet',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863938/ICE%20Poet%20%28Square%29/shirt_1_enafi5.png'
      ],
      FunPants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/pants_1_bnff1n.png',
        'Fun Pants',
        'ICE Poet',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/pants_1_bnff1n.png'
      ],
      HighTops: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863939/ICE%20Poet%20%28Square%29/shoes_1_g2aihx.png',
        'High Tops',
        'ICE Poet',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863939/ICE%20Poet%20%28Square%29/shoes_1_g2aihx.png'
      ]
    }
  },
  {
    title: 'ICE Airlines',
    address: ADDRESSES.COLLECTION_AIRLINE_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643990279/ICE%20Airline/Male_1_y5pwpl.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943842/ICE%20Airline/Male_2_lxjgby.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943842/ICE%20Airline/Male_3_fq4hpz.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1644333351/ICE%20Airline/Male_4_ocxjnq.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943842/ICE%20Airline/Male_5_dz5iz9.png'
    ],
    details: {
      PilotGogs: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943931/ICE%20Airline/glasses_1_qtofuw.png',
        'Pilot Gogs',
        'ICE Airlines',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943931/ICE%20Airline/glasses_1_qtofuw.png'
      ],
      PilotHat: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943933/ICE%20Airline/hat_m_1_hgkx5l.png',
        'Pilot Hat',
        'ICE Airlines',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943933/ICE%20Airline/hat_m_1_hgkx5l.png'
      ],
      PilotShirt: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943937/ICE%20Airline/upperrbody_m_1_kcrpod.png',
        'Pilot Shirt',
        'ICE Airlines',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943937/ICE%20Airline/upperrbody_m_1_kcrpod.png'
      ],
      PilotPants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943935/ICE%20Airline/lowerbody_m_1_jmsfwd.png',
        'Pilot Pants',
        'ICE Airlines',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943935/ICE%20Airline/lowerbody_m_1_jmsfwd.png'
      ],
      PilotBoot: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943936/ICE%20Airline/shoes_1_dm1ovx.png',
        'Pilot Boot',
        'ICE Airlines',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943936/ICE%20Airline/shoes_1_dm1ovx.png'
      ]
    }
  },
  {
    title: 'ICE Beach Club',
    address: ADDRESSES.COLLECTION_BEACH_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_1_nbm1oh.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_2_ii0ffb.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_3_zq64sh.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_4_a2vfsw.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_5_up7kdg.png'
    ],
    details: {
      TintShades: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159176/glasses_1_eiuee1.png',
        'Tint Shades',
        'ICE Beach Club',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159176/glasses_1_eiuee1.png'
      ],
      BeachFedora: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/hat_M_1_mkessn.png',
        'Beach Fedora',
        'ICE Beach Club',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/hat_M_1_mkessn.png'
      ],
      PartyShirt: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/shirt_M_1_m1yfk1.png',
        'Party Shirt',
        'ICE Beach Club',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/shirt_M_1_m1yfk1.png'
      ],
      Boardies: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159179/shorts1_aesu2u.png',
        'Boardies',
        'ICE Beach Club',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159179/shorts1_aesu2u.png'
      ],
      BeachSlides: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159180/shoes1_iywurc.png',
        'Beach Slides',
        'ICE Beach Club',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159180/shoes1_iywurc.png'
      ]
    }
  },
  {
    title: 'ICE Chef',
    address: ADDRESSES.COLLECTION_CHEF_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit1_ehvzqa.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit2_gomdcv.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit3_te6dxo.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit4_rur3j0.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit5_xchgms.png'
    ],
    details: {
      StarRating: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/star_1_obbp5w.png',
        'Star Rating',
        'ICE Chef',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/star_1_obbp5w.png'
      ],
      ToqueBlanche: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686093/hat_m_1_rcdevg.png',
        'Toque Blanche',
        'ICE Chef',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686093/hat_m_1_rcdevg.png'
      ],
      ChefTop: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/upperbody_m_1_llgrz7.png',
        "Chef's Top",
        'ICE Chef',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/upperbody_m_1_llgrz7.png'
      ],
      ChefApron: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/lowerbody_m_1_u7mlil.png',
        "Chef's Apron",
        'ICE Chef',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/lowerbody_m_1_u7mlil.png'
      ],
      Nonslips: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/shoes_1_tnfrpa.png',
        'Nonslips',
        'ICE Chef',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/shoes_1_tnfrpa.png'
      ]
    }
  },
  {
    title: 'ICE Joker',
    address: ADDRESSES.COLLECTION_JOKER_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569807/Fit_1_zw1bwd.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569807/Fit_2_pplvph.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569807/Fit_3_mkggnr.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569808/Fit_4_fktcat.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569808/Fit_5_z5ysrm.png'
    ],
    details: {
      JokerBauble: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/staff1_ld2xnm.jpg',
        'Joker Bauble',
        'ICE Joker',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/staff1_ld2xnm.jpg'
      ],
      JokerCap: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/hat1_qpw84y.jpg',
        "Cap'N'Bells",
        'ICE Joker',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/hat1_qpw84y.jpg'
      ],
      JokerRuffle: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/upperbody_f_1_tnvzse.jpg',
        'Joker Ruffle',
        'ICE Joker',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/upperbody_f_1_tnvzse.jpg'
      ],
      JokerSkirt: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569826/lowerbody_m1_qwvegm.jpg',
        'Joker Skirt',
        'ICE Joker',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569826/lowerbody_m1_qwvegm.jpg'
      ],
      JokerWinklepickers: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/feet1_jb7qey.jpg',
        'Winklepickers',
        'ICE Joker',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/feet1_jb7qey.jpg'
      ]
    }
  },
  {
    title: 'Founding Fathers',
    address: ADDRESSES.COLLECTION_FOUNDING_FATHERS_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_1_fvhl6y.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_2_pqzdsy.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_3_yloaxi.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_4_zn5mqz.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_5_cnndmr.png'
    ],
    details: {
      Feather: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116020/feather_level_1_rd61am.png',
        'Father Feather',
        'Founding Fathers',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116020/feather_level_1_rd61am.png'
      ],
      Flow: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116025/hair_level_1_dampks.png',
        'Father Flow',
        'Founding Fathers',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116025/hair_level_1_dampks.png'
      ],
      Frock: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116021/coat_level_1_ivacwe.png',
        'Father Frock',
        'Founding Fathers',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116021/coat_level_1_ivacwe.png'
      ],
      Breeches: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116030/pants_level_1_srgdhc.png',
        'Father Breeches',
        'Founding Fathers',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116030/pants_level_1_srgdhc.png'
      ],
      Shoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116026/mules_level_1_u7jgmh.png',
        'Father Mules',
        'Founding Fathers',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116026/mules_level_1_u7jgmh.png'
      ]
    }
  },
  {
    title: 'Crypto Drip',
    address: ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984404/CryptoDrip_Level_1_nbpz6x.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984401/CryptoDrip_Level_2_nigfx7.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984405/CryptoDrip_Level_3_nsemyd.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984404/CryptoDrip_Level_4_es8z5p.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984404/CryptoDrip_Level_5_d41jkl.png'
    ],
    details: {
      Glasses: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984495/Glasses_Level_1_sn5dnw.png',
        'Drip Shades',
        'Crypto Drip',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984495/Glasses_Level_1_sn5dnw.png'
      ],
      Hat: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984493/Hat_level_1_vxxht6.png',
        'Drip Bucket',
        'Crypto Drip',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984493/Hat_level_1_vxxht6.png'
      ],
      Jacket: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984503/puffer_level_1_nimjkk.png',
        'Drip Jacket',
        'Crypto Drip',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984503/puffer_level_1_nimjkk.png'
      ],
      Pants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984500/pants_level_1_f4xcuo.png',
        'Drip Drawers',
        'Crypto Drip',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984500/pants_level_1_f4xcuo.png'
      ],
      Shoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984504/Shoes_Level_1_jbsjgf.png',
        'Drip Kicks',
        'Crypto Drip',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984504/Shoes_Level_1_jbsjgf.png'
      ]
    }
  },
  {
    title: 'Bomber',
    address: ADDRESSES.COLLECTION_BOMBER_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_1_aqjlun.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_2_eg3o0c.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_3_sxwgci.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_4_ad2vxh.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_5_ixqifi.png'
    ],
    details: {
      Glasses: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091240/Bomber%20Fit/glasses_grey_qmjxqp.png',
        'Bomber Glasses',
        'Bomber',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091240/Bomber%20Fit/glasses_grey_qmjxqp.png'
      ],
      Hat: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091241/Bomber%20Fit/hat_grey_m_ptl8se.png',
        'Bomber Hat',
        'Bomber',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091241/Bomber%20Fit/hat_grey_m_ptl8se.png'
      ],
      Top: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/upperbody_grey_m_exs6ms.png',
        'Bomber Jacket',
        'Bomber',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/upperbody_grey_m_exs6ms.png'
      ],
      Pants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091242/Bomber%20Fit/pants_grey_m_zfrety.png',
        'Bomber Pants',
        'Bomber',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091242/Bomber%20Fit/pants_grey_m_zfrety.png'
      ],
      Shoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/shoes_grey_gftpjo.png',
        'Bomber Shoes',
        'Bomber',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/shoes_grey_gftpjo.png'
      ]
    }
  },
  {
    title: 'Linen',
    address: ADDRESSES.COLLECTION_LINENS_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088369/Linens_1_hqogna.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_2_s3wrak.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088369/Linens_3_qrbcbx.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_4_jgqlue.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_5_vplmii.png'
    ],
    details: {
      Cigar: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091411/Linen%20Fit/pipe_grery_lhnu6p.png',
        'XL Pipe',
        'Linen',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091411/Linen%20Fit/pipe_grery_lhnu6p.png'
      ],
      Hat: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091409/Linen%20Fit/hat_grey_m_m8dbi3.png',
        'Boater Hat',
        'Linen',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091409/Linen%20Fit/hat_grey_m_m8dbi3.png'
      ],
      Top: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091412/Linen%20Fit/shirt_grey_m_e61mwo.png',
        'Linen Shirt',
        'Linen',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091412/Linen%20Fit/shirt_grey_m_e61mwo.png'
      ],
      Pants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091410/Linen%20Fit/pants_grey_m_ofahds.png',
        'Linen Pants',
        'Linen',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091410/Linen%20Fit/pants_grey_m_ofahds.png'
      ],
      Shoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091413/Linen%20Fit/shoes_grey_mkdkto.png',
        'Boater Shoes',
        'Linen',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091413/Linen%20Fit/shoes_grey_mkdkto.png'
      ]
    }
  },
  {
    title: 'Party Host',
    address: ADDRESSES.COLLECTION_PH_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_1_Hugh_mwzapj.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054315/Level_2_Hugh_t2g9tc.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_3_Hugh_nhbkdo.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_4_Hugh_jwxah3.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_5_Hugh_ogwkwo.png'
    ],
    details: {
      Glasses: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Shades_Level_1_x4axck.png',
        'Smoking Glasses',
        'Party Host',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg'
      ],
      Hat: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133628/Sailor-Hat-_Level-1_jq3fnn.png',
        'Captains Hat',
        'Party Host',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg'
      ],
      SmokingJacket: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133628/Smoking_Jacket_Level_1_h8khui.png',
        'Smoking Jacket',
        'Party Host',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg'
      ],
      Pants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Pants_Level_1_y4iyir.png',
        'Smoking Pants',
        'Party Host',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg'
      ],
      Shoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Slippers_Level_1_pmeiq1.png',
        'Slippers',
        'Party Host',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg'
      ]
    }
  },
  {
    title: 'DG Suit',
    address: ADDRESSES.COLLECTION_V2_ADDRESS,
    preview: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_1_h5zizs.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_2_y8onmu.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_3_xhaxho.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_4_uribpq.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_5_mmcqjy.png'
    ],
    details: {
      Glasses: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_money_shades_rank1_eyewear_knm0f4.png',
        'Shades',
        'DG Suit',
        'Accessory',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg'
      ],
      Cigar: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_cigar_rank1_eyewear_lk5lnu.png',
        'Cigar',
        'DG Suit',
        'Head',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg'
      ],
      Top: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_top_rank1_upper_body_qlnqky.png',
        'Blazer',
        'DG Suit',
        'Torso',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg'
      ],
      Pants: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_bottom_rank1_lower_body_trd5yw.png',
        'Trousers',
        'DG Suit',
        'Legs',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg'
      ],
      Shoes: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_dress_rank1_shoes_feet_w7ncwa.png',
        'Loafers',
        'DG Suit',
        'Feet',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg'
      ]
    }
  }
];

export default {
  KEYS,
  CONSTANTS,
  ADDRESSES,
  WEARABLES
};
