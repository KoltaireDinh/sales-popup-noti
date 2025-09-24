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

    if (!this.displayPopupAt()) {
      console.log('Pop up cant be displayed at this URL');
      return;
    }
    console.log(settings);
    console.log(settings.position);
    this.insertContainer();
    await this.timeout(this.settings.firstDelay);
    for (const notification of this.notifications) {
      await this.displayOneNotification(notification);
      console.log(notification);
    }
  }
  // Your display logic here
  async displayOneNotification(notification) {
    this.display(notification);
    console.log(`displaying for ${this.settings.displayDuration}`);
    await this.displayLength();
    console.log('a');
    this.fadeOut();
    console.log(`Wait for ${this.settings.popsInterval}s to see next notification`);
    await this.timeout(this.settings.popsInterval);
  }
  // convert seconds to milliseconds
  async timeout(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
  // set popup's display duration with settings.displayDuration
  async displayLength() {
    await this.timeout(this.settings.displayDuration);
  }
  // hide popup after displayDuration time
  fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    if (container) {
      render(null, container);
    }
  }
  // create notification element with configured settings values
  display(notification) {
    const container = document.querySelector('#Avada-SalePop');
    console.log(container, "this is log");
    if (container) {
      const notificationPopup = React.createElement(NotificationPopup, {
        ...notification,
        settings: this.settings,
      });
      render(notificationPopup, container);
    }
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add(`Avada-SalePop__OuterWrapper`)

    this.applyPositionStyles(popupEl);

    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      insertAfter(popupEl, targetEl);
    }
    return popupEl;
  }

  applyPositionStyles(element) {
    const position = this.settings.position || 'top-left';

    Object.assign(element.style, {
      position: 'fixed',
      zIndex: '99'
    });

    switch (position) {
      case 'top-left':
        Object.assign(element.style, {
          top: '15px',
          left: '15px'
        });
        break;
      case 'top-right':
        Object.assign(element.style, {
          top: '15px',
          right: '15px'
        });
        break;
      case 'bottom-left':
        Object.assign(element.style, {
          bottom: '15px',
          left: '15px'
        });
        break;
      case 'bottom-right':
        Object.assign(element.style, {
          bottom: '15px',
          right: '15px'
        });
        break;
    }
  }
  displayPopupAt() {
    const currentUrl = window.location.href;
    const includedUrls = this.settings.includedUrls ? this.settings.includedUrls.split('\n').map(url => url.trim()) : [];
    const excludedUrls = this.settings.excludedUrls ? this.settings.excludedUrls.split('\n', ).map(url => url.trim()) : [];

    const isIncluded = includedUrls.some(url  => currentUrl.includes(url));
    const isExcluded = excludedUrls.some(url  => currentUrl.includes(url));

    return (includedUrls.length > 0) ? isIncluded : !isExcluded;
  }
}
