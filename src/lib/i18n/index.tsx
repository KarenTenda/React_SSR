"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '../../../public/locales/en/translation.json';
import translationTN from '../../../public/locales/tunisia/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  tn: {
    translation: translationTN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
