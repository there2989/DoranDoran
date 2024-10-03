'use client';

import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image'
import AiTutor from '@/public/bottom-bar/ai-tutor.webp'

export default function DayTask() {
  const [messages, setMessages] = useState(null);
  const locale = useLocale()

  useEffect(() => {
    async function loadMessages() {
      try {
        const loadedMessages = await import(`messages/${locale}.json`);
        setMessages(loadedMessages.default); // 메시지 로드
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`);
      }
    }
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div>Loading...</div>; // 메시지가 로드될 때까지 로딩 표시
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <TranslatedDayTask />
    </NextIntlClientProvider>
  );
}

function TranslatedDayTask() {
  const t = useTranslations('index');
  const user = useSelector((state) => state.user)
  const dayArray = [1, 2, 3, 4, 5, 6, 7]
  const missionStatus = user.mission.status.split('');

  return (
    <div className='flex'>
      {dayArray.map((item, index) => (
        <div
          key={index}
          className={`w-[12vw] h-[6vh] border border-[#CFF6F9] text-center text-sm md:text-2xl lg:text-4xl
            ${missionStatus[index] === '1' ? 'bg-[#2FB9FE]' : 'bg-transparent'}`}
        >
          D-{item}
        </div>
      ))}
    </div>
  );
}
