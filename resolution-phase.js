// resolution-phase.js

function startResolutionPhase() {
  console.log("🎨 AI 추천 및 자유 발언 단계를 시작합니다.");

  // --- 1. 기존 UI 및 음성인식 정리 ---
  allowRecognition = false;
  if (recognition) recognition.stop();
  sentenceContainer.innerHTML = '';
  listeningUI.classList.add('hidden');
  document.getElementById('response-guides')?.classList.add('hidden');

  // --- 2. AI 추천 UI 준비 및 표시 ---
  const inspirationUI = document.getElementById('inspiration-ui');
  const chipsContainer = inspirationUI.querySelector('.inspiration-chips');
  chipsContainer.innerHTML = ''; 

  const recommendations = aiRecommendations[currentScriptId] || [];

  recommendations.forEach(text => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = text;
    chipsContainer.appendChild(chip);
  });
  
  inspirationUI.classList.remove('hidden');

  const resolutionListeningUI = document.getElementById('listening-ui');
  const resolutionStatusText = resolutionListeningUI.querySelector('#statusText');
  const resolutionCircle = resolutionListeningUI.querySelector('#circle');
  
  resolutionStatusText.textContent = '듣고 있어요...';
  
  resolutionCircle.classList.remove('is-listening'); 
  
  resolutionListeningUI.classList.remove('hidden');


  // --- 3. 이 단계만을 위한 새로운 음성인식 시작 (로직 수정됨) ---
  const resolutionRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  if (!resolutionRecognition) {
    console.error("이 브라우저는 음성인식을 지원하지 않습니다.");
    triggerResolutionEnding(); 
    return;
  }

  resolutionRecognition.lang = 'ko-KR';
  resolutionRecognition.continuous = true;
  resolutionRecognition.interimResults = false;

  let speechEndTimer = null;
  let isPhaseActive = true; 

  // ▼▼▼ [핵심 수정] 3분 타이머 로직 (1/4) ▼▼▼
  // 타이머 관련 변수를 onstart 밖으로 이동
  let resolutionTimeoutChecker = null;
  let lastResolutionTime = Date.now(); // 👈 타이머 기준 시간: 단계 시작 시점

  // 3분 타이머를 *한 번만* 시작
  resolutionTimeoutChecker = setInterval(() => {
      const elapsedTime = Date.now() - lastResolutionTime;
      
      // 3분 동안 음성 인식이 없었다면 (onresult가 lastResolutionTime을 갱신하지 않았다면)
      if (isPhaseActive && elapsedTime >= 3 * 60 * 1000) {
          console.log("⏰ (해소 발언) 3분 비활성 타임아웃. 재시도 화면 표시.");
          isPhaseActive = false; // 재시작 루프 중단
          if (resolutionTimeoutChecker) clearInterval(resolutionTimeoutChecker); // 타이머 중지
          
          resolutionRecognition.stop();
          
          // '다시 하기' 버튼 표시
          inspirationUI.classList.add('hidden');
          listeningUI.classList.add('hidden');
          blurOverlay.classList.remove('hidden');
          retryBtn.classList.remove('hidden');
      }
  }, 1000); // 1초마다 체크
  // ▲▲▲ [핵심 수정] 3분 타이머 로직 (1/4) ▲▲▲


  resolutionRecognition.onresult = (event) => {
    
    const transcript = Array.from(event.results)
                            .map(result => result[0].transcript)
                            .join('')
                            .trim();

    // ▼▼▼ [핵심 수정] 3분 타이머 로직 (2/4) ▼▼▼
    // 실제 텍스트가 있는 경우에만 타이머를 리셋
    if (transcript.length > 0) {
      
      console.log("해소 발언 인식:", transcript);

      clearTimeout(speechEndTimer); 
      
      // 3분 유휴 상태 타이머 리셋
      lastResolutionTime = Date.now(); // 👈 [핵심]
      
      speechEndTimer = setTimeout(() => {
        console.log("🎤 최종 발언 종료. 마지막 단계로 전환합니다.");
        isPhaseActive = false; 
        resolutionRecognition.stop();
        inspirationUI.classList.add('hidden'); 
        triggerResolutionEnding();
        
        // ▼▼▼ [핵심 수정] 3분 타이머 로직 (3/4) ▼▼▼
        // 단계가 성공적으로 종료되었으므로 3분 타이머 중지
        if (resolutionTimeoutChecker) clearInterval(resolutionTimeoutChecker);
        // ▲▲▲ [핵심 수정] 3분 타이머 로직 (3/4) ▲▲▲
        
      }, 2500); 
      
    } else {
      console.log("... (소음 감지, 무시함)");
      // (타이머 갱신 안 함)
    }
    // ▲▲▲ [핵심 수정] 3분 타이머 로직 (2/4) ▲▲▲
  };
  
  resolutionRecognition.onstart = () => {
    console.log("💬 해소 발언 음성인식을 시작합니다. 사용자의 발언을 기다립니다...");
    resolutionCircle.classList.remove('is-listening'); 
    // (onstart에서 타이머 갱신 로직 제거됨)
  };

  resolutionRecognition.onspeechstart = () => {
    if (!isPhaseActive) return;
    console.log("🎤 해소 발언 감지됨.");
    resolutionCircle.classList.add('is-listening'); 
  };

  resolutionRecognition.onspeechend = () => {
    if (!isPhaseActive) return;
    console.log("...해소 발언 종료. 대기 모드로.");
    resolutionCircle.classList.remove('is-listening'); 
  };

  resolutionRecognition.onend = () => {
    console.log("🛑 해소 발언 음성인식이 종료되었습니다.");
    clearTimeout(speechEndTimer);
    resolutionCircle.classList.remove('is-listening'); 
    
    // 의도적으로 종료된 것이 아니라면, 계속 듣기 위해 재시작
    if (isPhaseActive) {
      console.log("... 1초 후 다시 듣기를 시작합니다.");
      setTimeout(() => {
        if(isPhaseActive) { 
          resolutionRecognition.start(); // 👈 이것이 onstart를 다시 호출하지만, 타이머는 갱신하지 않음.
        }
      }, 1000); 

    }
  };
  
  resolutionRecognition.onerror = (event) => {
    resolutionCircle.classList.remove('is-listening'); 

    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      console.error('해소 발언 음성인식 오류: 마이크 권한이 거부되었습니다.', event.error);
      resolutionStatusText.textContent = '마이크 권한을 허용해주세요';
      isPhaseActive = false; // 👈 재시작 루프 중단
      
      // ▼▼▼ [핵심 수정] 3분 타이머 로직 (4/4) ▼▼▼
      // 마이크 오류 시에도 3분 타이머 중지
      if (resolutionTimeoutChecker) clearInterval(resolutionTimeoutChecker);
      // ▲▲▲ [핵심 수정] 3분 타이머 로직 (4/4) ▲▲▲
      
      setTimeout(() => {
          inspirationUI.classList.add('hidden');
          blurOverlay.classList.remove('hidden');
          retryBtn.classList.remove('hidden');
      }, 5000);

    } else if (event.error === 'no-speech') {
      console.log("아직 발언이 없습니다. 계속해서 듣습니다.");
      // (onend가 1초 뒤 onstart를 호출함. 3분 타이머는 갱신되지 않음 - 정상)
    } else {
      // 'network', 'audio-capture' 등의 다른 오류는 무시하고 재시작
      console.error("해소 발언 음성인식 오류 (무시하고 재시작 대기):", event.error);
      // (onend가 1초 뒤 onstart를 호출함. 3분 타이머는 갱신되지 않음 - 정상)
    }
  };
  
  resolutionRecognition.start(); // 👈 최초 시작
}