import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Globe, ChevronDown } from 'lucide-react';
import { Language } from '../../types';

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'am', name: 'Հայերեն', flag: '🇦🇲' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang?: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = (lang || i18n.language || 'am') as Language;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    if (newLang === currentLang) {
      setIsOpen(false);
      return;
    }

    i18n.changeLanguage(newLang);

    // Replace lang parameter in current route path cleanly
    const currentPath = location.pathname;
    let newPath = '';

    if (currentPath.startsWith('/am') || currentPath.startsWith('/ru') || currentPath.startsWith('/en')) {
      newPath = `/${newLang}${currentPath.substring(3)}`;
    } else {
      newPath = `/${newLang}${currentPath}`;
    }

    navigate(newPath, { replace: true });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-all cursor-pointer"
        aria-label="Switch Language"
      >
        <Globe size={14} className="text-blue-400" />
        <span>{currentLangObj.flag}</span>
        <span className="uppercase">{currentLangObj.code}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium transition-colors text-left ${
                currentLang === l.code
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
