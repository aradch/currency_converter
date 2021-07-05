const baseUrl = "https://www.nbrb.by/api/exrates/rates";

export const api = {
  apiData() {
    return fetch(`${baseUrl}?periodicity=0`).then((data) => data.json());
  },
  currencyData(currency) {
    return fetch(`${baseUrl}/${currency}?parammode=2`).then((data) =>
      data.json()
    );
  },
};
