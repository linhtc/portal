(function() {
  // Notifications Drawer
  const notificationDrawerEl = document.querySelector('#notifications-drawer');
  const notificationDrawer = new mdc.drawer.MDCTemporaryDrawer(notificationDrawerEl);

  document.querySelector('#portal-top-toolbar-notification-icon').addEventListener('click', function() {
    notificationDrawer.open = true;
  });
  document.querySelector('.portal-drawer-notification-collapse-icon').addEventListener('click', function(e) {
    notificationDrawer.open = false;
    e.preventDefault();
  });

  // Notification sidenav tabs
  const notificationTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#notification-tab-bar'));
  notificationTabBar.layout();
  notificationTabBar.listen('MDCTabBar:change', function (t) {
    const panelTabBar = t.detail;
    const index = panelTabBar.activeTabIndex;
    const panels = document.querySelector('#notification-panels');
    portalUpdateTabPanels(panels, index);
  });

  function portalUpdateTabPanels(panels, index) {
    const activePanel = panels.querySelector('.portal-tab-panel.portal-tab-panel--active');
    if (activePanel) {
      activePanel.classList.remove('portal-tab-panel--active');
    }
    const newActivePanel = panels.querySelector('.portal-tab-panel:nth-child(' + (index + 1) + ')');
    if (newActivePanel) {
      newActivePanel.classList.add('portal-tab-panel--active');
    }
  }

  const body = document.getElementsByTagName('body').item(0);
  // We need to relayout all tabs when switching to rtl.
  body.addEventListener('portalDirectionChanged', function () {
    notificationTabBar.layout();
  });
})();
