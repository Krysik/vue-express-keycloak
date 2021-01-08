import Vue from 'vue';
import App from './App.vue';
import Keycloak from 'keycloak-js';

Vue.config.productionTip = false;

const kcOptions = {
  url: process.env.VUE_APP_KEYCLOAK_URL,
  realm: process.env.VUE_APP_REALM,
  clientId: process.env.VUE_APP_CLIENT_ID,
  onLoad: 'login-required',
};

const keycloak = Keycloak(kcOptions);
keycloak.init({
  onLoad: kcOptions.onLoad
}).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.info("Authenticated");
    sessionStorage.setItem('token', keycloak.token);
    new Vue({
      render: (h) => h(App, {
        props: {
          keycloak
        }
      }),
    }).$mount('#app');
  }



  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        console.info('Token refreshed' + refreshed);
      } else {
        console.warn('Token not refreshed, valid for ' +
          Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date()
            .getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      console.error('Failed to refresh token');
    });
  }, 300000)
}).catch((err) => {
  console.log(err);
  console.error("Authenticated Failed");
});
