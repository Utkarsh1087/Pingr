export const playSound = (type) => {
    const sounds = {
        sent: "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3", // Short pop
        received: "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3", // Glass ping
        notification: "https://assets.mixkit.co/active_storage/sfx/2361/2361-preview.mp3" // Soft chime
    };

    const audio = new Audio(sounds[type]);
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Audio play blocked", err));
};
