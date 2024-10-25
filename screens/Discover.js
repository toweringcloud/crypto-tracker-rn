import { useAssets } from "expo-asset";
import { useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { listCoins, LOGO_URL } from "../api";
import Loader from "../components/Loader";

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: #1e272e;
`;

const CardContainer = styled.View`
	flex: 3;
	justify-content: center;
	align-items: center;
`;
const Card = styled(Animated.createAnimatedComponent(View))`
	position: absolute;
	width: 300px;
	height: 400px;
	justify-content: center;
	align-items: center;
	gap: 10px;
	border-radius: 12px;
	box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
	background-color: #fd79a8;
`;
const Symbol = styled.Image`
	height: 150px;
	width: 150px;
	margin-right: 10px;
	border-radius: 15px;
	color: white;
`;
const Title = styled.Text`
	color: white;
	font-size: 24px;
	font-weight: 600;
`;

const ActionContainer = styled.View`
	flex: 1;
	flex-direction: row;
`;
const Action = styled.TouchableOpacity`
	margin: 0px 10px;
`;

export default function App() {
	const scale = useRef(new Animated.Value(1)).current;
	const position = useRef(new Animated.Value(0)).current;
	const rotation = position.interpolate({
		inputRange: [-250, 250],
		outputRange: ["-15deg", "15deg"],
	});
	const secondScale = position.interpolate({
		inputRange: [-300, 0, 300],
		outputRange: [1, 0.7, 1],
		extrapolate: "clamp",
	});

	const onPressOut = Animated.spring(scale, {
		toValue: 1,
		useNativeDriver: true,
	});
	const onPressIn = Animated.spring(scale, {
		toValue: 0.95,
		useNativeDriver: true,
	});
	const goCenter = Animated.spring(position, {
		toValue: 0,
		useNativeDriver: true,
	});
	const goLeft = Animated.spring(position, {
		toValue: -500,
		tension: 5,
		useNativeDriver: true,
		restDisplacementThreshold: 100,
		restSpeedThreshold: 100,
	});
	const goRight = Animated.spring(position, {
		toValue: 500,
		tension: 5,
		useNativeDriver: true,
	});

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, { dx }) => {
				position.setValue(dx);
			},
			onPanResponderGrant: () => onPressIn.start(),
			onPanResponderRelease: (_, { dx }) => {
				if (dx < -250) {
					goLeft.start(onDismiss);
				} else if (dx > 250) {
					goRight.start(onDismiss);
				} else {
					Animated.parallel([onPressOut, goCenter]).start();
				}
			},
		})
	).current;

	const [index, setIndex] = useState(0);
	const onDismiss = () => {
		scale.setValue(1);
		setIndex((prev) => prev + 1);
		position.setValue(0);
	};
	const dislike = () => {
		goLeft.start(onDismiss);
	};
	const like = () => {
		goRight.start(onDismiss);
	};

	const { isLoading, data } = useQuery({
		queryKey: ["coins"],
		queryFn: listCoins,
	});

	// Preload images with the useAssets hook
	let icons = [];
	if (data)
		data.map((item) => {
			let asset = {
				name: item.name,
				path: `${LOGO_URL}/${item.symbol.toLowerCase()}`,
			};
			icons.push(asset);
		});
	// const [assets] = useAssets(icons);

	return isLoading ? (
		<Loader />
	) : (
		<Container>
			<CardContainer>
				<Card style={{ transform: [{ scale: secondScale }] }}>
					<Symbol source={{ uri: icons[index + 1].path }} />
					<Title>{icons[index + 1].name}</Title>
				</Card>
				<Card
					{...panResponder.panHandlers}
					style={{
						transform: [
							{ scale },
							{ translateX: position },
							{ rotateZ: rotation },
						],
					}}
				>
					<Symbol source={{ uri: icons[index].path }} />
					<Title>{icons[index].name}</Title>
				</Card>
			</CardContainer>
			<ActionContainer>
				<Action onPress={dislike}>
					<FontAwesome5 name="heart-broken" color="white" size={58} />
				</Action>
				<Action onPress={like}>
					<FontAwesome5 name="heart" color="white" size={58} />
				</Action>
			</ActionContainer>
		</Container>
	);
}
