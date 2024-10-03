'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal/modal'
import { useLocale, useTranslations, NextIntlClientProvider } from 'next-intl';
import Signs from "@/public/icon2/signs.webp";
import Itemlist from "./_components/itemlist";
import ShopCharacter from "@/public/icon2/shop-character.webp";
import ShopColor from "@/public/icon2/shop-color.webp";
import ShopEquipment from "@/public/icon2/shop-equipment.webp";
import ShopBackground from "@/public/icon2/shop-background.webp";
import ShopItem from "@/public/icon2/shop-item.webp";
import ShopGambling from "@/public/icon2/shop-gambling.webp";

export default function Store() {
    const [messages, setMessages] = useState(null);
    const locale = useLocale();
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [modalMessage, setModalMessage] = useState(null)
    const router = useRouter()
  
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
        <TranslatedStorelist />
      </NextIntlClientProvider>
    );
  }

function TranslatedStorelist() {
  const t = useTranslations('index');

  const items = [
    { itemType: 0, itemName: t('character'), itemIcon: ShopCharacter, itemCost: '8000' },
    { itemType: 1, itemName: t('color'), itemIcon: ShopColor, itemCost: '8000' },
    { itemType: 2, itemName: t('equipment'), itemIcon: ShopEquipment, itemCost: '8000' },
    { itemType: 3, itemName: t('background'), itemIcon: ShopBackground, itemCost: '8000' },
    { itemType: 4, itemName: t('item'), itemIcon: ShopItem, itemCost: '8000' },
    { itemType: 5, itemName: t('gambling'), itemIcon: ShopGambling, itemCost: '8000' },
  ];

  const handleYesClick = (buttonLink) => {
    setIsOpenModal(false)
    if (buttonLink === 'ai-tutor') {
      dispatch(resetState())
      clearChatDataFromLocalStorage()
    }
    router.push(`/${locale}/${buttonLink}`)
  }

  const handleOpenModal = (messageIndex) => {
    setModalMessage(modalMessages[messageIndex])
    setIsOpenModal(true)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
  }

  const modalMessages = [
    // 색 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-color?',
      'background': 'bird',
      'buttonLink': 'shop',
      'buttonType': 1
    },
    // 장비 구매 물어보는 메세지
    {
      'message': 'would-you-like-to-purchase-random-equipment?',
      'background': 'bird',
      'buttonLink': 'shop',
      'buttonType': 1
    },
    // 구매 성공 메세지
    {
      'message': 'would-you-like-to-return-to-the-home-screen?',
      'background': 'bird',
      'buttonLink': 'room',
      'buttonType': 1
    },
    // 구매 실패 메세지
    {
      'message': 'would-you-like-to-return-to-the-home-screen?',
      'background': 'bird',
      'buttonLink': 'shop',
      'buttonType': 2
    },
  ]

  return (
    <div className="w-[100vw] h-[100vh] relative">
      <section className="w-[90vw] h-[75vh] top-[10%] left-[5%] absolute bg-[#D9D9D9] bg-opacity-[30%] rounded-[20px] border-[3px] border-[#ffffff]">
        <Image
          src={Signs}
          alt="signs"
          className="w-[30%] h-[10%] left-[35%] absolute"
        />
        <div className="w-[30%] h-[10%] top-[2%] left-[35%] absolute grid place-items-center">
          <span className="text-base sm:text-2xl base:text-3xl lg:text-4xl xl:text-5xl text-white">{t('store')}</span>
        </div>

        <article className="relative absolute top-[15%] grid grid-cols-2 gap-y-4 place-items-center text-sm sm:text-lg base:text-xl lg:text-2xl xl:text-3xl">
          {items.map((item, index) => (
            <Itemlist
              key={index}
              itemName={item.itemName} 
              itemIcon={item.itemIcon} 
              itemCost={item.itemCost}
              itemType={item.itemType}
            />
          ))}
        </article>
      </section>
    </div>
  );
}