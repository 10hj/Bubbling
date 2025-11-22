// --- 1. 전역 변수 및 상수 ---
const COMMON_WORDS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRsSW-Kw1VVCMV30CsrZHKUaxhRcHSCEn_XFy57qY8KoDd8VjmqAb5qexwX3pmtjfDP2WE0beJsIo-Z/pub?output=csv';
let commonWords = [];
let themeWords = [];
let cleanData = [];

const rePromptPhrases = [
  "다시 한번 표현해보세요",
  "조금 더 들어볼까요?",
  "계속 편하게 이야기하세요",
  "편하게 말씀해주세요",
  "계속 듣고 있어요",
  "편하게 말씀해주세요",
  "편하게 얘기하세요",
  "계속 이야기해도 좋아요.",
  "조금 더 이어가볼까요?"
];

const positiveKeywords = [
  '네', '네네', '응', '어', '괜찮아', '괜찮아요', '좋아', '좋아요', '문제없어', '문제없어요', '거뜬해요', '걱정마세요', '맞아요'
];
const negativeKeywords = [
  '아니요', '아니', '그저그래', '그저그래요', '좋지않아', '좋지않아요', '안좋아요', '안좋아', '별로안좋아', '안괜찮아요', '괜찮지않아요', '별로야', '불편해', '불편해요', '아파', '아파요', '기분안좋아', '기분별로야', '상태별로', '상태별로라고', '별로괜찮지않아', '딱히좋아보이지않아', '썩괜찮진않아', '편하지않아', '마음이무거워', '몸이영안좋아', '영기분이안좋아', '기분이가라앉아', '아무렇지않진않아', '상태가안좋네', '그냥그렇지뭐', '썩좋진않아', '좋은상태아니야', '별로기분이아니야', '좀힘들어', '기운이없어', '영별로야', '안좋아요', '불편하네요', '답답해', '답답해요', '괜찮다고는못겠어', '좋아보이지않아', '기분이꿀꿀해', '꿀꿀해요', '그다지좋아보이진않아', '불편합니다', '상태가영아니에요', '영불편해', '딱히괜찮진않아', '별로예요', '좋다고는못해요', '기분이별로입니다', '편치않아요', '속이안좋아요', '몸이좀아파', '컨디션이별로야', '썩좋지않아요', '좀불편해', '상태가좋지않아', '별로괜찮진않아', '그리좋아보이진않아', '그냥기분이안좋아', '영안좋아', '살짝아파', '별로마음이편하지않아', '우울해', '우울해요', '약간힘들어요', '피곤해', '피곤해요', '지쳐요', '지쳤어', '그닥이야', '영마음이안편해', '속이울렁거려', '속이안편해', '머리가아파', '머리가지끈거려', '속이매스꺼워', '가슴이답답해', '마음이불편해', '좋다고하기어려워', '그냥시원찮아', '별로기분이안좋아', '덜괜찮아', '영시원치않아', '마음이힘들어', '상쾌하지않아', '찝찝해', '찝찝해요', '미묘해', '미묘해요', '썩유쾌하진않아', '좋을게없어', '좋진않아', '시큰둥해', '시큰둥해요', '아쉽다', '아쉬워요', '별로반갑지않아', '별로기쁘지않아', '신나지않아', '흥나지않아', '들뜨지않아', '의욕이없어', '의욕이안나', '의욕이떨어져', '힘이없어', '무기력해', '무기력해요', '축처져', '처졌어', '에너지없어요', '에너지가고갈돼', '싫어', '싫어요', '마음이무겁다', '마음이가라앉아', '좀별로', '좀그래요', '좋다고는못해', '기분이안산다', '기분이축처져', '마음이힘들다', '마음이답답하다', '찡하다', '속상해', '속상해요', '섭섭하다', '섭섭해요', '서운하다', '서운해요', '짜증나', '짜증나요', '거북해', '거북해요', '언좒아', '언좒아요', '마뜩잖아', '마뜩잖아요', '시원찮아', '시원찮아요', '꿀꿀하다', '꿀꿀해요', '답답하다', '답답하네요', '편하지않다', '편하지않아요', '좋다고할수없어', '그럭저럭이에요', '좀꺼림칙해', '꺼림칙해요', '영꺼림칙해', '안기뻐요', '기쁘지않아요', '불만족스러워', '불만족스러워요', '마음에안들어', '마음에안들어요', '별로만족스럽지않아', '불쾌해', '불쾌해요', '불쾌하다', '언좒다', '언좒습니다', '마음불편합니다', '좋지못합니다', '유쾌하지않다', '유쾌하지않아요', '기쁘지않다', '기쁘지않아요', '기분이무겁다', '마음이어둡다', '무겁다', '무겁네요', '그냥안좋다', '안좋습니다', '편찮다', '편찮아요', '안좋아보인다', '덜좋아요', '영안좋아보인다', '좀그렇다', '좀별로다', '그다지아니에요', '그렇게좋지않다', '영시원찮네요', '마음이언좒습니다', '불편스럽다', '불편스럽네요', '좋을게없어요', '기운빠져요', '기운이빠졌다', '힘들어요', '힘들다', '아프다', '아픕니다', '고통스럽다', '고통스러워요', '괴롭다', '괴로워요', '찝찝하다', '마음이불편하다', '기분이좋지않다', '안좋아보여', '별로라고할수있어', '좋진않다', '만족스럽지않다', '의미없어요', '별의미없어요', '기대이하예요', '실망했어', '실망스러워', '실망스럽다', '실망이에요', '아쉽습니다', '마음이아프다', '속상합니다', '피곤합니다', '지쳤습니다', '힘빠져요', '의욕이없습니다', '무력해요', '무력하다', '쓸쓸해요', '쓸쓸하다', '허무해', '허무해요', '헛헛해', '헛헛해요', '공허해', '공허해요', '기분이텅빈다', '공허합니다', '외로워', '외로워요', '고독해', '고독해요', '서럽다', '서러워요', '우울하다', '우울합니다', '침울하다', '침울해요', '암울하다', '암울해요', '가라앉아요', '기분이죽는다', '안괜찮다', '괜찮지않다', '마음이괴롭다', '마음이힘겹다', '고달프다', '고단하다', '고단해요', '지쳤네요', '힘겹다', '힘겹네요', '속이안좋네요', '머리아프다', '머리아파요', '속불편하다', '속불편해요', '불안하다', '불안해요', '초조하다', '초조해요', '마음이안놓인다', '찝찝합니다', '거슬려요', '거슬린다', '불만이다', '불만스러워요', '만족못해요', '마음이무겁습니다', '덜좋아', '덜괜찮아', '마음이상했어', '마음이상했어요', '기분상했어', '기분상했어요', '찡해', '찡하네요', '그리좋지않다', '좋다고못해', '좋지않아보여', '덜괜찮네요', '시원치않다', '시원치않아요', '마뜩지않아', '마뜩지않아요'
];

