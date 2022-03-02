import { request } from 'http';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextMiddlewareResult> {

  const cookieKey = `bid_${process.env.NEXT_PUBLIC_PARTNER_SANDBOX_CLIENT_KEY}`;
  const browserId = request.cookies[cookieKey];
  console.log("BrowserId: " + browserId);
  if (browserId == '' || undefined) {
    return;
  }
  let callFlowResponse = await callFlowsEvent(browserId);

  if (request.url.includes('/home')) {
    const url: NextURL = request.nextUrl.clone()

    if (callFlowResponse.audienceFilter.includes('personalized')) {
      url.pathname = '/personalized';
      return NextResponse.redirect(url);
    }

    return;

  }
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
