import { Stack } from 'expo-router';

export default function SocietyLayout() {
  return (
    <Stack>
      {/* Tech Societies */}
      <Stack.Screen name="neuro" options={{ headerShown: false }} />
      <Stack.Screen name="webnd" options={{ headerShown: false }} />
      <Stack.Screen name="nakshatra" options={{ headerShown: false }} />
      <Stack.Screen name="febs" options={{ headerShown: false }} />
      <Stack.Screen name="risc" options={{ headerShown: false }} />

      {/* Socio-Cultural Societies */}
      <Stack.Screen name="aaroh" options={{ headerShown: false }} />
      <Stack.Screen name="abhivyakti" options={{ headerShown: false }} />
      <Stack.Screen name="cinewave" options={{ headerShown: false }} />
      <Stack.Screen name="clix" options={{ headerShown: false }} />
      <Stack.Screen name="dgroovers" options={{ headerShown: false }} />
      <Stack.Screen name="fourthwall" options={{ headerShown: false }} />
      <Stack.Screen name="kalakriti" options={{ headerShown: false }} />
      <Stack.Screen name="panacea" options={{ headerShown: false }} />
      <Stack.Screen name="soulsforsolace" options={{ headerShown: false }} />
    </Stack>
  );
}