import React from 'react';

import './styles.css'

import 'currency-flags/dist/currency-flags.min.css';

interface CurrencyProps {
    onCurrencyChange: (value: string) => void;
    currencies: Array<string>;
    currency: string;
    label: string;
    names: Array<string>;
}

export function CurrencyInput({
    onCurrencyChange,
    currencies,
    currency,
    label,
    names,
    ...props
}: CurrencyProps) {
    const lowCurrency = currency.toLowerCase();

    const currenciesCodes = Object.keys(names)

    return (
        <div className="wrap">
            <label>{label}</label>
            <div className="group">
                <div className={`currency-flag currency-flag-${lowCurrency}`}></div>
                <select value={currency} onChange={e => onCurrencyChange(e.target.value)}>
                    {currenciesCodes.map((currency => (
                        <option value={currency} key={currency}>
                            {names[currency].currency_code} - {names[currency].currency_name}
                        </option>
                    )))}
                </select>
            </div>
        </div>
    );
}