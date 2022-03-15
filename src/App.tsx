import { FormEvent, useEffect, useState } from 'react';
import getSymbolFromCurrency from 'currency-symbol-map';
import { AiOutlineSwap } from 'react-icons/ai';

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
        const key = '2d5a6d1b1c324614fc706ccb127ecef1';
        let url = `http://data.fixer.io/api/latest?access_key=${key}`;

        fetch(url).then((response) => {
            return response.json()
        }).then(json => {
            setRates(json.rates);
            setDate(json.date);
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
            <div className="card">
                <h1>Currency Converter</h1>
                <p>last updated: <span>{date}</span></p>
                <form className="todoWrap" onSubmit={convertCurrencies}>
                    <input
                        type="number"
                        className="amount"
                        onChange={e => setAmount1(Number(e.target.value))}
                        required
                        placeholder='Enter Amount'
                    />
                    <div className="currencies">
                        <CurrencyInput
                            onCurrencyChange={handleCurrency1Change}
                            currencies={Object.keys(rates)}
                            currency={!invert ? currency1 : currency2}
                            label={"From"}
                            names={currentNames}
                        />
                        <div className="invert-currency">
                            <span onClick={invertCurrencies}>
                                <AiOutlineSwap size={30} color="coral" />
                            </span>
                        </div>
                        <CurrencyInput
                            onCurrencyChange={handleCurrency2Change}
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
                        Convert
                    </button>
                </form>
                <p className="result" style={amount2 && { visibility: 'visible' }}>{!invert ? symbol2 : symbol1} {amount2}</p>
            </div>
        </div>
    )
};
