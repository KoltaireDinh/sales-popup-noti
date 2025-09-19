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
    this.insertContainer();

    await this.timeout(this.settings.firstDelay);
    for (const notification of this.notifications) {
      await this.displayOneNotification(notification);
      console.log(notification);
    }
  }
  // Your display logic here
  async displayOneNotification(notification) {
    await this.display(notification);
    await this.displayDur();
    await this.fadeOut();
    await this.timeout(this.settings.popsInterval);
  }
  // convert seconds to milliseconds
  async timeout(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
  // set popup's display duration with settings.displayDuration
  async displayDur() {
    await this.timeout(this.settings.displayDuration);
  }
  // hide popup after displayDuration time
  async fadeOut() {
    const container = document.querySelector('#Avada-SalePop');
    if (container) {
      render(null, container);
    }
  }
  // create notification element with configured settings values
  async display(notification) {
    const container = document.querySelector('#Avada-SalePop');
    if (container) {
      const notificationPopup = React.createElement(NotificationPopup, {
        ...notification,
        settings: this.settings
      });
      render(notificationPopup, container);
    }
  }

  insertContainer() {
    const popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    const targetEl = document.querySelector('body').firstChild;
    if (targetEl) {
      insertAfter(popupEl, targetEl);
    }

    return popupEl;
  }
}
