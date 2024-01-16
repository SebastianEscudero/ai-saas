import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { absoluteUrl } from "@/lib/utils";
import { MercadoPagoConfig, Preference } from "mercadopago";

const settingsUrl = absoluteUrl("/settings");

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_API_KEY!});

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

        // esto es una prueba, necesito ocupar la subscription API de mercado pago para indicar la frecuencia mensual
        const preferences = await new Preference(client).create({
            body: {
                items: [
                    {
                        id: 'Pro Modal',
                        title: "Genius Pro Plan",
                        unit_price: 20000,
                        quantity: 1,
                        currency_id: "CLP"
                    }
                ],
                payer: {
                    email: user.emailAddresses[0].emailAddress
                },
                back_urls: {
                    success: settingsUrl,
                    failure: settingsUrl,
                    pending: settingsUrl,
                },
                auto_return: "approved",
                // external_reference: userId,
                notification_url: `${absoluteUrl("/api/webhook/route.ts")}`
            }
        })

        const response = await preferences.sandbox_init_point;
        return new NextResponse(JSON.stringify(response), {status: 200});
        } catch (error) {
            console.log("[MERCADOPAGO_ERROR]", error);
            return new NextResponse("Internal error", {status: 500});
        }
}