import {Layout, LegacyCard} from '@shopify/polaris';

function SettingsCard({children}) {
  return (
    <Layout>
      <Layout.Section>
        <LegacyCard.Section>
          {children}
        </LegacyCard.Section>
      </Layout.Section>
    </Layout>
  );
}

export default SettingsCard;
