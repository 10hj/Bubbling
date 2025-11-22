// --- 1. 한국어 문법 처리 헬퍼 함수 ---

/**
 * 단어의 마지막 글자에 받침이 있는지 확인합니다.
 * @param {string} word - 확인할 단어
 * @returns {boolean} - 받침 유무 (true/false)
 */
function hasFinalConsonant(word) {
  if (typeof word !== 'string' || word.length === 0) return false;
  const lastChar = word[word.length - 1];
  const charCode = lastChar.charCodeAt(0);
  // 한글 음절(가-힣) 범위 체크
  if (charCode >= 44032 && charCode <= 55203) {
    const finalConsonantCode = (charCode - 44032) % 28;
    return finalConsonantCode !== 0;
  }
  return false;
}

/**
 * 단어와 조사 종류에 따라 올바른 조사를 반환합니다. (ㄹ 받침 오류 수정)
 * @param {string} word - 조사가 붙을 단어
 * @param {string} particleType - '주격', '주제', '목적격', '보격', '목적격보어'
 * @returns {string} - 계산된 조사
 */
function getParticle(word, particleType) {
  if (typeof word !== 'string' || word.length === 0) return '';
  
  const lastChar = word[word.length - 1];
  const charCode = lastChar.charCodeAt(0);

  // 단어가 한글 음절로 끝나는지 확인
  if (charCode < 44032 || charCode > 55203) {
    const hasConsonant = false; // 한글이 아니면 받침 없다고 가정
    switch (particleType) {
        case '주격': return '가';
        case '주제': return '는';
        case '목적격': return '를';
        case '보격': return '가';
        case '목적격보어': return '로';
        default: return '';
    }
  }

  const finalConsonantCode = (charCode - 44032) % 28;
  const hasConsonant = finalConsonantCode !== 0;

  switch (particleType) {
    case '주격':
      return hasConsonant ? '이' : '가';
    case '주제':
      return hasConsonant ? '은' : '는';
    case '목적격':
      return hasConsonant ? '을' : '를';
    case '보격':
      return hasConsonant ? '이' : '가';
    case '목적격보어':
      const isRieul = finalConsonantCode === 8; // 'ㄹ' 받침의 종성 코드는 8입니다.
      return (isRieul || !hasConsonant) ? '로' : '으로';
    default:
      return '';
  }
}


/**
 * '가중치 추첨' 방식으로 특정 품사의 단어를 무작위로 선택합니다.
 * @param {Array} wordPool - 전체 단어 목록 (공통+테마)
 * @param {string} pos - 원하는 품사
 * @param {Array} themeWords - 현재 스크립트의 테마 단어 목록
 * @returns {string|null} - 선택된 단어
 */
function getRandomWordByPOS(wordPool, pos, themeWords = []) {
  const filteredWords = wordPool.filter(item => item.pos === pos && item.word);
  if (filteredWords.length === 0) {
    console.warn(`'${pos}' 품사에 해당하는 단어가 목록에 없습니다.`);
    return null;
  }
  
  const relevantThemeWords = themeWords
    .filter(item => item.pos === pos && item.word)
    .map(item => item.word);

  const lotteryBox = [];
  filteredWords.forEach(item => {
    lotteryBox.push(item.word);
    if (relevantThemeWords.includes(item.word)) {
      for (let i = 0; i < 9; i++) {
        lotteryBox.push(item.word);
      }
    }
  });

  if (lotteryBox.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * lotteryBox.length);
  return lotteryBox[randomIndex];
}

// --- 2. 문장 형식별 생성 함수 ---

// ▼▼▼ 수정된 부분 (Type 1) ▼▼▼
function generateType1(wordPool, themeWords) {
  const subject = getRandomWordByPOS(wordPool, '주어', themeWords);
  const verbStem = getRandomWordByPOS(wordPool, '서술어_1형식', themeWords);
  if (!subject || !verbStem) return null;
  const particle = getParticle(subject, Math.random() < 0.5 ? '주격' : '주제');
  
  const baseSentence = [{ text: subject, type: 'core' }, { text: particle, type: 'effect' }];

  // 50% 확률로 의문문 또는 평서문 결정
  if (Math.random() < 0.5) {
    // [기존] 평서문
    return [...baseSentence, { text: verbStem, type: 'core' }, { text: '다.', type: 'effect' }];
  } else {
    // [신규] 의문문 (ㄹ/을/까? 로직 수정)
    let finalVerbStem = verbStem;
    let questionEnding = '';
    
    const lastChar = verbStem[verbStem.length - 1];
    const charCode = lastChar.charCodeAt(0);
    
    if (charCode >= 44032 && charCode <= 55203) { // 한글 음절 범위
      const finalConsonantCode = (charCode - 44032) % 28;
      const hasConsonant = finalConsonantCode !== 0;
      const isRieul = finalConsonantCode === 8; // 'ㄹ' 받침

      if (isRieul) {
        // e.g., "만들" -> "만들" + "까?"
        finalVerbStem = verbStem;
        questionEnding = '까?';
      } else if (hasConsonant) {
        // e.g., "먹" -> "먹" + "을까?"
        finalVerbStem = verbStem;
        questionEnding = '을까?';
      } else {
        // e.g., "가" -> "갈" + "까?"
        // '가'(44032) + 'ㄹ'(8) = '갈'(44040)
        const newCharCode = charCode + 8; // 'ㄹ' 받침(8) 추가
        finalVerbStem = verbStem.slice(0, -1) + String.fromCharCode(newCharCode);
        questionEnding = '까?';
      }
    } else {
      // 한글이 아닌 경우 등 예외 처리
      finalVerbStem = verbStem;
      questionEnding = '까?';
    }
    
    return [...baseSentence, { text: finalVerbStem, type: 'core' }, { text: questionEnding, type: 'effect' }];
  }
}

