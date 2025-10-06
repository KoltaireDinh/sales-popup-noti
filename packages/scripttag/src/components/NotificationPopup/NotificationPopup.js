import './NoticationPopup.scss';
import React from 'react';

const NotificationPopup = ({
  settings = {
    position: 'top-right',
  },
  firstName = 'John Doe',
  city = 'New York',
  country = 'United States',
  productName = 'Puffer Jacket With Hidden Hood',
  relativeDate = 'a day ago',
  productImage = 'http://paris.mageplaza.com/images/shop/single/big-1.jpg'
}) => {
  const displayProductName =
    settings.truncateProductName && productName.length > 20
      ? productName.substring(0, 20) + '...'
      : productName;

  return (
    <div className={`Avava-SP__Wrapper fadeInUp animated ${settings.position || ''}`}>
      <div className="Avava-SP__Position">
        <div className="Avava-SP__Inner">
          <div className="Avava-SP__Container">
            <a href="#" className={'Avava-SP__LinkWrapper'}>
              <div
                className="Avava-SP__Image"
                style={{
                  backgroundImage: `url(${productImage})`
                }}
              />
              <div className="Avada-SP__Content">
                <div className={'Avada-SP__Title'}>
                  {firstName} in {city}, {country}
                </div>
                <div className={'Avada-SP__Subtitle'}>purchased {displayProductName}</div>
                <div className={'Avada-SP__Footer'}>
                  {!settings.hideTimeAgo && relativeDate}
                  <span className="uni-blue">
                    <i className="fa fa-check" aria-hidden="true" /> by Avada
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

NotificationPopup.propTypes = {};

export default NotificationPopup;