// ▼▼▼ [스낵바 전역 변수] ▼▼▼
let snackbarHideTimer = null; // 스낵바 타이머 ID 저장용
const hintTexts = [
    "당신이 지금 한 말, 정말 감정 그대로 표현된 것이 맞나요?",
    "그 '괜찮음'이, 당신의 감정을 있는 그대로 보여주고 있나요?",
    "혹시, 말과 감정이 조금 다른 모습은 아닌가요?",
    "지금 그 말이, 당신의 진심과 같은 모습이라고 생각하시나요?"
];
let positiveResponseCounter = 0; // "괜찮아요" 카운터
// ▲▲▲ [스낵바 전역 변수] ▲▲▲


// --- 2. 웹 음성 API 설정 ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) console.error("이 브라우저는 음성 인식을 지원하지 않습니다.");
const recognition = new SpeechRecognition();
recognition.lang = 'ko-KR';
recognition.interimResults = false;
recognition.continuous = false;
let resultProcessed = false; 
let isDisplayingSentence = false; // (이 변수는 16:21 코드에서 사용되지 않음, 상태 추적용 변수와 중복됨)
let currentPhase = 'choice'; // ▼▼▼ [핵심] 'choice' (선택지) / 'reprompt' (재조합문장 후) 상태 추적 ▼▼▼

