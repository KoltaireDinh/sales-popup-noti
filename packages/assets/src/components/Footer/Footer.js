import React from 'react';
import {Button, FooterHelp, Layout} from '@shopify/polaris';
import './Footer.css';

export default function Footer() {
  return (
    <Layout.Section fullWidth>
      <div className="Avada-Footer_Container">
        <div className="Avada-Footer__Body">
          <FooterHelp>
            {'Created by '}
            <Button external url="https://avada.io" variant="plain">
              Avada
            </Button>
            {' with love'}
          </FooterHelp>
        </div>
      </div>
    </Layout.Section>
  );
}
