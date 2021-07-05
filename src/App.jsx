import { useEffect, useState } from "react";
import "./App.css";
import CurrencyRow from "./CurrencyRow";
import { api } from "./api";

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [fromCurrencyScale, setFromCurrencyScale] = useState();
  const [fromCurrencyExchangeRate, setFromCurrencyExchangeRate] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [toCurrencyScale, setToCurrencyScale] = useState();
  const [toCurrencyExchangeRate, setToCurrencyExchangeRate] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInCurrency, setAmountInCurrency] = useState(true);
  const [fromCurrencySelected, setFromCurrencySelected] = useState(true);

  let fromAmount, toAmount;
  if (amountInCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInCurrency(true);
  };
  const handleToAmountChange = (e) => {
    setAmount(e.target.value);
    setAmountInCurrency(false);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
    setFromCurrencySelected(true);
  };
  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
    setFromCurrencySelected(false);
  };

  useEffect(() => {
    api.apiData().then((response) => {
      const firstCurrency = response[4];
      const secondCurrency = response[0];
      setCurrencyOptions(response.map((r) => r.Cur_Abbreviation));
      setFromCurrency(firstCurrency.Cur_Abbreviation);
      setToCurrency(secondCurrency.Cur_Abbreviation);
      setExchangeRate(
        (
          firstCurrency.Cur_OfficialRate / secondCurrency.Cur_OfficialRate
        ).toFixed(2)
      );
      setFromCurrencyScale(firstCurrency.Cur_Scale);
      setFromCurrencyExchangeRate(firstCurrency.Cur_OfficialRate);
      setToCurrencyScale(secondCurrency.Cur_Scale);
      setToCurrencyExchangeRate(secondCurrency.Cur_OfficialRate);
    });
  }, []);

  useEffect(() => {
    if (!!fromCurrency && exchangeRate !== undefined && fromCurrencySelected) {
      api.currencyData(fromCurrency).then((response) => {
        setFromCurrencyScale(response.Cur_Scale);
        setFromCurrencyExchangeRate(response.Cur_OfficialRate);
        setExchangeRate(
          (
            response.Cur_OfficialRate /
            response.Cur_Scale /
            (toCurrencyExchangeRate / toCurrencyScale)
          ).toFixed(2)
        );
      });
    } else if (
      !!toCurrency &&
      exchangeRate !== undefined &&
      !fromCurrencySelected
    ) {
      api.currencyData(toCurrency).then((response) => {
        setToCurrencyScale(response.Cur_Scale);
        setToCurrencyExchangeRate(response.Cur_OfficialRate);
        setExchangeRate(
          (
            fromCurrencyExchangeRate /
            fromCurrencyScale /
            (response.Cur_OfficialRate / response.Cur_Scale)
          ).toFixed(2)
        );
      });
    }
  }, [fromCurrency, toCurrency]);

  return (
    <>
      <h1>Currency converter</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={handleFromCurrencyChange}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={handleToCurrencyChange}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
