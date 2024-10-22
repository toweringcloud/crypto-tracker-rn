export const LOGO_URL = "https://coinicons-api.vercel.app/api/icon";
// https://coinicons-api.vercel.app/api/icon/BTC -> 404 Error

export const listCoins = () =>
	fetch("https://api.coinpaprika.com/v1/coins").then((res) =>
		res.json().then((json) =>
			json
				.filter((coin) => coin.rank !== 0)
				.filter((coin) => coin.is_active === true)
				.slice(0, 100)
		)
	);

export const infoCoin = ({ queryKey }) => {
	const [_, query] = queryKey;
	return fetch(`https://api.coinpaprika.com/v1/coins/${query}`).then((res) =>
		res.json()
	);
};

export const listTickers = () =>
	fetch("https://api.coinpaprika.com/v1/tickers").then((res) =>
		res
			.json()
			.then((json) =>
				json.filter((ticker) => ticker.circulating_supply !== 0)
			)
	);

export const listNews = () =>
	fetch(
		"https://hn.algolia.com/api/v1/search_by_date?query=cryptocurrency&tags=story&numericFilters=points>20"
	)
		.then((res) => res.json())
		.then((json) => json.hits);
