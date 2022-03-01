// Loads the Sitecore CDP library and creates useEffect to track all page views

import Script from 'next/script';
import { useEffect } from 'react';

declare const _boxeverq: any;
declare const Boxever: any;

function createPageView(routeName: string) {
  const pos = 'tworichardsmusicstore';

  console.log("Page view: ", routeName)
  _boxeverq.push(function () {
    const pageViewEvent = {
      browser_id: Boxever.getID(),
      browserId: Boxever.getID(),
      channel: 'WEB',
      type: 'VIEW',
      language: 'EN',
      page: routeName,
      pos: pos,
      email: "thd@sitecore.com",
    };

    Boxever.eventCreate(pageViewEvent, 
      function (response: any) {
        if (!response) {
          console.log("No response provided.");
        }
        if (response.status !== "OK") {
          console.log("Response status: " + response.status);
        }
        console.log(response)
    }, 'json');
  });
  console.log("Event in queue");

}

interface CdpIntegrationProps {
  route: string;
}

const CdpIntegrationScript = (props: CdpIntegrationProps): JSX.Element => {
  const clientKey = process.env.NEXT_PUBLIC_PARTNER_SANDBOX_CLIENT_KEY;

  useEffect(() => {
    console.log("Loading up script");

    createPageView(props.route);
  });

  return (
    <>
      <Script
        id="cdp_settings"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
          var _boxeverq = _boxeverq || []; var _boxever_settings = {}; 
          
          _boxever_settings.client_key="${clientKey}"; 
          _boxever_settings.target="https://api.boxever.com/v1.2"; 
          _boxever_settings.cookie_domain="";
          _boxever_settings.pointOfSale="tworichardsmusicstore";
            `,
        }}
      />
      <Script src="https://d1mj578wat5n4o.cloudfront.net/boxever-1.4.8.min.js" />
    </>
  );
};

export default CdpIntegrationScript;
