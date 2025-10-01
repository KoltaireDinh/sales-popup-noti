import './NoticationPopup.scss';
import React from 'react';

const NotificationPopup = ({
                             settings = {},
                             firstName = 'John Doe',
                             city = 'New York',
                             country = 'United States',
                             productName = 'Puffer Jacket With Hidden Hood',
                             relativeDate = 'a day ago',
                             productImage = 'https://cdn.shopify.com/s/files/1/0645/1403/1703/files/Main_c8ff0b5d-c712-429a-be00-b29bd55cbc9d.jpg?v=1758686031'
                           }) => {
  const displayProductName =
    settings.truncateProductName && productName.length > 20
      ? productName.substring(0, 20) + '...'
      : productName;

  return (
    <div className="Avava-SP__Wrapper fadeInUp animated">
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
