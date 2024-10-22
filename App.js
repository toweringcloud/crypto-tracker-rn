import { useColorScheme } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import { darkTheme, lightTheme } from "./styled";
import Preload from "./Preload";
import Root from "./navigations/Root";

export default function App() {
	Preload();
	const isDark = useColorScheme() === "dark";
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
				<NavigationContainer>
					<Root />
					<StatusBar style={"light"} />
				</NavigationContainer>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
