(function () {
  "use strict";

  var CONSENT_KEY = "cookie-consent"; // "granted" | "denied"
  var GA_ID = "G-XXXXXXXXXX"; // troque pelo seu ID do Google Analytics
  var ADSENSE_CLIENT = document.querySelector('meta[name="google-adsense-account"]');
  var ADSENSE_ID = ADSENSE_CLIENT ? ADSENSE_CLIENT.getAttribute("content") : null;

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* localStorage indisponível: o site continua funcionando sem lembrar a escolha */
    }
  }

  function loadThirdPartyScripts() {
    if (window.__thirdPartyLoaded) return;
    window.__thirdPartyLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });

    var urls = ["https://www.googletagmanager.com/gtag/js?id=" + GA_ID];
    if (ADSENSE_ID) {
      urls.push(
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_ID
      );
    }

    urls.forEach(function (src) {
      var s = document.createElement("script");
      s.async = true;
      s.src = src;
      document.head.appendChild(s);
    });
  }

  function scheduleLoad() {
    var fired = false;
    function fire() {
      if (fired) return;
      fired = true;
      ["scroll", "mousemove", "touchstart", "keydown"].forEach(function (evt) {
        document.removeEventListener(evt, fire);
      });
      loadThirdPartyScripts();
    }
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(fire, 3500);
    });
    ["scroll", "mousemove", "touchstart", "keydown"].forEach(function (evt) {
      document.addEventListener(evt, fire, { passive: true });
    });
  }

  function showBanner() {
    var banner = document.getElementById("cookie-banner");
    if (!banner) return;
    banner.hidden = false;

    var acceptBtn = document.getElementById("cookie-accept");
    var rejectBtn = document.getElementById("cookie-reject");

    acceptBtn.addEventListener("click", function () {
      setConsent("granted");
      banner.hidden = true;
      scheduleLoad();
    });

    rejectBtn.addEventListener("click", function () {
      setConsent("denied");
      banner.hidden = true;
    });
  }

  var consent = getConsent();
  if (consent === "granted") {
    scheduleLoad();
  } else if (consent === "denied") {
    // Não carrega scripts de terceiros; site continua 100% funcional.
  } else {
    document.addEventListener("DOMContentLoaded", showBanner);
  }
})();
