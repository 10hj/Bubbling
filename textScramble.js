// --- 1. TextScramble 애니메이션 클래스 (원본 로직 유지) ---
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}


// --- 2. 문장 표시 함수 (새로운 로직 적용) ---
// ▼▼▼ [수정] 음성인식 로직 오류 해결을 위해 Promise 반환 로직을 추가합니다. ▼▼▼
function createSentence(sentenceParts) {
  const container = document.getElementById('sentence-container');
  container.innerHTML = ''; 

  const row = document.createElement('div');
  row.classList.add('container');
  
  const promises = []; // 모든 애니메이션 Promise를 담을 배열

  sentenceParts.forEach(part => {
    const span = document.createElement('span');
    
    if (part.type === 'core') {
      span.textContent = part.text;
      span.classList.add('blur');
    } else {
      span.classList.add('text');
      const fx = new TextScramble(span);
      // 생성된 Promise를 배열에 추가
      promises.push(fx.setText(part.text));
    }
    
    row.appendChild(span);
  });
  
  container.appendChild(row);

  // 모든 애니메이션이 끝났을 때 resolve되는 단일 Promise를 반환
  return Promise.all(promises);
}
// ▲▲▲ 수정 완료 ▲▲▲