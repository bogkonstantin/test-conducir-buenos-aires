import * as React from "react";
import SelectLanguage from "./SelectLanguage";
import Stat from "./Stat";
import { t } from "../lib/ui";

const Header = ({number, language, onUpdateLang, stat}) => {
    return (
        <div className="mb-7">
            <div className="flex flex-row items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 tnum">{t('question')} {number}</h3>
                <SelectLanguage language={language}
                                onChange={onUpdateLang}/>
            </div>
            <div className="mt-2">
                <Stat stat={stat}/>
            </div>
        </div>
    );
}

export default Header;
