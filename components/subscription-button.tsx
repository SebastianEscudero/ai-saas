"use client";

import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { useState } from "react";

interface SubscriptionButtonProps {
    isPro: boolean;
};

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false)

    const onClick = async () => {
        try {
            const { data } = await axios.post("/api/mercadoPago");
            console.log(data);
            window.location.href = data.init_point;
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Button variant={isPro ? "default" : "premium"} onClick={onClick}>
            {isPro ? "Pause Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white"/>}
        </Button>
    )
}