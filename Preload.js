import { useCallback, useEffect } from "react";

import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function Preload() {
	const [fontsLoaded] = useFonts(Ionicons.font);
	const [assets] = useAssets([require("./assets/crypto.png")]);

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded && assets) await SplashScreen.hideAsync();
	}, [fontsLoaded, assets]);

	useEffect(() => {
		onLayoutRootView();
	}, [onLayoutRootView]);

	if (!fontsLoaded || !assets) {
		return null;
	}
}
