import * as React from 'react';
import { TEST_LOCALES, normalizeLocale } from "../lib/i18n";

const SelectLanguage = ({language, onChange}) => {
    return (
        <div>
            <label htmlFor="underline_select" className="sr-only">Language</label>
            <select id="underline_select"
                    value={normalizeLocale(language)}
                    onChange={(e) => onChange(e.target.value)}
                    style={{textAlignLast: 'right'}}
                    className="block w-full text-sm text-gray-500 focus:outline-none">
                {TEST_LOCALES.map(loc => (
                    <option key={loc.code} value={loc.code}>{loc.label}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectLanguage;