// --- 3. UI 제어 함수 ---

function setListeningUI(showText = true) { 
  statusText.textContent = showText ? '듣고 있어요...' : ''; 
  
  if (showText) {
    circle.classList.add('is-listening');
  } else {
    circle.classList.remove('is-listening');
  }
  
  listeningUI.classList.remove('hidden');
}

function setSpeakingUI() {
  statusText.textContent = '생성 중입니다...';
  circle.classList.add('is-listening');
  listeningUI.classList.remove('hidden');
}


// --- 4. 음성 인식 이벤트 핸들러 (로직 최적화) ---

recognition.onstart = () => { 
  if (!allowRecognition) { recognition.stop(); return; } 
  resultProcessed = false; 
  setListeningUI(false); 
};

// "듣고 있어요..." UI 및 빠른 템포 (원래대로)
recognition.onspeechstart = () => { 
  if (!allowRecognition) return; 
  setListeningUI(true); 
  document.getElementById('response-guides').classList.add('hidden');
  document.getElementById('re-prompt-guide').classList.remove('visible');
  const initialPrompt = document.getElementById('initial-voice-prompt');
  if (initialPrompt) initialPrompt.classList.remove('visible');
};

// "듣고 있어요..." UI 끄기 (원래대로)
recognition.onspeechend = () => { if (!allowRecognition) return; setListeningUI(false); }; 

