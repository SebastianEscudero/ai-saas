"use client";

import { Zap } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";

interface SubscriptionButtonProps {
    isPro: boolean;
};

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps) => {
    const onClick = async () => {
        try {
            const response = await axios.get("/api/subscription");
        } catch (error) {
            console.log("Billing error: ", error);
        }
    }
    return (
        <Button variant={isPro ? "default" : "premium"} onClick={onClick}>
            {isPro ? "Pause Subscription" : "Upgrade"}
            {!isPro && <Zap className="w-4 h-4 ml-2 fill-white"/>}
        </Button>
    )
}