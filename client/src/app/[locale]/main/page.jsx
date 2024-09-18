import { useTranslations } from 'next-intl';
import Bottom from '@/components/bottom/bottom'
import Top from '@/components/top/top'


export default function Login() {
  const t = useTranslations('index');

  return (
    <div>
      <Top />
      <div style={{fontSize: '50px', marginTop: '7vh'}}>{t('title')}</div>
      <div style={{fontSize: '50px'}}>{t('discuss-a-recent-movie-or-tv-show-you-watched')}</div>
      <Bottom />
    </div>
  );
}