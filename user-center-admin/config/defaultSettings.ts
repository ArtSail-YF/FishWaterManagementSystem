import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "colorPrimary": "#B54E3C",
  "layout": "mix",
  "contentWidth": "Fluid",
  "fixedHeader": false,
  "fixSiderbar": true,
  "pwa": true,
  "logo": "/鱼.svg",
  "token": {},
  "splitMenus": true,
  "footerRender": false,
  "siderMenuType": "group"
};

export default Settings;
