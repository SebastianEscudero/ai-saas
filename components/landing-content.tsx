"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "Sebastian",
        avatar: "S",
        title: "Software Engineer",
        description: "I love Genius. It's the best AI tool I've ever used."
    },
    {
        name: "Michael",
        avatar: "M",
        title: "Music Producer",
        description: "Genius is an incredible AI tool for music generation. It helps me create unique and inspiring melodies effortlessly."
    },
    {
        name: "David",
        avatar: "D",
        title: "Software Developer",
        description: "As a developer, Genius is my go-to AI tool for code generation. It saves me time and helps me write high-quality code."
    },
    {
        name: "Sophia",
        avatar: "S",
        title: "Video Editor",
        description: "Genius is a game-changer for video editing. It automates repetitive tasks and enhances the overall editing process."
    },
]

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {testimonials.map((item) => (
                    <Card key={item.description} className="bg-[#192339] border-none text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-x-2">
                                <div>
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-zinc-400 text-sm">{item.title}</p>
                                </div>
                            </CardTitle>
                            <CardContent className="pt-4 px-0">
                                {item.description}
                            </CardContent>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}