import { AudioProvider } from "@/features/audio/AudioProvider";
import { Stack } from "expo-router";
import '../../global.css';
export default function RootLayout() {
  return (
    <AudioProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AudioProvider>

  );
}