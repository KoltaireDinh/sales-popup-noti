import {insertAfter} from '../helpers/insertHelpers';
import {render} from 'preact';
import React from 'preact/compat';
import NotificationPopup from '../components/NotificationPopup/NotificationPopup';

export default class DisplayManager {
  constructor() {
    this.notifications = [];
    this.settings = {};
  }

  async initialize({notifications, settings}) {
    this.notifications = notifications;
    this.settings = settings;

    if (!this.shouldDisplay()) {
      console.log('Pop up cant be displayed at this URL');
      return;
    }
    this.insertContainer();

    const maxPops = Number(this.settings.maxPopsDisplay) || this.notifications.length;
    const notificationsToShow = this.notifications.slice(0, maxPops);
    console.log(maxPops, notificationsToShow);

    await this.timeout(this.settings.firstDelay);
    for (const notification of notificationsToShow) {
      await this.displayOneNotification(notification);
    }
  }
  async displayOneNotification(notification) {
    this.display(notification);
    await this.timeout(this.settings.displayDuration);
    this.fadeOut();
    await this.timeout(this.settings.popsInterval);
  }

  async timeout(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    if (container) {
      render(null, container);
    }
  }
  display(notification) {
    const container = document.querySelector('#Avada-SalePop');
    if (container) {
      const notificationPopup = React.createElement(NotificationPopup, {
        ...notification,
        settings: this.settings,
      });
      console.log(this.settings)
      render(notificationPopup, container);
    }
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add(`Avada-SalePop__OuterWrapper`)
    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      insertAfter(popupEl, targetEl);
    }
    return popupEl;
  }

  shouldDisplay() {
    const currentUrl = window.location.href;
    const includedUrls = this.settings.includedUrls ? this.settings.includedUrls.split('\n').map(url => url.trim()) : [];
    const excludedUrls = this.settings.excludedUrls ? this.settings.excludedUrls.split('\n').map(url => url.trim()) : [];

    const isIncluded = includedUrls.some(url  => currentUrl.includes(url));
    const isExcluded = excludedUrls.some(url  => currentUrl.includes(url));

    return (includedUrls.length > 0) ? isIncluded : !isExcluded;
  }
}
