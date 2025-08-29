import {Layout, LegacyCard} from '@shopify/polaris';

function SettingsCard({children}) {
  return (
    <Layout>
      <Layout.Section>
          {children}
      </Layout.Section>
    </Layout>
  );
}

export default SettingsCard;
