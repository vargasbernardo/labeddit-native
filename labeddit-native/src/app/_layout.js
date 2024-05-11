import { Stack } from "expo-router";
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen options={{ headerShown: false }} name="index" />
        <Stack.Screen options={{ headerShown: false }} name="postDetail/[id]" />
        <Stack.Screen options={{ headerShown: false }} name="signup" />
        <Stack.Screen options={{ headerShown: false }} name="feed" />
      </Stack>
    </QueryClientProvider>
  );
}
