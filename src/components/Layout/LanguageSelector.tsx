import { Languages } from 'lucide-react';
import { useLanguage, Language } from '../../contexts/LanguageContext';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
  ];

  return (
    <div className="relative group">
      <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all">
        <Languages className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.flag} {languages.find(l => l.code === language)?.label}
        </span>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-all first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
