import React from 'react';
import './NoticationPopup.scss';

const NotificationPopup = ({
  settings = {},
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket With Hidden Hood',
  timestamp = 'a day ago',
  productImage = 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.pngs'
}) => {

  const displayProductName = settings.truncateProductName && productName.length > 20
    ? productName.substring(0, 20) + '...'
    : productName;
  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
      <div className="Avava-SP__Inner">
        <div className="Avava-SP__Container">
          <a href="#" className={'Avava-SP__LinkWrapper'}>
            <div
              className="Avava-SP__Image"
              style={{
                backgroundImage: `url(${productImage})`
              }}
            ></div>
            <div className="Avada-SP__Content">
              <div className={'Avada-SP__Title'}>
                {firstName} in {city}, {country}
              </div>
              <div className={'Avada-SP__Subtitle'}>purchased {displayProductName}</div>
              {!settings.hideTimeAgo && (
                <div className={'Avada-SP__Footer'}>
                  {timestamp}{' '}
                  <span className="uni-blue">
                    <i className="fa fa-check" aria-hidden="true" /> by Avada
                  </span>
                </div>
              )}
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {};

export default NotificationPopup;
