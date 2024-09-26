'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Level from "./level";
import LevelQuiz from "./levelquiz";
import Path from "@/public/path/path.webp";

const quizData = [
  { id: 1, name: 'Quiz 1' },
  { id: 2, name: 'Quiz 2' },
  { id: 3, name: 'Quiz 3' },
  { id: 4, name: 'Quiz 3' },
  { id: 5, name: 'Quiz 3' },

];

const pathHeight = 13;

const calculateTopPositions = (dataLength) => {
  const topPositions = [];
  let currentTop = 0;

  for ( let i = 0; i < dataLength; i++){
    const increment = (i % 2 === 1) ? pathHeight : pathHeight * 0.68;
    currentTop += increment;
    topPositions.push(`${currentTop}vh`);
  }
  return topPositions;
}

export default function StudyList({ className }) {
  const transforms = [
    '',
    'scaleY(-1)',           // 상하 반전
    'scaleX(-1)',           // 좌우 반전
    'scaleX(-1) scaleY(-1)',
  ];

  const quizPosition = ['93%','50%','7%','50%'];

  const topPositions = calculateTopPositions(quizData.length);

  const colorList = ['#FED9D0', '#E5CBF8', '#FDE1AF', '#E5CBF8'];

  return (
    <div className={`w-[80vw] h-auto left-[10vw] relative ${className}`}>
      <Level level={1} className="absolute left-1/2 top-[11vh] transform -translate-x-1/2 -translate-y-1/2 z-20"/>
      
      {quizData.map((quiz, index) => (
        <div key={quiz.id} className=" w-100%">
          <Image
            src={Path}
            alt="Path"
            className="absolute z-10"
            style={{
              transform: transforms[index % transforms.length], // 회전 및 반전 효과 적용
              width : "50%",
              height : `${pathHeight}vh`,
              top: topPositions[index], 
              left: `${((index & (1 << 1)) != 0) ? '0%' : '50%'}`, // 지그재그 형태로 배치
            }}
          />

          <LevelQuiz
            quizName={quiz.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              backgroundColor: colorList[index % colorList.length],
              top: `${index * pathHeight * 0.84 + 22}vh`, // Path와 Quiz의 간격 조정
              left: quizPosition[index % quizPosition.length], 
            }}
          />
        </div>
        ))}
    </div>
  );
}