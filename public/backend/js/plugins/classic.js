(function() {
  // Left Drawer.
  const leftDrawerEL = document.querySelector('#left-drawer');
  const mq = window.matchMedia('(min-width: 960px)');
  // Toolbar burger icon.
  const burgerIcon = document.querySelector('#portal-top-toolbar-burger-icon');
  // Sidemenu close icon.
  const closeIcon = document.querySelector('#portal-sidemenu-close-icon');

  // We change drawer type depending on device.
  let leftDrawer;
  if (mq.matches) {
    // Persistant drawer on desktop.
    leftDrawer = new mdc.drawer.MDCPersistentDrawer(leftDrawerEL);
  } else {
    // Temporary drawer on mobile.
    leftDrawerEL.classList.remove('mdc-drawer--persistent', 'mdc-drawer--open');
    leftDrawerEL.classList.add('mdc-drawer--temporary', 'mdc-drawer--closed');
    leftDrawer = new mdc.drawer.MDCTemporaryDrawer(leftDrawerEL);
    // Show menu
    burgerIcon.style.display = 'block';
  }

  // Toggle menu when burger menu is clicked.
  burgerIcon.addEventListener('click', function(e) {
    leftDrawer.open = !leftDrawer.open;
    e.preventDefault();
  });

  // Toggle menu when close sidemenu icon is clicked.
  closeIcon.addEventListener('click', function(e) {
    leftDrawer.open = !leftDrawer.open;
    e.preventDefault();
  });

  // Watch for changes to the drawer and show and hide burger icon.
  leftDrawerEL.addEventListener('MDCPersistentDrawer:open', function() {
    burgerIcon.style.display = 'none'
  });
  leftDrawerEL.addEventListener('MDCPersistentDrawer:close', function() {
    burgerIcon.style.display = 'block'
  });

  const tfRoot = document.querySelectorAll('.portal-navigation-list__item');
  for (let i = 0; i < tfRoot.length; i++) {
    tfRoot[i].addEventListener('click', function(e) {
      if (/#/.test(this.href)) {
        e.preventDefault();
        this.classList.toggle('portal-navigation-list__item--open');
      }
    });
  }
  // Opens the menu dropdown when page is loaded depending on the page you are on.
  const activatedParentSibling = document.querySelector('.mdc-list-item--activated').parentElement.previousElementSibling;
  if (activatedParentSibling) {
    activatedParentSibling.classList.add('portal-navigation-list__item--open');
  }
})();
