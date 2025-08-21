import React from 'react';

const HomeLoadable = React.lazy(() => import('../../pages/Home/Home'));

export default HomeLoadable;
