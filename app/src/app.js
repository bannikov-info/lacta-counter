(function () {
  'use strict';

  angular
      .module('App', ['ngMaterial', 'mdLetterAvatar', 'lacta-counter'])
      .config(function($mdThemingProvider, $mdIconProvider){

          $mdIconProvider
              .defaultIconSet("./assets/svg/avatars.svg", 128)
              .icon("menu"       , "./assets/svg/menu.svg"        , 24)
              .icon("share"      , "./assets/svg/share.svg"       , 24)
              .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
              .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
              .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
              .icon("phone"      , "./assets/svg/phone.svg"       , 512)
              .icon('lactation:add', './assets/svg/ic_add_white_24px.svg', 24)
              .icon('lactation:add-done', './assets/svg/ic_done_white_24px.svg', 48);

              $mdThemingProvider.theme('default')
                  .primaryPalette('light-blue')
                  .accentPalette('pink');

      });
})();
