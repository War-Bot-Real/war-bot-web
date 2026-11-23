// UI sound effects share one player so rapid clicks cannot overlap.
let activeSound: HTMLAudioElement | null = null;
const sounds = new Map<string, HTMLAudioElement>();

export function playUiSound(path: string) {
    if (activeSound) {
        activeSound.pause();
        activeSound.currentTime = 0;
    }
    let sound = sounds.get(path);
    if (!sound) {
        sound = new Audio(path);
        sound.preload = "auto";
        sounds.set(path, sound);
    }
    sound.currentTime = 0;
    activeSound = sound;
    void sound.play().catch(() => {});
}