// ▼▼▼ 수정된 부분 (Type 2) ▼▼▼
function generateType2(wordPool, themeWords) {
  const subject = getRandomWordByPOS(wordPool, '주어', themeWords);
  const complement = getRandomWordByPOS(wordPool, '보어', themeWords);
  const verbBase = Math.random() < 0.5 ? '되다' : '아니다';
  if (!subject || !complement) return null;
  const subjectParticle = getParticle(subject, Math.random() < 0.5 ? '주격' : '주제');
  const complementParticle = getParticle(complement, '보격');
  
  const baseSentence = [{ text: subject, type: 'core' }, { text: subjectParticle, type: 'effect' }, { text: complement, type: 'core' }, { text: complementParticle, type: 'effect' }];

  // 50% 확률로 의문문 또는 평서문 결정
  if (Math.random() < 0.5) {
    // [기존] 평서문
    return [...baseSentence, { text: verbBase + '.', type: 'effect' }];
  } else {
    // [신규] 의문문 (이 로직은 기존에도 정상이었습니다)
    const finalVerb = (verbBase === '되다') ? '될까?' : '아닐까?';
    return [...baseSentence, { text: finalVerb, type: 'effect' }];
  }
}

// ▼▼▼ 수정된 부분 (Type 3) ▼▼▼
function generateType3(wordPool, themeWords) {
  const subject = getRandomWordByPOS(wordPool, '주어', themeWords);
  const object = getRandomWordByPOS(wordPool, '목적어', themeWords);
  const verbStem = getRandomWordByPOS(wordPool, '서술어_3형식', themeWords);
  if (!subject || !object || !verbStem) return null;
  const subjectParticle = getParticle(subject, Math.random() < 0.5 ? '주격' : '주제');
  const objectParticle = getParticle(object, '목적격');
  
  const baseSentence = [{ text: subject, type: 'core' }, { text: subjectParticle, type: 'effect' }, { text: object, type: 'core' }, { text: objectParticle, type: 'effect' }];

  // 50% 확률로 의문문 또는 평서문 결정
  if (Math.random() < 0.5) {
    // [기존] 평서문
    return [...baseSentence, { text: verbStem, type: 'core' }, { text: '다.', type: 'effect' }];
  } else {
    // [신규] 의문문 (ㄹ/을/까? 로직 수정)
    let finalVerbStem = verbStem;
    let questionEnding = '';
    
    const lastChar = verbStem[verbStem.length - 1];
    const charCode = lastChar.charCodeAt(0);
    
    if (charCode >= 44032 && charCode <= 55203) { // 한글 음절 범위
      const finalConsonantCode = (charCode - 44032) % 28;
      const hasConsonant = finalConsonantCode !== 0;
      const isRieul = finalConsonantCode === 8; // 'ㄹ' 받침

      if (isRieul) {
        finalVerbStem = verbStem;
        questionEnding = '까?';
      } else if (hasConsonant) {
        finalVerbStem = verbStem;
        questionEnding = '을까?';
      } else {
        const newCharCode = charCode + 8; // 'ㄹ' 받침(8) 추가
        finalVerbStem = verbStem.slice(0, -1) + String.fromCharCode(newCharCode);
        questionEnding = '까?';
      }
    } else {
      finalVerbStem = verbStem;
      questionEnding = '까?';
    }
    
    return [...baseSentence, { text: finalVerbStem, type: 'core' }, { text: questionEnding, type: 'effect' }];
  }
}

