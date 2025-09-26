(function() {
  const BASE_URL = `http://localhost:3000/scripttag`;

  const scriptElement = document.createElement("script");
  scriptElement.type = 'text/javascript';
  scriptElement.async = !0;
  scriptElement.src = `${BASE_URL}/avada-sale-pop.min.js`;
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(scriptElement, firstScript);
})();