recognition.onresult = async function (event) {
  if (!allowRecognition) return;
  resultProcessed = true; 

  const transcript = event.results[0][0].transcript.trim();
  const processedTranscript = transcript.replace(/\s/g, '');
  lastChangeTime = Date.now();
  console.log(`인식된 답변: "${transcript}"`);

  const responseGuides = document.getElementById('response-guides');
  const rePromptGuide = document.getElementById('re-prompt-guide');
  const initialVoicePrompt = document.getElementById('initial-voice-prompt'); 
  const sentenceContainer = document.getElementById('sentence-container');

  responseGuides.classList.add('hidden');
  rePromptGuide.classList.remove('visible');
  if (initialVoicePrompt) initialVoicePrompt.classList.remove('visible');
  sentenceContainer.innerHTML = ''; 

  const strictPositiveKeywords = ['괜찮아요', '괜찮아'];
  const strictNegativeKeywords = ['별로예요', '별로'];

  const isStrictNegative = strictNegativeKeywords.some(keyword => processedTranscript.includes(keyword.replace(/\s/g, '')));
  const isStrictPositive = strictPositiveKeywords.some(keyword => processedTranscript.includes(keyword.replace(/\s/g, '')));


  if (isStrictNegative) {
    console.log("부정 답변 감지. 해소 단계로 전환합니다.");
    currentPhase = 'choice'; // (상태 리셋)
    
    allowRecognition = false;
    recognition.stop();
    
    // main.js의 showTranscript 호출
    if (typeof showTranscript === 'function') {
      showTranscript(transcript);
    }
    
    setTimeout(() => {
      // resolution-phase.js의 startResolutionPhase 호출
      if (typeof startResolutionPhase === 'function') {
        startResolutionPhase();
      }
    }, 1000);

  // ▼▼▼ [수정] isStrictPositive 블록 (스낵바 2번째 1회, 1초 지연 로직) ▼▼▼
  } else if (isStrictPositive) {
    console.log("긍정 답변 감지. '재조합 문장(헛소리)'을 생성합니다.");
    
    allowRecognition = false;       
    currentPhase = 'reprompt'; // 👈 [핵심] "재조합 문장 후" 상태로 변경
    
    const sentenceParts = generateRandomSentence(cleanData, themeWords);
    
    if (sentenceParts) {
      // 1. 재조합 문장(헛소리)이 먼저 출력됩니다.
      await createSentence(sentenceParts);

      // 2. "괜찮아요" 카운터 증가
      positiveResponseCounter++;
      console.log(`"괜찮아요" 카운트: ${positiveResponseCounter}`);

      // 3. "두 번째" 괜찮아요일 때만, 1초 "후에" 스낵바 1회 표시
      if (positiveResponseCounter === 2) {
          console.log("스낵바 힌트 1회 표시 (1초 지연)");
          
          setTimeout(() => { // 👈 1초 지연
              const snackbar = document.getElementById('hint-snackbar');
              const snackbarText = document.getElementById('snackbar-text');
              
              if (snackbar && snackbarText) {
                  if (snackbarHideTimer) {
                      clearTimeout(snackbarHideTimer);
                  }
                  
                  const randomHint = hintTexts[Math.floor(Math.random() * hintTexts.length)];
                  snackbarText.textContent = randomHint;
                  snackbar.classList.add('show');
                  
                  snackbarHideTimer = setTimeout(() => {
                      snackbar.classList.remove('show');
                      snackbarHideTimer = null;
                  }, 5500); // 5.5초 지속
              }
          }, 1000); // 👈 1초 지연
      }

      // 4. (기존 로직) 3초 지연 후, 다음 가이드와 음성인식이 나타납니다.
      setTimeout(() => {
        const randomPhrase = rePromptPhrases[Math.floor(Math.random() * rePromptPhrases.length)];
        rePromptGuide.textContent = randomPhrase;
        rePromptGuide.classList.add('visible');
        setListeningUI(false);

        allowRecognition = true;      
        recognition.start();          
      }, 3000); // 👈 3초 딜레이 (기존 수정 사항 유지)

    } else {
      console.error('문장 생성 실패. 다시 듣습니다.');
      currentPhase = 'choice'; // 👈 (예외) "선택지" 상태로 리셋
      responseGuides.classList.remove('hidden');
      setTimeout(() => {
        if (initialVoicePrompt) initialVoicePrompt.classList.add('visible');
      }, 1000);
      setListeningUI(false);
      
      allowRecognition = true;      
      // onend가 1초 뒤에 자동으로 recognition.start()를 호출해줄 것임.
    }
  // ▲▲▲ [스낵바 로직 적용 완료] ▲▲▲

  } else {
    // (무관한 답변)
    console.log(`무관한 답변 감지: "${transcript}". 다음 단계로 넘어가지 않고 다시 듣습니다.`);
    currentPhase = 'choice'; // 👈 [핵심] "선택지" 상태로 리셋
    responseGuides.classList.remove('hidden');
    
    // ▼▼▼ [수정] 무관한 답변 시, "기본" 가이드 텍스트로 복원 ▼▼▼
    setTimeout(() => {
      const initialPrompt = document.getElementById('initial-voice-prompt');
      if (initialPrompt) {
        initialPrompt.textContent = '마이크를 향해 당신의 감정을 들려주세요'; // 👈 [수정]
        initialPrompt.classList.add('visible');
      }
    }, 1000);
    // ▲▲▲ [수정 완료] ▲▲▲

    setListeningUI(false);
  }
};


