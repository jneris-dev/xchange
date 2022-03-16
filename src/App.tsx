import { FormEvent, useEffect, useState } from 'react';
import getSymbolFromCurrency from 'currency-symbol-map';
import { AiOutlineSwap } from 'react-icons/ai';
import GithubCorner from 'react-github-corner';

import { CurrencyInput } from './components/CurrencyInput';
import './App.css'

export default function App() {
    const [rates, setRates] = useState([]);
    const [date, setDate] = useState('');

    const [currency1, setCurrency1] = useState('USD');
    const [currency2, setCurrency2] = useState('BRL');

    const [currentNames, setCurrentNames] = useState([]);

    const [amount1, setAmount1] = useState<number>();
    const [amount2, setAmount2] = useState<number>();

    const symbol1 = getSymbolFromCurrency(currency1);
    const symbol2 = getSymbolFromCurrency(currency2);

    const [invert, setInvert] = useState(false)

    const newDate = new Date(date).toDateString()

    function format(number: any) {
        return number.toFixed(2);
    }

    function handleCurrency1Change(currency1: string) {
        setCurrency1(currency1);
    }

    function handleCurrency2Change(currency2: string) {
        setCurrency2(currency2);
    }

    function convertCurrencies(event: FormEvent) {
        event.preventDefault();

        if (!invert) {
            setAmount2(format(amount1 * rates[currency2] / rates[currency1]));
        } else {
            setAmount2(format(amount1 * rates[currency1] / rates[currency2]));
        }
    }

    function invertCurrencies() {
        setInvert(!invert)
    }

    useEffect(() => {
        const x_rapidapi_host = 'currencyscoop.p.rapidapi.com';
        const x_rapidapi_key = '44dee845f9mshe02550efd959f1fp1ad37bjsna498e9eebe7d';

        fetch("https://currencyscoop.p.rapidapi.com/latest", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": x_rapidapi_host,
                "x-rapidapi-key": x_rapidapi_key
            }
        }).then((response) => {
            return response.json()
        }).then(json => {
            setRates(json.response.rates);
            setDate(json.response.date);
        })
    }, [])

    useEffect(() => {
        const x_rapidapi_host = 'currencyscoop.p.rapidapi.com';
        const x_rapidapi_key = '44dee845f9mshe02550efd959f1fp1ad37bjsna498e9eebe7d';

        fetch("https://currencyscoop.p.rapidapi.com/currencies", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": x_rapidapi_host,
                "x-rapidapi-key": x_rapidapi_key
            }
        }).then(response => {
            return response.json()
        }).then(json => {
            setCurrentNames(json.response.fiats)
        }).catch(err => {
            console.error(err);
        });
    }, [currency1, currency2])

    return (
        <div className="app">
            <GithubCorner
                href="https://github.com/jneris-dev/xchange"
                direction="left"
                bannerColor="#fff"
                octoColor="#264c37"
                size={60}
                target="_blank"
            />
            <div className="card">
                <h1>Currency Converter</h1>
                <p>last updated: <span>{newDate}</span></p>
                <form className="todoWrap" onSubmit={convertCurrencies}>
                    <div className="input-group">
                        <span className="symbol">
                            {!invert ? symbol1 : symbol2}
                        </span>
                        <input
                            type="number"
                            className="amount"
                            onChange={e => setAmount1(Number(e.target.value))}
                            required
                            defaultValue={amount1}
                            placeholder='Enter Amount'
                            step="any"
                        />
                    </div>
                    <div className="currencies">
                        <CurrencyInput
                            onCurrencyChange={!invert ? handleCurrency1Change : handleCurrency2Change}
                            currencies={Object.keys(rates)}
                            currency={!invert ? currency1 : currency2}
                            label={"From"}
                            names={currentNames}
                        />
                        <div className="invert-currency">
                            <span onClick={invertCurrencies}>
                                <AiOutlineSwap size={30} color="#264c37" />
                            </span>
                        </div>
                        <CurrencyInput
                            onCurrencyChange={!invert ? handleCurrency2Change : handleCurrency1Change}
                            currencies={Object.keys(rates)}
                            currency={!invert ? currency2 : currency1}
                            label={"To"}
                            names={currentNames}
                        />
                    </div>
                    <button
                        className="convert-button"
                        type="submit"
                    >
                        Convert Now
                    </button>
                </form>
                <p className="result" style={amount2 && { visibility: 'visible' }}>{!invert ? symbol2 : symbol1} {amount2}</p>
                <hr />
                <p>Result</p>
            </div>
        </div>
    )
};
