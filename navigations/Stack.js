import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Detail from "../screens/Detail";

const NativeStack = createNativeStackNavigator();

const Stack = () => (
	<NativeStack.Navigator
		screenOptions={{
			headerBackTitleVisible: false,
			headerStyle: {
				backgroundColor: "#353d43",
			},
			headerTintColor: "white",
			headerTitleAlign: "center",
			headerTitleStyle: {
				color: "#fd79a8",
			},
		}}
	>
		<NativeStack.Screen name="Detail" component={Detail} />
	</NativeStack.Navigator>
);
export default Stack;
