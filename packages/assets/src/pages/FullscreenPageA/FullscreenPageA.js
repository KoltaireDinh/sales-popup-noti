import React, {useContext, useEffect, useState} from 'react';
import {
  ActionList,
  BlockStack,
  Button,
  Card,
  Layout,
  Page,
  Popover,
  Text,
  Tooltip
} from '@shopify/polaris';
import {XIcon} from '@shopify/polaris-icons';
import {MaxModalContext} from '@assets/contexts/maxModalContext';
import isEmbeddedAppEnv from '@assets/helpers/isEmbeddedAppEnv';

/**
 * @return {JSX.Element}
 */
export default function FullscreenPageA() {
  const {isFullscreen, openFullscreen, setOpenMaxModal} = useContext(MaxModalContext);
  const [popoverActive, setPopoverActive] = useState(false);

  useEffect(() => {
    if (isFullscreen) return;
    if (isEmbeddedAppEnv) {
      openFullscreen(window.location.pathname.replace('/embed', ''));
    } else {
      setOpenMaxModal(true);
    }
  }, []);

  return (
    <Page title="Fullscreen page a">
      <Layout sectioned>
        <Card>
          <BlockStack gap="200">
            <Tooltip content="test tooltip">
              <Text as="span" variant="headingSm">
                Tooltip
              </Text>
            </Tooltip>
            <Popover
              active={popoverActive}
              onClose={() => setPopoverActive(false)}
              activator={<Button onClick={() => setPopoverActive(true)}>Popover</Button>}
            >
              <ActionList
                items={[
                  {
                    content: 'Dismiss',
                    icon: XIcon,
                    onAction: () => setPopoverActive(false)
                  }
                ]}
              />
            </Popover>
          </BlockStack>
        </Card>
      </Layout>
    </Page>
  );
}

FullscreenPageA.propTypes = {};
