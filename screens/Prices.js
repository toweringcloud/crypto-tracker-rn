import { FlatList, Image, Text, useColorScheme, View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listTickers, LOGO_URL } from "../api";
import Loader from "../components/Loader";

const Wrapper = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-top: 15;
`;
const Title = styled.Text`
	color: white;
	font-size: 16px;
	font-weight: 600;
	margin-left: 10px;
`;
const Price = styled.Text`
	color: white;
	font-size: 12px;
	font-weight: 400;
`;
const Ratio = styled.Text`
	color: ${(props) => (props.value > 0 ? "red" : "blue")};
	font-size: 12px;
	font-weight: 200;
`;

export default function Prices() {
	const isDark = useColorScheme() === "dark";

	const { isLoading, data, isRefetching } = useQuery({
		queryKey: ["tickers"],
		queryFn: listTickers,
	});

	const queryClient = useQueryClient();
	const onRefresh = async () => {
		queryClient.refetchQueries({ queryKey: ["tickers"] });
	};

	return isLoading ? (
		<Loader />
	) : data ? (
		<FlatList
			style={{
				flex: 1,
				backgroundColor: "#1e272e",
				paddingRight: 10,
				paddingLeft: 10,
				paddingBottom: 10,
			}}
			onRefresh={onRefresh}
			refreshing={isRefetching}
			data={data}
			ItemSeparatorComponent={() => (
				<View
					style={{
						height: 10,
						borderBottomWidth: 0.5,
						borderBottomColor: "rgba(255, 255, 255, 0.2)",
					}}
				/>
			)}
			keyExtractor={(item) => item.id + ""}
			renderItem={({ item }) => (
				<Wrapper>
					<View
						style={{ flexDirection: "row", alignItems: "center" }}
					>
						{/* <Image
							style={{
								width: 30,
								height: 30,
								borderRadius: 15,
								marginRight: 10,
							}}
							source={{
								uri: `${LOGO_URL}/${item.symbol.toLowerCase()}`,
							}}
						/> */}
						<FontAwesome6
							name="coins"
							color={"#26aee6"}
							size={25}
						/>
						<Title>{item.name}</Title>
					</View>
					<View style={{ alignItems: "flex-end" }}>
						<Price>{item.quotes.USD.price.toFixed()}</Price>
						<Ratio value={item.quotes.USD.percent_change_24h}>
							{item.quotes.USD.percent_change_24h > 0 ? "▲" : "▼"}{" "}
							{item.quotes.USD.percent_change_24h}%
						</Ratio>
					</View>
				</Wrapper>
			)}
		/>
	) : null;
}
