// Loads the Sitecore CDP library and creates useEffect to track all page views

import Script from 'next/script';
import { useEffect } from 'react';

declare const _boxeverq: any;
declare const Boxever: any;

function createPageView(routeName: string) {
  const pos = 'spintel.com';

  _boxeverq.push(function () {
    const pageViewEvent = {
      browser_id: Boxever.getID(),
      channel: 'WEB',
      type: 'VIEW',
      language: 'EN',
      page: routeName,
      pos: pos,
    };

    Boxever.eventCreate(pageViewEvent, function () {}, 'json');
  });
}

interface CdpIntegrationProps {
  pageEditing: boolean | undefined;
  route: string;
}

const CdpIntegrationScript = (props: CdpIntegrationProps): JSX.Element => {
  const clientKey = process.env.PARTNER_SANDBOX_CLIENT_KEY;
  const targetUrl = 'https://dev-api.boxever.com/v1.2';

  useEffect(() => {
    createPageView(props.route);
  });

  return (
    <>
      <Script
        id="cdp_settings"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
              var _boxeverq = _boxeverq || [];

              var _boxever_settings = {
                  client_key: '${clientKey}',
                  target: '${targetUrl}',
                  cookie_domain: ''
              };
            `,
        }}
      />
      <Script src="https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.8.min.js" />
    </>
  );
};

export default CdpIntegrationScript;