// ▼▼▼ [수정] '상태(currentPhase)'를 확인하여 UI 리셋 결정 ▼▼▼
recognition.onend = () => {
  // (isDisplayingSentence 대신 allowRecognition 플래그로 재시작 자체를 제어)
  if (!allowRecognition) {
    console.log("음성 인식이 허용되지 않은 상태(문장 생성 중 등)이므로 중지합니다.");
    return;
  }

  // (결과 없이 종료된 경우)
  if (!resultProcessed) { 
    console.warn("No result/error processed. Resetting UI to default.");
    
    // [핵심] "선택지" 상태일 때만 선택지를 띄움
    if (currentPhase === 'choice') { 
      const responseGuides = document.getElementById('response-guides');
      const initialVoicePrompt = document.getElementById('initial-voice-prompt');
      if(responseGuides) responseGuides.classList.remove('hidden');
      
      // ▼▼▼ [수정] 결과 없이 종료 시, 백업 가이드 텍스트로 변경 ▼▼▼
      if(initialVoicePrompt) {
        initialVoicePrompt.textContent = '인식이 잘 안 되나요? 텍스트를 클릭할 수도 있어요.'; // 👈 [수정]
        initialVoicePrompt.classList.add('visible');
      }
      // ▲▲▲ [수정 완료] ▲▲▲
    }
    // 'reprompt' 상태일 때는 '다시 한번...' 가이드가 이미 떠 있으므로 아무것도 안 함.
    
    setListeningUI(false); 
  }

  console.log("음성 인식이 종료되었습니다. 1초 후 자동으로 다시 시작합니다.");
  setTimeout(() => {
    if (allowRecognition) { 
      recognition.start();
    }
  }, 1000); 
};

// ▼▼▼ [수정] '상태(currentPhase)'를 확인하여 UI 리셋 결정 ▼▼▼
recognition.onerror = (event) => {
  resultProcessed = true; 

  // (isDisplayingSentence 대신 allowRecognition 플래그로 제어)
  if (!allowRecognition) {
     console.warn(`Error ignored during sentence display: ${event.error}`);
     return; 
  }

  if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
    console.error('음성 인식 오류: 마이크 권한이 거부되었습니다.', event.error);
    statusText.textContent = '마이크 권H한을 허용해주세요';
    allowRecognition = false; 
    listeningUI.classList.remove('hidden'); 
    circle.classList.remove('is-listening');
    
  } else if (event.error === 'no-speech') {
    console.log("감지된 음성 없음. 계속 듣습니다. (UI 리셋)");
    
    // [핵심] "선택지" 상태일 때만 선택지를 띄움
    if (currentPhase === 'choice') { 
      const responseGuides = document.getElementById('response-guides');
      const initialVoicePrompt = document.getElementById('initial-voice-prompt');
      if(responseGuides) responseGuides.classList.remove('hidden');
      
      // ▼▼▼ [수정] 음성 없음 오류 시, 백업 가이드 텍스트로 변경 ▼▼▼
      if(initialVoicePrompt) {
        initialVoicePrompt.textContent = '인식이 잘 안 되나요? 텍스트를 클릭할 수도 있어요.'; // 👈 [수정]
        initialVoicePrompt.classList.add('visible');
      }
      // ▲▲▲ [수정 완료] ▲▲▲
    }
    // 'reprompt' 상태일 때는 '다시 한번...' 가이드가 이미 떠 있으므로 아무것도 안 함.
    
    setListeningUI(false); 

  } else {
    // 'network', 'audio-capture' 등 (마이크 권한 외) 다른 모든 오류
    console.error('음성 인식 오류 (UI 리셋 후 재시작 대기):', event.error);
    statusText.textContent = '음성 인식 중 오류 발생';

    // [핵심] "선택지" 상태일 때만 선택지를 띄움
    if (currentPhase === 'choice') { 
      const responseGuides = document.getElementById('response-guides');
      const initialVoicePrompt = document.getElementById('initial-voice-prompt');
      if(responseGuides) responseGuides.classList.remove('hidden');
      
      // ▼▼▼ [수정] 기타 오류 시, 백업 가이드 텍스트로 변경 ▼▼▼
      if(initialVoicePrompt) {
        initialVoicePrompt.textContent = '음성 인식 중 오류가 발생했습니다. 텍스트를 클릭해보세요.'; // 👈 [수정]
        initialVoicePrompt.classList.add('visible');
      }
      // ▲▲▲ [수정 완료] ▲▲▲
    }
    
    setListeningUI(false); 
    
    // onend 핸들러가 1초 뒤에 어차피 재시작을 시도할 것임
  }
};
// ▲▲▲ 수정 완료 ▲▲▲


