'use client';

import { useSelector } from 'react-redux';
import QuizContentImageBox from "./quiz-content-image-box";
import { getLocalStorageData } from '@/store/quiz';

export default function QuizContentImage({ type, onButtonClick, clickedIndex }) {
  const localData = getLocalStorageData('dailyQuizData');
  const quizList = useSelector((state) => 
    type === 'daily' ? localData.data : state.quiz.stageDetail.data
  );
  const images = quizList[0]?.quizImages;

  const handleClick = (index) => {
    onButtonClick(index);
  };

  return (
    <div className=' grid grid-cols-2'>
      {images.length > 0 ? (
        images.map((item, index) => (
          <div key={index} onClick={() => handleClick(index)}>
            <QuizContentImageBox
              image={item}
              index={index}
              isSelected={clickedIndex === index}
            />
          </div>
        ))
      ) : (
        <div>No quiz content available.</div>
      )}
    </div>
  );
}
