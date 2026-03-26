import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by ArtSail ©2026"
      links={[
        {
          key: 'ArtSail',
          title: 'ArtSail',
          href: 'http://artsail.top',
          blankTarget: true,
        },
  
      ]}
    />
  );
};

export default Footer;
