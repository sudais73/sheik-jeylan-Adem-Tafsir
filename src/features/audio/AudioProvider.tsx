import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, useContext, useState, type ReactNode } from 'react';

type AudioContextValue = {
player:ReturnType<typeof useAudioPlayer>;
status:ReturnType<typeof useAudioPlayerStatus>;
currentAudioUrl:string | null;
playAudio:(audioUrl:string)=>void;
stopAudio :()=>void
}

type AudioProviderProps = {
    children: ReactNode
}

const AudioContext = createContext<AudioContextValue | null>(null)


export function AudioProvider({
    children
}: AudioProviderProps) {

    const[currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null)
    const player = useAudioPlayer(null)
    const status = useAudioPlayerStatus(player)
    function playAudio(audioUrl:string){
        if(currentAudioUrl !== audioUrl){
            player.replace(audioUrl)
        setCurrentAudioUrl(audioUrl)

        
        }
        player.play()
    }

    function stopAudio (){
        player.pause();
        setCurrentAudioUrl(null)
    }
    return (
        <AudioContext.Provider value={{
            player,
            status,
            currentAudioUrl,
            playAudio,
            stopAudio
        }}>
            {children}
        </AudioContext.Provider>
    )

}

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used inside Audio Provider')
    }
    return context;
}