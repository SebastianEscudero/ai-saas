import * as mercadopago from 'mercadopago';
import { NextRequest } from 'next/server';

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_API_KEY_TEST!
});

export async function POST(request: NextRequest) {
    const body = await request.json().then((data) => data as {data: {id: string}})

    // // Store body data in a variable
    // const bodyData = body.data;

    // const paymentId = Number(bodyData.id);
    // const payment = await mercadopago.payment.get(paymentId);
    // console.log(payment)
    console.log(body)

    return new Response(JSON.stringify({success: true}), {status: 200})
}