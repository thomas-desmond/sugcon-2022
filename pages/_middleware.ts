import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // const browserId = request.cookies['browserId'] as string;
  // if(browserId == '') {
  //   return;
  // }
  // callFlowsEvent(browserId)

}

async function callFlowsEvent(browserId: string) {
  const boxeverCallFlowsEndpoint = "https://api.boxever.com/v2/callFlows"
  
  const payload = {
    "channel": "WEB",
    "language": "en",
    "currencyCode": "EUR",
    "pointOfSale": "eupos",
    "browserId": browserId,
    "clientKey": process.env.PARTNER_SANDBOX_CLIENT_KEY,
    "friendlyId":"page_view_personalization"
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