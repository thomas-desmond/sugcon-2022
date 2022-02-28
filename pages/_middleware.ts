import { request } from 'http';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const cookieKey = `bid_${process.env.NEXT_PUBLIC_PARTNER_SANDBOX_CLIENT_KEY}`;
  const browserId = request.cookies[cookieKey];
  console.log("BrowserId: " + browserId);
  if (browserId == '' || undefined) {
    return;
  }
  let callFlowResponse = await callFlowsEvent(browserId);

  console.log("url: ", request.url)

  if (request.url.includes('/home')) {
    const url: NextURL = request.nextUrl.clone()
    console.log("clonedURL:", url)

    url.pathname = '/dest'


    if (callFlowResponse.audienceFilter == 'personalized') {
      url.pathname = '/home-personalized'

      NextResponse.redirect(url)
    }
    else {

      url.pathname = '/home'
      console.log("clonedURL new path: ", url)
      NextResponse.redirect(url)
    }
  }


  return
}

async function callFlowsEvent(browserId: string) {
  const boxeverCallFlowsEndpoint = "https://api.boxever.com/v2/callFlows"

  const payload = {
    "channel": "WEB",
    "language": "en",
    "currencyCode": "EUR",
    "pointOfSale": "eupos",
    "browserId": browserId,
    "clientKey": process.env.NEXT_PUBLIC_PARTNER_SANDBOX_CLIENT_KEY,
    "friendlyId": "page_view_personalization"
  }

  const rawResponse = await fetch(boxeverCallFlowsEndpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!rawResponse.ok) {
    return { segmentCode: '' };
  }

  const cdpSegmentsResponseJson = await rawResponse.json();
  console.log("CDP Response:", cdpSegmentsResponseJson.audienceFilter);
  return cdpSegmentsResponseJson;

}

// endpoint: https://api.boxever.com/v2/callFlows
/*
 
{
  "channel": "WEB",
  "language": "en",
  "currencyCode": "EUR",
  "pointOfSale": "eupos",
  "browserId": "751b53c0-60b2-4da1-baa6-f02ec21a721d",
  "clientKey": "process.env.PARTNER_SANDBOX_CLIENT_KEY",
  "friendlyId":"page_view_personalization"
}

*/