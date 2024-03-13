import { useTranslation } from 'react-i18next'
import { RadarIcon } from './icons/RadarIcon.tsx'
import { ProductSearch } from './ProductSearch.tsx'

export const App = () => {
  const { t } = useTranslation('ui')
  return (
    <header className="container flex flex-row flex-wrap items-start justify-between p-4 gap-2">
      <h1 className="inline-flex items-center gap-2"><RadarIcon /> {t('title')}</h1>
      <ProductSearch />
    </header>
  )
}
