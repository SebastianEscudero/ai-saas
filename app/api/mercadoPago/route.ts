import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function POST() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized no log in", {status: 401})
        }

        const userSubscription = await prismadb.userSubscription.findUnique({
            where: {
                userId: userId
            },
            select: {
                subscriptionId: true
            }
        })

        if (userSubscription && userSubscription.subscriptionId) {
            const data = {
                init_point: "https://www.mercadopago.cl/subscriptions#from-section=menu"
            }
            return new NextResponse(JSON.stringify(data), {status: 200});
        }
        const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MERCADO_PAGO_API_KEY_TEST}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "reason": "Genius Pro Plan",
                "external_reference": userId,
                "payer_email": user.emailAddresses[0].emailAddress,
                "notificacion_url": "https://ai-saas-brown-one.vercel.app/api/webhook", 
                "auto_recurring": {
                    "frequency": 1,
                    "frequency_type": "months",
                    "start_date": new Date().toISOString(),
                    "transaction_amount": 19900,
                    "currency_id": "CLP"
                },
                "back_url": "https://ai-saas-brown-one.vercel.app/settings", // Reemplazar con la URL de la pagina web
                "status": "active",
            })
        });

        const data = await response.json();
        
        return new NextResponse(JSON.stringify(data), {status: 200});


        } catch (error) {
            console.log("[MERCADOPAGO_ERROR]", error);
            return new NextResponse("Internal error", {status: 500});
        }
}