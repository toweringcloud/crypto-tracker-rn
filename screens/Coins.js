import { FlatList, Image, Text, View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listComics } from "../api";
import Loader from "../components/Loader";

const Wrapper = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	margin-right: 15;
	padding-top: 20;
	padding-bottom: 15;
	border: 1px solid #26aee6;
	border-radius: 10px;
	background-color: #353d43;
`;
const Title = styled.Text`
	margin-top: 5;
	font-size: 16;
	font-weight: 600;
	color: white;
`;

export default function Coins() {
	const { isLoading, data, isRefetching } = useQuery({
		queryKey: ["coins"],
		queryFn: listComics,
	});

	const queryClient = useQueryClient();
	const onRefresh = async () => {
		queryClient.refetchQueries({ queryKey: ["coins"] });
	};

	return isLoading ? (
		<Loader />
	) : data ? (
		<FlatList
			onRefresh={onRefresh}
			refreshing={isRefetching}
			data={data}
			numColumns={3}
			ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
			keyExtractor={(item) => item.id + ""}
			renderItem={({ item }) => (
				<Wrapper>
					<FontAwesome6 name="coins" color={"#26aee6"} size={30} />
					<Title>{item.name}</Title>
				</Wrapper>
			)}
			style={{
				flex: 1,
				backgroundColor: "#1e272e",
				paddingRight: 5,
				paddingLeft: 10,
			}}
		/>
	) : null;
}
