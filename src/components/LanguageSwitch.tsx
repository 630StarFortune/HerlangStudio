
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LanguageSwitchProps {
  onLanguageChange: (lang: 'zh' | 'en') => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    const lang = value as 'zh' | 'en';
    i18n.changeLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-32 bg-pink-500 text-white border-pink-600 hover:bg-pink-600">
        <SelectValue placeholder={t('languageSwitch')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="zh">🇨🇳 中文</SelectItem>
        <SelectItem value="en">🇺🇸 English</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitch;
