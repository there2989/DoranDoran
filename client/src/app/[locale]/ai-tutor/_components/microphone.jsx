'use client';

import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchChatMessages, addResponseMessage, addMyMessage, addSimpleResponseMessage, addSimpleMyMessage, deleteMyMessage } from '@/store/ai-tutor';
import Image from 'next/image';
import MicrophoneNormal from '@/public/icon/microphone-normal.webp';
import MicrophoneActive from '@/public/icon/microphone-active.webp';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Microphone({ handleListening, onRecordingComplete, params }) {
  const recordMessageRef = useRef(''); // 음성 인식 메시지 저장
  const [transcript, setTranscript] = useState(''); // 최종 인식된 텍스트 저장
  const [progress, setProgress] = useState(0);
  const [isListening, setIsListening] = useState(false); // 음성 인식 중인지 여부
  const [isRecording, setIsRecording] = useState(false); // 녹음 중인지 여부
  const isListeningRef = useRef(isListening); // 최신 isListening 값을 추적
  const recognitionRef = useRef(null); // SpeechRecognition 객체 참조
  const mediaRecorderRef = useRef(null); // MediaRecorder 참조
  const dispatch = useDispatch();
  const audioChunks = useRef([]);
  const audioContext = useRef(null);
  const locale = params.locale;
  const role = params.people;
  const situation = params.topic;


  useEffect(() => {
    console.log('isListening updated:', isListening)
    isListeningRef.current = isListening; // isListening 값 변경 시 최신 값으로 갱신
  }, [isListening]);
  
  useEffect(() => {
    recordMessageRef.current = transcript
  }, [transcript])

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + (100 / 30) : (setIsListening(false), clearInterval(interval), 100))); // 30초 동안 100%로 증가
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [isListening, progress]);

  const toggleListening = () => {
    if (!isListening) {
      setProgress(0);
      startRecording();
      startListening();
      handleListening()
    } else {
      stopListening();
      stopRecording();
      handleListening()
    }
  };

  // 음성 인식 시작 함수
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      createNewRecognitionInstance(); // 새로운 recognition 인스턴스 생성

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true); // 음성 인식이 시작되면 상태를 true로 설정
      };

      recognitionRef.current.onresult = (event) => {
        console.log("Speech recognition result event fired")
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript; // 최종 결과 저장
          }
        }
        console.log("Final Transcript:", finalTranscript);
        setTranscript((prevTranscript) => prevTranscript + ' ' + finalTranscript); // 최종 결과 누적
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening(); // 에러 발생 시 인식 중단
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        console.log("Current isListeningRef:", isListeningRef.current); // Ref 값을 확인
      
        // isListening이 true일 때만 재시작
        if (isListeningRef.current) {
          console.log("Restarting speech recognition...");
          startListening(); // 종료 시 다시 음성 인식 시작
        }
      };

      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const createNewRecognitionInstance = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.lang = 'ko-KR'; // 사용할 언어 설정
    recognition.interimResults = false; // 중간 결과 수신 여부
    recognition.maxAlternatives = 1; // 결과 대안 개수
    recognition.continuous = false; // 연속 인식 비활성화

    recognitionRef.current = recognition; // 새로운 recognition 인스턴스를 참조
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop(); // 음성 인식을 중단
      isListeningRef.current = false; // 수동으로 중지 시 상태를 false로 설정
      setIsListening(false); // 음성 인식 중단 시 상태 변경
      console.log("Speech recognition stopped");
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext({ sampleRate: 16000 });

      // 녹음 청크 초기화
      audioChunks.current = [];

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunks.current.push(e.data); // 녹음 데이터 저장
      };

      mediaRecorder.onstop = () => {
        if (!isListeningRef.current) {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          convertToPCM(audioBlob); // PCM 변환 및 전송
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          onRecordingComplete();
          setIsListening(false);
        }
      }, 30000); // 30초 후 자동 중지
    } catch (error) {
      console.error("녹음 시작 오류:", error);
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    onRecordingComplete();
  };

  // PCM 변환 후 데이터 전송
  const convertToPCM = async (audioBlob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);

    const rawPCM = convertToRawPCM(audioBuffer);
    sendForm(rawPCM);
  };

  const convertToRawPCM = (audioBuffer) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2; // 16-bit PCM
    const result = new DataView(new ArrayBuffer(length));

    let offset = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = audioBuffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        result.setInt16(offset, intSample * 0x7fff, true); // 16-bit PCM
        offset += 2;
      }
    }
    return result;
  };

  const sendForm = (pcmData) => {
    const blob = new Blob([pcmData], { type: 'audio/raw' });
    const formData = new FormData();

    formData.append('msg', recordMessageRef.current);
    formData.append('file', blob, 'recording.raw');

    dispatch(fetchChatMessages({ role, situation, locale, formData }))
      .unwrap()
      .then((response) => {
        const audio = new Audio('/bgm/message-incoming.mp3')
        audio.play();
        const messageContent = recordMessageRef.current || 'Please speak';
        dispatch(addMyMessage({ content: messageContent, score: response.data.pronunciation }));
        dispatch(addSimpleMyMessage({ content: messageContent }));
        dispatch(addResponseMessage(response.data));
        dispatch(addSimpleResponseMessage(response.data));
        dispatch(deleteMyMessage());

        return response
      })
      .then((response) => {
        if (!response.data.isOver) {
          dispatch(addMyMessage({ content: '', score: 0 }));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='flex-col flex items-center justify-center min-w-[60vw] relative'>
      <div className="relative flex items-center justify-center w-[16vh] h-[16vh]">
        <CircularProgressbar
          value={progress}
          strokeWidth={5}
          styles={buildStyles({
            pathColor: progress === 100 ? '#ACACAC' : `rgba(255, 0, 0, ${progress / 100})`,
            trailColor: '#ACACAC',
          })}
          className="absolute inset-0"
        />
        <button onClick={toggleListening}>
          {isListening ? (
            <Image src={MicrophoneActive} alt="microphone_icon" className="absolute w-[13vh] h-[13vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer opacity-50" />
          ) : (
            <Image src={MicrophoneNormal} alt="microphone_icon" className="absolute w-[13vh] h-[13vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
          )}
        </button>
      </div>
      <div className="absolute text-center text-white text-md md:text-2xl lg:text-4xl top-1/2 transform -translate-y-1/2 pointer-events-none">
        {transcript}
      </div>
    </div>
  );
}