// ▼▼▼ 수정된 부분 (Type 4) ▼▼▼
function generateType4(wordPool, themeWords) {
  const subject = getRandomWordByPOS(wordPool, '주어', themeWords);
  const indirectObject = getRandomWordByPOS(wordPool, '간접목적어', themeWords);
  const directObject = getRandomWordByPOS(wordPool, '직접목적어', themeWords);
  const verbStem = getRandomWordByPOS(wordPool, '서술어_4형식', themeWords);
  if (!subject || !indirectObject || !directObject || !verbStem) return null;
  const subjectParticle = getParticle(subject, Math.random() < 0.5 ? '주격' : '주제');
  const directObjectParticle = getParticle(directObject, '목적격');
  
  const baseSentence = [{ text: subject, type: 'core' }, { text: subjectParticle, type: 'effect' }, { text: indirectObject, type: 'core' }, { text: '에게', type: 'effect' }, { text: directObject, type: 'core' }, { text: directObjectParticle, type: 'effect' }];

  // 50% 확률로 의문문 또는 평서문 결정
  if (Math.random() < 0.5) {
    // [기존] 평서문
    return [...baseSentence, { text: verbStem, type: 'core' }, { text: '다.', type: 'effect' }];
  } else {
    // [신규] 의문문 (ㄹ/을/까? 로직 수정)
    let finalVerbStem = verbStem;
    let questionEnding = '';
    
    const lastChar = verbStem[verbStem.length - 1];
    const charCode = lastChar.charCodeAt(0);
    
    if (charCode >= 44032 && charCode <= 55203) { // 한글 음절 범위
      const finalConsonantCode = (charCode - 44032) % 28;
      const hasConsonant = finalConsonantCode !== 0;
      const isRieul = finalConsonantCode === 8; // 'ㄹ' 받침

      if (isRieul) {
        finalVerbStem = verbStem;
        questionEnding = '까?';
      } else if (hasConsonant) {
        finalVerbStem = verbStem;
        questionEnding = '을까?';
      } else {
        const newCharCode = charCode + 8; // 'ㄹ' 받침(8) 추가
        finalVerbStem = verbStem.slice(0, -1) + String.fromCharCode(newCharCode);
        questionEnding = '까?';
      }
    } else {
      finalVerbStem = verbStem;
      questionEnding = '까?';
    }
    
    return [...baseSentence, { text: finalVerbStem, type: 'core' }, { text: questionEnding, type: 'effect' }];
  }
}

// ▼▼▼ 수정된 부분 (Type 5) ▼▼▼
function generateType5(wordPool, themeWords) {
  const subject = getRandomWordByPOS(wordPool, '주어', themeWords);
  const object = getRandomWordByPOS(wordPool, '목적어', themeWords);
  const objComplement = getRandomWordByPOS(wordPool, '목적격보어', themeWords);
  const verbStem = getRandomWordByPOS(wordPool, '서술어_5형식', themeWords);
  if (!subject || !object || !objComplement || !verbStem) return null;
  const subjectParticle = getParticle(subject, Math.random() < 0.5 ? '주격' : '주제');
  const objectParticle = getParticle(object, '목적격');
  const objComplementParticle = getParticle(objComplement, '목적격보어');

  const baseSentence = [{ text: subject, type: 'core' }, { text: subjectParticle, 'type': 'effect' }, { text: object, type: 'core' }, { text: objectParticle, type: 'effect' }, { text: objComplement, type: 'core' }, { text: objComplementParticle, type: 'effect' }];
  
  // 50% 확률로 의문문 또는 평서문 결정
  if (Math.random() < 0.5) {
    // [기존] 평서문
    return [...baseSentence, { text: verbStem, type: 'core' }, { text: '다.', type: 'effect' }];
  } else {
    // [신규] 의문문 (ㄹ/을/까? 로직 수정)
    let finalVerbStem = verbStem;
    let questionEnding = '';
    
    const lastChar = verbStem[verbStem.length - 1];
    const charCode = lastChar.charCodeAt(0);
    
    if (charCode >= 44032 && charCode <= 55203) { // 한글 음절 범위
      const finalConsonantCode = (charCode - 44032) % 28;
      const hasConsonant = finalConsonantCode !== 0;
      const isRieul = finalConsonantCode === 8; // 'ㄹ' 받침

      if (isRieul) {
        finalVerbStem = verbStem;
        questionEnding = '까?';
      } else if (hasConsonant) {
        finalVerbStem = verbStem;
        questionEnding = '을까?';
      } else {
        const newCharCode = charCode + 8; // 'ㄹ' 받침(8) 추가
        finalVerbStem = verbStem.slice(0, -1) + String.fromCharCode(newCharCode);
        questionEnding = '까?';
      }
    } else {
      finalVerbStem = verbStem;
      questionEnding = '까?';
    }
    
    return [...baseSentence, { text: finalVerbStem, type: 'core' }, { text: questionEnding, type: 'effect' }];
  }
}
// ▲▲▲ 수정 완료 ▲▲▲

// --- 3. 메인 생성 함수 ---
function generateRandomSentence(wordPool, themeWords) {
  const sentenceTypes = [generateType1, generateType2, generateType3, generateType4, generateType5];
  const generate = (generator) => generator(wordPool, themeWords);

  let sentence = null;
  for (let i = 0; i < 10; i++) { // 단어 부족으로 생성이 안될 수 있으니 여러 번 시도
    const selectedGenerator = sentenceTypes[Math.floor(Math.random() * sentenceTypes.length)];
    sentence = generate(selectedGenerator);
    if (sentence) break; // 생성 성공 시 루프 탈출
  }

  if (!sentence) {
    console.error("단어 부족으로 문장 생성에 최종 실패했습니다.");
    return null;
  }
  
  return sentence;
}