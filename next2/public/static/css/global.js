import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body,
  div.ui.grid.balances-container,
  .post__content,
  .read-next-div {
    background: ${({ theme }) => theme.body};
  }
  .spinner-animation-div {
    margin-top: -2px;
  }
  .avatar-picture.main {
    border: ${({ theme }) => theme.globalDividers};
    border-radius: 100%;
  }
  .snow,
  .black,
  .full-white {
    background: ${({ theme }) => theme.loader} !important;
  }
  .zoom-animation {
    border: ${({ theme }) => theme.zoom};
  }
  .ui.action.input > .button, 
  .ui.action.input > .buttons {
    background-color: ${({ theme }) => theme.body} !important;
    color: ${({ theme }) => theme.text} !important;
    border: ${({ theme }) => theme.globalDividers} !important;
  }
  h1, h2, h3, h4, h5, p, 
  .table-header-text,
  .table-header-text-1,
  .table-header-text-2,
  .table-body-text-1,
  .table-body-text-2.games,
  .blogdetail-page-container .post__content li,
  i.twitter.square.icon.share-icon,
  i.facebook.icon.share-icon,
  i.linkedin.icon.share-icon,
  #mobile-menu-icon,
  .account-select,
  div.divider.text,
  .more-text,
  .spanbox,
  .matic-header-text,
  .menu-info-close,
  .mailchimp-close,
  .hljs,
  .mailchimp-other-inner-p.subtext,
  .ui.checkbox+label, 
  .ui.checkbox label,
  .nft-other-h3 {
    color: ${({ theme }) => theme.text} !important;
  }
  .bpt-text {
    color: ${({ theme }) => theme.bptText} !important;
  }
  .hljs {
    border-left: ${({ theme }) => theme.codeBorder} !important;
  }
  .ui.divider.widget-divider {
    border-top: ${({ theme }) => theme.widgetDivider} !important;  
  }
  .ui.divider.tab-divider,
  .ui.divider.coin-select-divider,
  .ui.divider#blog-divider {
    border-color: ${({ theme }) => theme.darkModeDivider} !important;
  }
  .home-dashboard-p,
  .home-dashboard-mission,
  .home-dashboard-h2,
  .featured-casino-text,
  .home-dashboard-h1,
  .home-dashboard-main-h1,
  .right-menu-text,
  .deposit-message-text,
  .leaders-text {
    color: ${({ theme }) => theme.homeText} !important;  
  }

  .my-nft-container,
  .dg-powered-container,
  .treasury-container,
  .balances-column,
  .featured-blog-container,
  .DG-column,
  .DG-column-treasury,
  .read-next-button:first-child,
  .read-next-button:last-child,
  .admin-balances-column,
  div.visible.menu.transition,
  .hljs,
  code strong, kbd, samp,
  #airdrop-number-1,
  #airdrop-number-2,
  .post-info.featured {
    background: ${({ theme }) => theme.card};
  }
  .poap-pic {
    border-radius: 100%;
    border: ${({ theme }) => theme.cardBorder};
    box-shadow: ${({ theme }) => theme.boxShadow};
  }
  .tutorial-info,
  .tutorial-info-2 {
    background: ${({ theme }) => theme.tutorialColor};
    color: ${({ theme }) => theme.text} !important;
  }
  #snapshot {
    background: ${({ theme }) => theme.body};
    border: ${({ theme }) => theme.cardBorder};
    box-shadow: ${({ theme }) => theme.boxShadow} !important;
  }
  .ui.modal,
  .matic-overlay,
  .mailchimp-outter-container {
    background: black;
    box-shadow: none !important;  
    border-radius: 16px !important;
  }
  .ui.bottom.right.popup,
  .ui.popup {
    background: ${({ theme }) => theme.card};
    border: ${({ theme }) => theme.cardBorder};
    box-shadow: ${({ theme }) => theme.boxShadow} !important; 
  }
  .ui.bottom.right.popup:before {
    background: ${({ theme }) => theme.card};
    box-shadow: none !important; 
  }
  .menu-info-container {
    background: black; 
  }
  .matic-widget-button,
  .matic-widget-button-2 {
    background: ${({ theme }) => theme.modalCard};
    border: ${({ theme }) => theme.cardBorder};
    box-shadow: ${({ theme }) => theme.boxShadow} !important; 
  }
  .ui.dropdown .menu > .item:hover,
  .account-table {
    background: ${({ theme }) => theme.card};
  }
  a.ui.button.read-next-button {
    background: ${({ theme }) => theme.card} !important;
    color: ${({ theme }) => theme.text} !important;
  }
  .welcome-text,
  .welcome-text-2,
  .earned-text,
  .read-next-button:first-child:before,
  .read-next-button:last-child:before,
  #pool-select-icon,
  .menu-info-label,
  .account-other-inner-p {
    color: ${({ theme }) => theme.offColorText} !important;   
  }
  i.info.circle.icon.dai-mana-icon {
    color: #ffffff99;
    margin-top: -4px;
    font-size: 8px !important;
  }
  i.info.circle.icon.dai-mana-icon:hover {
    cursor: pointer;
  }
  .featured-blog-grid,
  .ui.dropdown .menu > .active.item, {
    background: ${({ theme }) => theme.card} !important;
  }
  .ui.visible.top.overlay.sidebar,
  div.ui.vertical.labeled.icon.ui.overlay.top.sidebar.menu,
  .menu-container.blog {
    background: ${({ theme }) => theme.menuColor};
    box-shadow: ${({ theme }) => theme.boxShadow};
  }
  .dashboard-menu-container#top,
  .menu-container-dark.blog,
  .other-menu-container.blog {
    opacity: 1;
    transition: all 0.25s;
    -webkit-transition: all 0.25s;
    background-color: black !important;
    border-bottom: 1px solid rgb(21,24,28);
    padding-bottom: 2px;
  }
  div#home-mobile-background.ui.vertical.labeled.icon.ui.overlay.top.sidebar.menu {
    background: ${({ theme }) => theme.homeMenuColor} !important;
    box-shadow: ${({ theme }) => theme.homeBoxShadow};
    border-bottom: ${({ theme }) => theme.homeDivider};
  }
  .ui.visible.top.overlay.sidebar,
  div.ui.vertical.labeled.icon.ui.overlay.top.sidebar.menu {
    border-bottom: ${({ theme }) => theme.globalDividers};
  }
  .account-hover.active,
  .account-hover:hover,
  #dropdown-more-items:hover,
  .ui.dropdown .menu > .active.item span.text,
  .ui.dropdown .menu > .item:hover span.text {
    color: ${({ theme }) => theme.text} !important;
  }
  .sidebar-menu-text.blog#active,
  .sidebar-menu-text.blog:hover {
    color: ${({ theme }) => theme.text} !important;
  }
  .sidebar-menu-text.blog,
  .account-hover,
  .ui.dropdown .menu > .item span.text,
  .dropdown-icon,
  #dropdown-more-items,
  #dropdown-menu-items,
  #dropdown-more-items-theme,
  #sun-icon,
  #moon-icon {
    color: ${({ theme }) => theme.menuText} !important;
  }
  #dropdown-menu-items:hover {
    background: ${({ theme }) => theme.infoColor};
  }
  .ui.divider {
    border-top: ${({ theme }) => theme.globalDividers} !important;
  }
  .gameplay-left-column {
    border-right: ${({ theme }) => theme.globalDividers};
  }
  .account-select.play,
  .account-select.mana,
  .account-select.dai {
    background: ${({ theme }) => theme.leaderboardSelect};   
  }
  .table-header,
  .post-date-blogdetail{
    background: ${({ theme }) => theme.infoColor};
    color: ${({ theme }) => theme.text} !important;
  }

  .games-container,
  .shop-container,
  .nft-container {
    border: 1px solid rgba(42, 42, 42, 1);
    border-radius: 16px;
  }
`;