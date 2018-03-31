(function () {
  // Layout menu.
  const layoutMenuEl = document.querySelector('#portal-layout-menu');
  if (layoutMenuEl !== null) {
    // Create layout menu.
    const layoutMenu = new mdc.menu.MDCMenu(layoutMenuEl);
    layoutMenu.setAnchorCorner(mdc.menu.MDCMenuFoundation.Corner.BOTTOM_START);
    // Set listener for opening menu.
    document.querySelector('#portal-layout-menu-button').addEventListener('click', function() {
      layoutMenu.open = !layoutMenu.open;
    });
  }

  // Theme menu.
  const themeMenuEl = document.querySelector('#portal-theme-menu');
  if (layoutMenuEl !== null) {
    const themeMenu = new mdc.menu.MDCMenu(themeMenuEl);
    document.querySelector('#portal-theme-menu-button').addEventListener('click', function() {
      themeMenu.open = !themeMenu.open;
    });
    // Set Anchor Corner to Bottom End
    themeMenu.setAnchorCorner(mdc.menu.MDCMenuFoundation.Corner.BOTTOM_START);

    themeMenuEl.addEventListener('MDCMenu:selected', function(evt) {
      // Switch theme
      const themeID = evt.detail.item.id;
      switchTheme(themeID);
      // Store theme.
      sessionStorage.setItem('portal-html-theme', themeID);
      // Dispatch event to update the charts
      const body = document.getElementsByTagName('body').item(0);
      const event = new Event('portalThemeChanged');
      setTimeout(function() {
        body.dispatchEvent(event);
      }, 500);
    });
  }

  // Check if theme has been stored in session.
  const themeID = sessionStorage.getItem('portal-html-theme');
  if (themeID) {
    switchTheme(themeID);
  }

  function switchTheme(themeID) {
    const stylesheetLink = document.querySelector('#portal-stylesheet');
    const currentStylesheetFilename = stylesheetLink.href.substring(stylesheetLink.href.lastIndexOf('/') + 1);
    const newStylesheetURL = stylesheetLink.href.replace(currentStylesheetFilename, themeID + '.css');
    const head = document.getElementsByTagName('head').item(0);
    const newlink = document.createElement('link');

    // Create new link.
    newlink.setAttribute('rel', 'stylesheet');
    newlink.setAttribute('type', 'text/css');
    newlink.setAttribute('href', newStylesheetURL);
    // Add new link to head.
    head.appendChild(newlink, stylesheetLink);
    // Add load listener to remove old CSS link.
    newlink.addEventListener('load', function() {
      // Remove old CSS link.
      head.removeChild(stylesheetLink);
      // Set new link to use id.
      newlink.setAttribute('id', 'portal-stylesheet');
    });
  }

  const rtlSwitch = document.getElementById('rtl-switch');
  if (rtlSwitch !== null) {
    mdc.iconToggle.MDCIconToggle.attachTo(rtlSwitch);
    rtlSwitch.addEventListener('MDCIconToggle:change', function(evt) {
      document.documentElement.dir = evt.detail.isOn ? 'rtl' : 'ltr';
      // Dispatch event to reload the tabs
      const body = document.getElementsByTagName('body').item(0);
      const event = new Event('portalDirectionChanged');
      body.dispatchEvent(event);
    });
  }
})();
