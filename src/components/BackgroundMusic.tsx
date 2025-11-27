import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const fadeInDuration = 5000; // 5 seconds
        const intervalTime = 50; // Update every 50ms
        const steps = fadeInDuration / intervalTime;
        const volumeStep = 1 / steps;

        let currentVolume = 0;
        let fadeInterval: NodeJS.Timeout;

        const playAudio = async () => {
            try {
                audio.volume = 0;
                await audio.play();
                setIsPlaying(true);

                fadeInterval = setInterval(() => {
                    currentVolume += volumeStep;
                    if (currentVolume >= 1) {
                        currentVolume = 1;
                        clearInterval(fadeInterval);
                    }
                    audio.volume = currentVolume;
                }, intervalTime);
            } catch (error) {
                console.log("Autoplay blocked:", error);
                setIsPlaying(false);
            }
        };

        playAudio();

        return () => {
            clearInterval(fadeInterval);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
            // Ensure volume is up if it was paused during fade in or something
            if (audio.volume === 0) audio.volume = 1;
        }
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
        }}>
            <audio ref={audioRef} src="/ukulele_bg.m4a" loop />
            <button
                onClick={togglePlay}
                className="button-outline"
                aria-label={isPlaying ? "Pause background music" : "Play background music"}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.5rem',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                }}
            >
                {isPlaying ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                )}
            </button>
        </div>
    );
}
