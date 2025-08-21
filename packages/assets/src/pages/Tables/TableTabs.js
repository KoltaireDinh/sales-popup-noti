import React, {useMemo} from 'react';
import {useHistory} from 'react-router-dom';
import {Tabs} from '@shopify/polaris';
import * as PropTypes from 'prop-types';

const tabs = [
  {id: '', content: 'Default table'},
  {id: 'simple', content: 'Simple table'},
  {id: 'action', content: 'Action table'}
];

export default function TableTabs({tab}) {
  const history = useHistory();
  const selectedTab = useMemo(() => tabs.findIndex(x => x.id === tab), [tab]);
  const onSelectTab = tabId => history.push('/tables' + (tabId ? `/${tabId}` : ''));

  return (
    <div style={{margin: '-18px 0 4px -11px'}}>
      <Tabs tabs={tabs} selected={selectedTab} onSelect={index => onSelectTab(tabs[index].id)} />
    </div>
  );
}

TableTabs.propTypes = {
  tab: PropTypes.string
};
