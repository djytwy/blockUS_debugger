import { NextResponse, NextRequest } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchPost, fetchPut, fetchGet } from '@/request';

const env = process.env.NEXT_PUBLIC_ENV as string;
const env_interface = env === 'staging' ? 'v2-testing' : 'v2';

export async function GET(req: NextRequest, resp: NextApiResponse) {
  const endpoint = req.nextUrl.searchParams.get('endpoint');
  const currency = req.nextUrl.searchParams.get('currency');
  const sort = req.nextUrl.searchParams.get('sort');
  const orderBy = req.nextUrl.searchParams.get('orderBy');
  const listId = req.nextUrl.searchParams.get('listId');
  let res = null;
  console.log('+++++++++++----------+++++++', endpoint);
  if (endpoint === 'payment-intent') {
    console.log(`https://api.ambrus.studio/v2-testing/account/marketplace/listings/${listId}/payment-intent`);
    console.log('+++++++++++----------+++++++', res);
    res = await fetchGet<string>(
      `https://api.ambrus.studio/v2-testing/account/marketplace/listings/${listId}/payment-intent`,
      {
        headers: {
          Authorization: req.headers.get('authorization'),
        },
      }
    );
  } else if (endpoint === 'listings') {
    res = await fetchGet<string>(`https://api.ambrus.studio/v2-testing/account/marketplace/listings?`, {
      headers: {
        Authorization: req.headers.get('authorization'),
      },
      params: {
        currency: currency,
        sort: sort,
        orderBy: orderBy,
        collectionId: env === 'pro' ? 'nNSobxFcDMUydvgn0nhxtfQ3UhqY' : 'nNSobxFcDMUydvgn0nhxtfQ3UhqY',
      },
    });
  }

  if (res) {
    return NextResponse.json(res);
  }
}

interface resProps {
  response: responseProps;
  status: number;
}
interface responseProps {
  statusCode: number;
  message: string;
  error: string;
}

export async function POST(req: NextRequest, resp: NextApiResponse) {
  const endpoint = req.nextUrl.searchParams.get('endpoint');
  const body = await req.json();
  if (endpoint === 'execute') {
    const res = await fetchPost<any>(
      `https://api.ambrus.studio/v2-testing/account/marketplace/listings/${body.id}/execute`,
      {
        data: body,
        headers: {
          Authorization: req.headers.get('authorization'),
        },
      }
    );
    return NextResponse.json(res);
  } else if (endpoint === 'create') {
    const { onchainTokenId, collectionId, price, quantity, expiration, chain } = await req.json();
    //   const res = await fetchPost<string>(`/${env_interface}/account/marketplace/listings/create`, {
    const res = await fetchPost<string>(`https://api.ambrus.studio/v2-testing/account/marketplace/listings/create`, {
      data: {
        onchainTokenId: onchainTokenId,
        collectionId: collectionId,
        price: price,
        quantity: quantity,
        listingType: 'sale',
        expiration: expiration,
        chain: chain,
      },
      headers: {
        Authorization: req.headers.get('authorization'),
      },
    });
    return NextResponse.json(res);
  }
}

export async function PUT(req: NextRequest, resp: NextApiResponse) {
  const body = await req.json();
  try {
    const res = await fetchPut<resProps | string>(`/${env_interface}/account/password`, {
      data: {
        newPassword: body.password,
        code: body.code,
      },
    });
    if (res === 'true') {
      return NextResponse.json({
        success: true,
      });
      // @ts-ignore
    } else if ('response' in res) {
      return NextResponse.json({
        error: res.response.message,
      });
    } else {
      return NextResponse.json({
        error: 'Unknow error please try again later.',
      });
    }
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}
