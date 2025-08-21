import React, {lazy, Suspense} from 'react';
import {Page} from '@shopify/polaris';
import TableTabs from '@assets/pages/Tables/TableTabs';
import {useParams} from 'react-router-dom';

const DefaultTable = lazy(() => import('./DefaultTable'));
const SimpleTable = lazy(() => import('./SimpleTable'));
const ActionTable = lazy(() => import('./ActionTable'));

/**
 * @return {JSX.Element}
 */
export default function Tables() {
  const {tab = ''} = useParams();

  const content = () => {
    switch (tab) {
      case '':
        return <DefaultTable />;
      case 'simple':
        return <SimpleTable />;
      case 'action':
        return <ActionTable />;
      default:
        return <></>;
    }
  };

  return (
    <Page title="Email channel" backAction={{content: 'Channels', url: '/channels'}}>
      <TableTabs tab={tab} />
      <Suspense fallback={<></>}>{content()}</Suspense>
    </Page>
  );
}

Tables.propTypes = {};
