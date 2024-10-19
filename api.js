export const LOGO_URL = "https://coinicons-api.vercel.app/api/icon";
// https://coinicons-api.vercel.app/api/icon/BTC -> 404 Error

const CONIS_URL = "https://api.coinpaprika.com/v1/coins";

export const listComics = () =>
	fetch(CONIS_URL).then((res) =>
		res.json().then((json) =>
			json
				.filter((coin) => coin.rank !== 0)
				.filter((coin) => coin.is_active === true)
				.slice(0, 100)
		)
	);
