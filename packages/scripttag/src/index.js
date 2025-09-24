import DisplayManager from './managers/DisplayManager';
import ApiManager from './managers/ApiManager';

console.log('1');

(async () => {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager();
  const {notifications, settings} = await apiManager.getNotifications();
  await displayManager.initialize({notifications, settings});
})();
