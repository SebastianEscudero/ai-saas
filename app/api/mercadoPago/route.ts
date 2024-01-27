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
                userId
            }
        })

        if (userSubscription && userSubscription.mercadoPagoCustomerId) {
            // falta agregar la lógica para actualizar la suscripción
            console.log("falta agregar la lógica para actualizar la suscripción")
            }

        // aqui va la lógica para crear la suscripción
        // const urlReal = 'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=2c9380848d22f7a4018d28d89eef0337'
        // const url = "https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=2c9380848d22f7a4018d28ed466c0343"
        // la url de arriba es una url de una test account de mercado pago

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
                "notificacion_url": "https://3644-152-230-201-53.ngrok-free.app/api/webhook", 
                "auto_recurring": {
                    "frequency": 1,
                    "frequency_type": "months",
                    "start_date": new Date().toISOString(),
                    "transaction_amount": 19900,
                    "currency_id": "CLP"
                },
                "back_url": "https://www.mercadopago.cl", // Reemplazar con la URL de la pagina web
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