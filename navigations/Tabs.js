import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Coins from "../screens/Coins";
import Prices from "../screens/Prices";
import News from "../screens/News";
import colors from "../colors";

const Tab = createBottomTabNavigator();

export default function Tabs() {
	return (
		<Tab.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.backgroundColor,
					borderBottomWidth: 0,
					borderWidth: 0,
					shadowColor: "transparent",
				},
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontSize: 18,
				},
				headerTintColor: colors.accent,
				tabBarStyle: {
					backgroundColor: colors.backgroundColor,
				},
				tabBarActiveTintColor: colors.accent,
				tabBarInactiveTintColor: colors.textColor,
				tabBarLabelStyle: {
					marginTop: -5,
					fontSize: 12,
					fontWeight: "600",
				},
			}}
		>
			<Tab.Screen
				name="Coins"
				component={Coins}
				options={{
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5 name="coins" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Prices"
				component={Prices}
				options={{
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="dollar-sign"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="News"
				component={News}
				options={{
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="newspaper"
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}
