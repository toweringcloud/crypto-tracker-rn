import { FlatList, useColorScheme, View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listCoins } from "../api";
import Loader from "../components/Loader";

const Wrapper = styled.TouchableOpacity`
	flex: 1;
	align-items: center;
	justify-content: center;
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
	font-weight: 300;
	color: ${(props) => (props.isDark ? "yellow" : "white")};
`;

export default function Coins() {
	const isDark = useColorScheme() === "dark";
	const navigation = useNavigation();
	const goToDetail = (item) => {
		navigation.navigate("Stack", {
			screen: "Detail",
			params: { title: item.name, id: item.id },
		});
	};

	const { isLoading, data, isRefetching } = useQuery({
		queryKey: ["coins"],
		queryFn: listCoins,
	});

	const queryClient = useQueryClient();
	const onRefresh = async () => {
		queryClient.refetchQueries({ queryKey: ["coins"] });
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
			numColumns={3}
			ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
			keyExtractor={(item) => item.id + ""}
			renderItem={({ item }) => (
				<Wrapper onPress={() => goToDetail(item)}>
					<FontAwesome6 name="coins" color={"#26aee6"} size={30} />
					<Title isDark={isDark}>{item.name}</Title>
				</Wrapper>
			)}
		/>
	) : null;
}
