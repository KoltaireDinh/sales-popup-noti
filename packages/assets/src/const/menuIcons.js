import {NotificationIcon, SettingsIcon} from '@shopify/polaris-icons';

const menuIcons = [
  {
    icon: NotificationIcon,
    destination: '/notification'
  },
  {
    icon: SettingsIcon,
    destination: '/settings'
  },
];

export const getMenuIcon = url => menuIcons.find(x => x.destination === url)?.icon || SettingsIcon;
