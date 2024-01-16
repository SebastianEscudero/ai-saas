import mercadopago from "mercadopago";

export const mercadoPago = mercadopago.configure({
    access_token: process.env.MERCADOPAGO_API_KEY || ""
});
