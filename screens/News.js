import * as WebBrowser from "expo-web-browser";
import {
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import styled from "styled-components/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listNews } from "../api";
import Loader from "../components/Loader";

const Wrapper = styled.View`
	align-items: center;
	justify-content: center;
	height: 50px;
	gap: 5;
	margin-right: 10;
	padding-top: 10;
	padding-bottom: 5;
	border: 1px solid #353d43;
	border-radius: 5px;
	background-color: #353d43;
`;
const TopView = styled.View`
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	height: 50%;
	padding-right: 10;
	padding-left: 10;
	color: white;
	font-size: 12px;
	font-weight: 300;
`;
const BottomView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 50%;
	padding-right: 10;
	padding-left: 10;
	color: white;
`;
const Count = styled.Text`
	color: white;
	font-size: 12px;
	font-weight: 200;
`;
const LinkBtn = styled.TouchableOpacity``;
const Link = styled.Text`
	color: tomato;
	font-size: 12px;
	font-weight: 200;
`;

export default function News() {
	const isDark = useColorScheme() === "dark";

	const { isLoading, data, isRefetching } = useQuery({
		queryKey: ["news"],
		queryFn: listNews,
	});

	const queryClient = useQueryClient();
	const onRefresh = async () => {
		queryClient.refetchQueries({ queryKey: ["news"] });
	};

	const openWebLink = async (url) => {
		await WebBrowser.openBrowserAsync(url);
	};

	return isLoading ? (
		<Loader />
	) : data ? (
		<FlatList
			style={{
				flex: 1,
				backgroundColor: "#1e272e",
				paddingRight: 5,
				paddingLeft: 10,
				paddingBottom: 10,
			}}
			onRefresh={onRefresh}
			refreshing={isRefetching}
			data={data}
			ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
			keyExtractor={(item) => item.id + ""}
			renderItem={({ item }) => (
				<Wrapper>
					<TopView>
						{item.title.slice(0, 80)}
						{item.title.length > 80 ? "..." : null}
					</TopView>
					<BottomView>
						<Count>
							👍 {item.points} 💭 {item.num_comments}
						</Count>
						<LinkBtn onPress={() => openWebLink(item.url)}>
							<Link>Read 👉</Link>
						</LinkBtn>
					</BottomView>
				</Wrapper>
			)}
		/>
	) : null;
}