// --- 5. 데이터 로드 및 인식 시작 함수 ---
let isDataLoading = false;
function loadCSVAndStartRecognition(themeUrl) {
  if (isDataLoading) return;
  isDataLoading = true;
  Promise.all([
    new Promise(resolve => Papa.parse(COMMON_WORDS_URL, { download: true, header: true, complete: resolve, error: (err) => console.error("공통 단어 로드 실패:", err) })),
    new Promise(resolve => Papa.parse(themeUrl, { download: true, header: true, complete: resolve, error: (err) => console.error("테마 단어 로드 실패:", err) }))
  ])
  .then(results => {
    commonWords = results[0].data.filter(row => Object.values(row).some(val => val && val.trim()));
    themeWords = results[1].data.filter(row => Object.values(row).some(val => val && val.trim()));
    cleanData = [...commonWords, ...themeWords];
    console.log(`데이터 로드 완료: 공통(${commonWords.length}개), 테마(${themeWords.length}개), 총(${cleanData.length}개)`);
    isDataLoading = false;

    if (cleanData.length === 0) {
        console.error("로드된 단어가 없습니다! 구글 시트 링크와 내용을 확인해주세요.");
        statusText.textContent = '단어 로딩 실패';
        return;
    }
    
    // ▼▼▼ [클릭 백업 로직 추가] ▼▼▼
    const guidePositive = document.getElementById('guide-positive');
    const guideNegative = document.getElementById('guide-negative');
    
    // 클릭 시 '가짜' 음성 인식 이벤트를 생성하여 onresult 함수를 직접 호출
    const createFakeEvent = (transcript) => {
        return { results: [[{ transcript: transcript, confidence: 1 }]] };
    };

    // 중복 등록을 방지하기 위해, 리스너가 없을 때만 추가
    if (!guidePositive.listenerAdded) {
        guidePositive.addEventListener('click', (e) => {
            // 현재 'choice' 단계가 아니거나, 음성 인식이 비활성화 상태면 무시
            if (!allowRecognition || currentPhase !== 'choice') return;
            console.log("클릭 백업: '괜찮아요'");
            e.stopPropagation(); // 이벤트 전파 중지
            recognition.onresult(createFakeEvent('괜찮아요'));
        });
        guidePositive.listenerAdded = true; // 리스너가 추가되었음을 표시
    }
    
    if (!guideNegative.listenerAdded) {
        guideNegative.addEventListener('click', (e) => {
            // 현재 'choice' 단계가 아니거나, 음성 인식이 비활성화 상태면 무시
            if (!allowRecognition || currentPhase !== 'choice') return;
            console.log("클릭 백업: '별로예요'");
            e.stopPropagation(); // 이벤트 전파 중지
            recognition.onresult(createFakeEvent('별로예요'));
        });
        guideNegative.listenerAdded = true; // 리스너가 추가되었음을 표시
    }
    // ▲▲▲ [클릭 백업 로직 추가 완료] ▲▲▲

    currentPhase = 'choice'; // [추가] (초기화) 첫 시작은 무조건 '선택지' 상태
    positiveResponseCounter = 0; // 새 에피소드 시작 시 스낵바 카운터 리셋
    
    // ▼▼▼ [수정] 안내 문구를 기본값으로 리셋 ▼▼▼
    const initialPrompt = document.getElementById('initial-voice-prompt');
    if (initialPrompt) {
        initialPrompt.textContent = '마이크를 향해 당신의 감정을 들려주세요';
    }
    // ▲▲▲ [수정 완료] ▲▲▲

    allowRecognition = true;
    recognition.start();
    startTimeoutChecker();
  })
  .catch(error => {
    isDataLoading = false;
    console.error('CSV 로드 중 오류 발생:', error);
    statusText.textContent = '데이터 로드에 실패했습니다.';
  });
}