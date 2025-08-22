import {
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer
} from '@shopify/polaris';
import React from 'react';

function SkeletonLoadingPage() {
  return (
    <SkeletonPage primaryAction>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </Card>
            <Card sectioned>
              <SkeletonBodyText lines={1} />
            </Card>
          </Card>
          <Card subdued>
            <Card sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </Card>
            <Card sectioned>
              <SkeletonBodyText lines={2} />
            </Card>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}

export default SkeletonLoadingPage;
