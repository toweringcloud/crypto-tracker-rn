import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import Loader from "../components/Loader";
import { infoCoin } from "../api";

const Container = styled.ScrollView`
	flex: 1;
	background-color: #353d43;
	padding: 10px;
	gap: 10px;
`;

const Wrapper = styled.View`
	align-items: flex-start;
	justify-content: center;
	margin-right: 10;
	padding-top: 10;
	padding-bottom: 10;
	background-color: #353d43;
`;

const Title = styled.Text`
	margin-top: 5;
	font-size: 16;
	font-weight: 500;
	color: white;
`;

const Overview = styled.Text`
	margin-top: 10;
	font-size: 12;
	font-weight: 300;
	color: white;
`;

const LinkInfo = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 25px;
	padding-right: 10;
	padding-left: 10;
	color: white;
	border-bottom-width: 0.5;
	border-bottom-color: rgba(255, 255, 255, 0.2);
`;

const LinkName = styled.Text`
	color: white;
	font-size: 10px;
	font-weight: 200;
`;

const LinkBtn = styled.TouchableOpacity``;

const openWebLink = async (url) => {
	await WebBrowser.openBrowserAsync(url);
};

export default function Detail() {
	const route = useRoute();
	const navigation = useNavigation();

	const { isLoading, data } = useQuery({
		queryKey: ["coins", route.params["id"]],
		queryFn: infoCoin,
	});

	useEffect(() => {
		navigation.setOptions({
			headerTitle: route.params["title"],
		});
	}, []);

	return isLoading ? (
		<Loader />
	) : data ? (
		<Container>
			<Wrapper>
				<Title>About {route.params["title"]}</Title>
				<Overview>{data.description}</Overview>
			</Wrapper>
			<Wrapper>
				<Title>Links</Title>
				{Object.keys(data.links).map((item) => (
					<LinkInfo>
						<LinkName>{item}</LinkName>
						<LinkBtn
							onPress={() => openWebLink(data.links[item][0])}
						>
							👉
						</LinkBtn>
					</LinkInfo>
				))}
			</Wrapper>
			<Wrapper>
				<Title>Links Plus</Title>
				{data.links_extended.map((item) => (
					<LinkInfo>
						<LinkName>{item.type}</LinkName>
						<LinkBtn onPress={() => openWebLink(item.url)}>
							👉
						</LinkBtn>
					</LinkInfo>
				))}
			</Wrapper>
		</Container>
	) : null;
}
