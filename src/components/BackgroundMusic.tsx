import { useEffect } from "react";

function BackgroundMusic() {
    useEffect(() => {
        const audio = new Audio("/music.mp3");

        audio.loop = true;
        audio.volume = 0.3;

        const startMusic = () => {
            audio.play().catch(() => {
            });

            window.removeEventListener(
                "pointerdown",
                startMusic,
            );
            window.removeEventListener(
                "keydown",
                startMusic,
            );
        };

        window.addEventListener(
            "pointerdown",
            startMusic,
        );

        window.addEventListener(
            "keydown",
            startMusic,
        );

        return () => {
            audio.pause();
            audio.currentTime = 0;

            window.removeEventListener(
                "pointerdown",
                startMusic,
            );

            window.removeEventListener(
                "keydown",
                startMusic,
            );
        };
    }, []);

    return null;
}

export default BackgroundMusic;