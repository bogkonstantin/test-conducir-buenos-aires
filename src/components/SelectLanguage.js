import * as React from 'react';

const SelectLanguage = ({language, onChange}) => {
    return (
        <div>
            <label htmlFor="underline_select" className="sr-only">Underline select</label>
            <select id="underline_select"
                    defaultValue={language}
                    onChange={(e) => onChange(e.target.value)}
                    style={{textAlignLast: 'right'}}
                    className="block w-full text-sm text-gray-500 focus:outline-none">
                <option value="0">Без перевода (выбор языка)</option>
                <option value="ru">Русский</option>
            </select>
        </div>
    );
};

export default SelectLanguage;
