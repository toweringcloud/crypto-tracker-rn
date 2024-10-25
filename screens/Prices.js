import { FlatList, useColorScheme, View } from "react-native";
import styled from "styled-components/native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listTickers, LOGO_URL } from "../api";
import Loader from "../components/Loader";

const Wrapper = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-right: 10;
	padding-top: 10;
	padding-bottom: 5;
`;
const RightView = styled.View`
	align-items: flex-end;
	justify-content: center;
	gap: 5;
`;
const LeftView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	gap: 5;
`;
const Symbol = styled.Image`
	height: 30px;
	width: 30px;
	margin-right: 10px;
	border-radius: 15px;
`;
const Title = styled.Text`
	margin-left: 10px;
	color: white;
	font-size: 16px;
	font-weight: 300;
`;
const Price = styled.Text`
	color: white;
	font-size: 12px;
	font-weight: 200;
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
		await queryClient.refetchQueries({ queryKey: ["tickers"] });
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
			ItemSeparatorComponent={() => (
				<View
					style={{
						height: 5,
						borderBottomWidth: 0.5,
						borderBottomColor: "rgba(255, 255, 255, 0.2)",
					}}
				/>
			)}
			keyExtractor={(item) => item.id + ""}
			renderItem={({ item }) => (
				<Wrapper>
					<LeftView>
						<Symbol
							source={{
								uri: `${LOGO_URL}/${item.symbol.toLowerCase()}`,
							}}
						/>
						<Title>{item.name}</Title>
					</LeftView>
					<RightView>
						<Price>{item.quotes.USD.price.toFixed()}</Price>
						<Ratio value={item.quotes.USD.percent_change_24h}>
							{item.quotes.USD.percent_change_24h > 0 ? "▲" : "▼"}{" "}
							{item.quotes.USD.percent_change_24h}%
						</Ratio>
					</RightView>
				</Wrapper>
			)}
		/>
	) : null;
}
