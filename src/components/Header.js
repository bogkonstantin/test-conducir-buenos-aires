import * as React from "react";
import SelectLanguage from "./SelectLanguage";
import Stat from "./Stat";

const Header = ({number, language, onUpdateLang, stat}) => {
    return (
        <div className="mb-8">
            <div className="flex flex-row items-center justify-between">
                <h3 className="text-sm">Вопрос {number}</h3>
                <SelectLanguage language={language}
                                onChange={onUpdateLang}/>
            </div>
            <div>
                <Stat stat={stat}/>
            </div>
        </div>
    );
}

export default Header;
