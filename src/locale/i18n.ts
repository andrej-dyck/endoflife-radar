import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json' assert { type: 'json ' }

void i18n
  .use(initReactI18next)
  .init({
    ns: [ 'ui' ],
    resources: { en },
    fallbackLng: 'en',
    defaultNS: 'ui',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  })

export default i18n
