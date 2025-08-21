import React from 'react';
import {Button, Layout, Page} from '@shopify/polaris';
import {useStore} from '@assets/reducers/storeReducer';
import {getHost} from '@assets/helpers';
import optionalScopes from '@functions/config/shopifyOptionalScopes';

const OptionalScopes = () => {
  const {
    state: {shop}
  } = useStore();

  const handleGrantExtraScopes = () => {
    const host = getHost();

    window.open(
      `/auth/shopify/grantManual?shop=${
        shop.shopifyDomain
      }&host=${host}&optionalScopes=${optionalScopes.join(',')}`,
      '_target=blank'
    );
  };

  return (
    <Page title="Optional Scopes">
      <Layout>
        <Layout.Section>
          <Button onClick={handleGrantExtraScopes}>Grant extra scopes</Button>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default OptionalScopes;
