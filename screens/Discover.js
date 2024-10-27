import { useRef, useState } from "react";
import { Animated, Easing, PanResponder, View } from "react-native";
import styled from "styled-components/native";
import { useQuery } from "@tanstack/react-query";

import { listCoins, LOGO_URL } from "../api";
import Loader from "../components/Loader";

const BLACK = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
	flex: 1;
	background-color: ${BLACK};
`;
const Edge = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
const Center = styled.View`
	flex: 3;
	justify-content: center;
	align-items: center;
	z-index: 10;
`;

const WordContainer = styled(Animated.createAnimatedComponent(View))`
	width: 100px;
	height: 100px;
	justify-content: center;
	align-items: center;
	background-color: ${GREY};
	border-radius: 50px;
`;
const Word = styled.Text`
	font-size: 38px;
	font-weight: 500;
	color: ${(props) => props.color};
`;

const IconCard = styled(Animated.createAnimatedComponent(View))`
	position: absolute;
	z-index: 10;
	background-color: transparent;
	align-items: center;
	gap: 10;
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
	font-size: 36px;
	font-weight: 600;
`;

export default function App() {
	// Values
	const opacity = useRef(new Animated.Value(1)).current;
	const scale = useRef(new Animated.Value(1)).current;
	const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
	const scaleOne = position.y.interpolate({
		inputRange: [-300, -80],
		outputRange: [2, 1],
		extrapolate: "clamp",
	});
	const scaleTwo = position.y.interpolate({
		inputRange: [80, 300],
		outputRange: [1, 2],
		extrapolate: "clamp",
	});

	// Animations
	const onPressIn = Animated.spring(scale, {
		toValue: 0.9,
		useNativeDriver: true,
	});
	const onPressOut = Animated.spring(scale, {
		toValue: 1,
		useNativeDriver: true,
	});
	const goHome = Animated.spring(position, {
		toValue: 0,
		useNativeDriver: true,
	});
	const onDropScale = Animated.timing(scale, {
		toValue: 0,
		duration: 50,
		easing: Easing.linear,
		useNativeDriver: true,
	});
	const onDropOpacity = Animated.timing(opacity, {
		toValue: 0,
		duration: 50,
		easing: Easing.linear,
		useNativeDriver: true,
	});

	// Pan Responders
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onPanResponderMove: (_, { dx, dy }) => {
				console.log(dy);
				position.setValue({ x: dx, y: dy });
			},
			onPanResponderGrant: () => {
				onPressIn.start();
			},
			onPanResponderRelease: (_, { dy }) => {
				if (dy < -250 || dy > 250) {
					Animated.sequence([
						Animated.parallel([onDropScale, onDropOpacity]),
						Animated.timing(position, {
							toValue: 0,
							duration: 50,
							easing: Easing.linear,
							useNativeDriver: true,
						}),
					]).start(nextIcon);
				} else {
					Animated.parallel([onPressOut, goHome]).start();
				}
			},
		})
	).current;

	// State
	const [index, setIndex] = useState(0);
	const nextIcon = () => {
		setIndex((prev) => prev + 1);
		Animated.parallel([
			Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
			Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
		]).start();
	};

	const { isLoading, data } = useQuery({
		queryKey: ["coins"],
		queryFn: listCoins,
	});

	// Preload image path of icons
	let icons = [];
	if (data) {
		data.map((item) => {
			let asset = {
				name: item.name,
				path: `${LOGO_URL}/${item.symbol.toLowerCase()}`,
			};
			icons.push(asset);
		});
	}

	return isLoading ? (
		<Loader />
	) : (
		<Container>
			<Edge>
				<WordContainer style={{ transform: [{ scale: scaleOne }] }}>
					<Word color={GREEN}>사다</Word>
				</WordContainer>
			</Edge>
			<Center>
				<IconCard
					{...panResponder.panHandlers}
					style={{
						opacity,
						transform: [
							...position.getTranslateTransform(),
							{ scale },
						],
					}}
				>
					<Symbol source={{ uri: icons[index].path }} />
					<Title>{icons[index].name}</Title>
				</IconCard>
			</Center>
			<Edge>
				<WordContainer style={{ transform: [{ scale: scaleTwo }] }}>
					<Word color={RED}>팔다</Word>
				</WordContainer>
			</Edge>
		</Container>
	);
}
