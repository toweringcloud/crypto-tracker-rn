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

export const listTickers = () =>
	fetch("https://api.coinpaprika.com/v1/tickers").then((res) =>
		res
			.json()
			.then((json) =>
				json.filter((ticker) => ticker.circulating_supply !== 0)
			)
	);
