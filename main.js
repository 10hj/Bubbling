// main.js

// --- 1) UI 요소 참조 ---
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const scriptColumns = document.getElementById('script-columns');
const listeningUI = document.getElementById('listening-ui');
const circle = document.getElementById('circle');
const statusText = document.getElementById('statusText');
const sentenceContainer = document.getElementById('sentence-container');
const blurOverlay = document.getElementById('blur-overlay');
const responseGuides = document.getElementById('response-guides');
const episodeSelectionContainer = document.getElementById('episode-selection-container');
const viewport = document.getElementById('viewport');
const stage = document.getElementById('stage');
const books = document.querySelectorAll('.book');
const scriptView = document.getElementById('script-view');
const closeButton = document.getElementById('close-button');
const scriptBody = document.getElementById('script-body');
const tooltip = document.getElementById('episode-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipDescription = document.getElementById('tooltip-description');


// --- 2) 데이터 및 상태 ---
const gutSounds = [ 'stomachache/stomachache1.wav', 'stomachache/stomachache2.wav', 'stomachache/stomachache3.wav' ];
const fartSoundFiles = [ 'fart/fart1.wav','fart/fart2.wav','fart/fart3.wav','fart/fart4.wav','fart/fart5.wav', 'fart/fart6.wav','fart/fart7.wav','fart/fart8.wav','fart/fart9.wav','fart/fart10.wav' ];
const fartAudioObjects = [];

const dialogueScripts = [
  { id: 'script1', title: '넷플릭스 영화', audio: 'script/script1.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=0&single=true&output=csv' },
  { id: 'script2', title: '엄마의 김치', audio: 'script/script2.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=2068191943&single=true&output=csv' },
  { id: 'script3', title: '배달음식', audio: 'script/script3.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=1227841480&single=true&output=csv' },
  { id: 'script4', title: '드라마', audio: 'script/script4.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=1676990360&single=true&output=csv' },
  { id: 'script5', title: '카페 아이', audio: 'script/script5.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=688393908&single=true&output=csv' },
  { id: 'script6', title: '지하철 임산부석', audio: 'script/script6.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=1304351853&single=true&output=csv' },
  { id: 'script7', title: '전단지', audio: 'script/script7.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=547083201&single=true&output=csv' },
  { id: 'script8', title: '열차 안 취식', audio: 'script/script8.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=872724876&single=true&output=csv' },
  { id: 'script9', title: '도서관 휴게실', audio: 'script/script9.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=111726340&single=true&output=csv' },
  { id: 'script10', title: '카페 카공족', audio: 'script/script10.mp3', themeDataUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTTnIXJLuha9CHeYHNepS8e2maKlpqPdJXMGWjVW0Jd4F9ucdBozsp54WoLoBxYwG_sfniKt3ybNHnh/pub?gid=1641761476&single=true&output=csv' }
];
const episodeDescriptions = {
  "넷플릭스 영화": "그의 시선은 식어버린 커피 잔에 머물렀다. 퇴근 후에도 꺼지지 않는 모니터의 불빛, 의미 없이 흘러가는 장면들 속에서 감정이 마모되어 가는 기분에 대해 털어놓았다. 그 공허함의 끝에 그는 나를 보며 침묵으로 동의를 구하고 있었다. 나는 뭐라고 말을 해야 할까...",
  "엄마의 김치": "그녀의 이야기는 며칠째 현관 앞에 놓인 스티로폼 상자에서 시작되었다. 뚜껑을 열지 않아도 느껴지는 시큼한 냄새는 엄마의 정성과 자신의 죄책감이 뒤섞인 것만 같다고 했다. 그 무거운 애정 앞에서 망설이는 자신이 이상한 거냐는 듯 나를 바라봤다. 나는 뭐라고 말을 해야 할까...",
  "배달음식": "그녀는 돼지고기가 둥둥 떠다니는 국밥 그릇을 밀어내며 긴 한숨을 쉬었다. 음식값보다 비싼 비용을 치르고도 마음 한구석이 채워지지 않는, 이 허무한 거래에 대한 이야기였다. 마치 세상 전체가 그런 부조리로 가득 찬 것 같다는 그녀의 눈빛이 내게 향했다. 나는 뭐라고 말을 해야 할까...",
  "드라마": "새벽까지 이어진 드라마의 정적 속에서 그녀는 홀로 남겨졌다. 모두가 웃고 우는 지점에서 아무것도 느끼지 못하는 자신을 발견했다고 했다. 그 낯선 감정적 이질감 속에서 혹시 나 또한 그런 경험이 있는지 궁금해하는 듯했다. 나는 뭐라고 말을 해야 할까...",
  "카페 아이": "그는 관자놀이를 꾹 누르며 주말 오후의 소음에 대해 이야기했다. 책장을 넘기지 못하게 만들었던 아이의 웃음소리. 귀여움과 소음의 경계에서 길을 잃은 자신의 예민함이 혹시 유별난 것인지 내게 묻고 싶은 표정이었다. 나는 뭐라고 말을 해야 할까...",
  "지하철 임산부석": "그의 이야기는 텅 빈 분홍색 좌석에 잠시 몸을 기댔던 어느 날의 기억이었다. 아무도 뭐라 하지 않았지만, 등 뒤로 쏟아지는 듯한 상상 속 시선들에 온몸이 굳어버렸다고 했다. 그 작은 이기심 정도는 괜찮은 것 아니냐며 그는 내게 암묵적인 지지를 바라고 있었다. 나는 뭐라고 말을 해야 할까...",
  "전단지": "그녀는 출근길에 손에 쥐어졌던 얇은 종이의 감촉을 설명했다. 그것을 구겨버린 순간의 후련함과 그 뒤에 찾아온 미묘한 죄책감 사이에서 길을 잃었다고 했다. 그 복잡한 감정의 이름을 나 역시 알고 있을 거라 기대하는 눈치였다. 나는 뭐라고 말을 해야 할까...",
  "열차 안 취식": "그녀의 기억 속에서 고요한 열차 안의 김밥 비닐 소리는 유난히 소란스러웠다. 허기를 채우는 행위가 마치 큰 잘못처럼 느껴지게 했던 그 무언의 압박감. 자신의 유난스러움을 이해받고 싶다는 듯 그녀는 조심스럽게 말끝을 흐렸다. 나는 뭐라고 말을 해야 할까...",
  "도서관 휴게실": "휴게실의 나지막한 소음 속 그는 자신의 목소리가 유독 크게 울렸던 순간을 떠올렸다. 주변의 무심한 시선이 보이지 않는 벽처럼 느껴지자 하려던 말들이 목구멍 안으로 사라졌다고 했다. 그 각박한 침묵이 비단 자신만의 경험은 아닐 거라며 나를 바라봤다. 나는 뭐라고 말을 해야 할까...",
  "카페 카공족": "그는 카페 구석 자리를 턱 끝으로 가리키며 나에게만 들릴 듯한 목소리로 속삭였다. 하루 종일 자리를 지키는 저 뻔뻔함이 때로는 부럽기까지 하다는 자신의 속내를 털어놓았다. 그 혼란스러운 감정에 대한 나의 판단을 기다리는 듯했다. 나는 뭐라고 말을 해야 할까..."
};
const aiRecommendations = {
  script1: [ "그 뻔함에서 오히려 위안을 얻었던 기억을 꺼내볼까요?", "그 공허함을 나의 경험에 빗대어 맞장구 쳐볼 수 있어요.", "느꼈던 감정을 색깔이나 무게로 묘사해보는 건 어떨까요?" ],
  script2: [ "그 이야기를 들으며 든 생각을 따뜻한 색깔이나 온도로 묘사해볼까요?", "나도 비슷하게 부담을 느꼈던 다른 경험에 빗대어 말하는 방법이 있답니다.", "그 복잡함을 어떤 맛이나 무게에 빗대어 표현해볼 수도 있어요." ],
  script3: [ "덕분에 편했던 과거의 기억이나 고마움을 꺼내볼까요?", "비슷하게 불쾌했거나 화가 났을 때의 느낌을 덧붙여 말해볼 수 있어요.", "그 불만이 내게 어떤 행동을 하고 싶게 만들었는지 짚어보는 것도 좋아요." ],
  script4: [ "비슷한 레파토리가 오히려 위안이 됐던 나의 기억을 꺼내볼까요?", "전달된 대화가 내게 어떤 영화 속 장면처럼 느껴졌는지 묘사해보세요.", "맞장구를 쳤을 때의 느낌을 되짚어 말해보는 건 어떨까요?" ],
  script5: [ "활기찬 분위기에서 느낀 생동감을 느꼈던 기억을 묘사하는 방법이 있어요", "그 소음을 어떤 모양이나 형태로로 표현해보는 건 어떨까요?", "인상깊었던 책의 구절로 내 생각을 표현하는 방법이 있답니다." ],
  script6: [ "피곤함을 느낄 때의 몸의 느낌을 사물에 빗대어 공감해볼까요?", "다른 사람들의 말을 인용해서 반대 의견을 말해볼 수 있어요.", "새로운 주제가 또 다른 분위기를 형성할 수 있답니다." ],
  script7: [ "그 사람의 표정을 상상하며 든 생각을 말해볼까요?", "억눌렀던 충동의 다른 경험을 꺼내보는 건 어떨까요?", "후련함과 미안함이 내 안에서 엇갈리는 순간을 묘사해보세요." ],
  script8: [ "배고픔이 더 컸던 경험을 떠올리며 말해볼까요?", "그 냄새가 어떻게 느껴졌을지 타인의 감각으로 묘사해보세요.", "민망함을 어떤 온도나 색깔에 빗대어 표현해볼까요?" ],
  script9: [ "휴게실에서 편안함을 느꼈던 기억을 꺼내볼까요?", "조용함을 원했던 타인의 입장을 상상하며 말해보세요.", "사람들의 시선을 어떤 모양이나 감촉에 빗대어 표현해볼까요?" ],
  script10: [ "몰입했던 순간을 묘사해볼까요?", "타이핑 소리처럼 가장 거슬렸던 감각을 묘사해보세요.", "짜증과 부러움이 내 안에서 엇갈렸던 순간을 묘사해보세요." ]
};

const particleFragments = {
  script1: [ "아 또 그 얘기네", "재밌던데", "뭘 모르네", "나는 좋았어 그 장면", "그건 인정", "그럴거면 왜 봐?", "반박해봤자 피곤해", "그냥 웃고 넘기자", "에휴 다 똑같긴 뭐가 똑같아", "끝까지 보지도 않고?", "아 피곤해", "저녁 뭐 먹지", "으", "어후 쳐진다", "감독 의도는 다르지 않았나?", "말하면 싫어하려나", "다들 그렇지 뭐", "지루해", "음.. 그건 또 그렇네", "나만 그런 줄", "요즘 진짜 다 비슷하긴 해", "갑자기 왜 저 얘기를?", "왜 나한테 이래", "볼만 하던데", "그럼 보지 말든가", "좀 징징대는 것 같아", "요즘 다 그래", "저 사람은 취향이 확고하네", "나는 그냥 아무거나 보는데", "저렇게까지 생각한다고?", "그냥 생각 없이 보는거지 뭐", "감정소모 하기 싫어", "현실도 피곤한데", "영화는 영화일 뿐", "너무 과몰입하는 거 아니야?", "저런 사람이 평론가 하나", "시간 아깝다", "다른 얘기 하고 싶다", "그래서 결론이 뭔데", "핸드폰 보고 싶다" ],
  script2: [ "어머니 생각 좀 하지", "하 괜히 울컥했다", "엄마한테 연락 좀 할까", "고마운 줄도 모르네", "배고파진다", "요새 김치값이 비쌀텐데", "울 어머니 이번 년도에 김장 하시려나", "총각김치 땡기네", "엄마 보고싶네", "그걸 왜 버려", "나 주지", "달라고 할까", "짠하다", "사먹는 거랑은 완전 다르지", "냄새가 그렇게 심한가?", "한번 굶어봐야 정신 차리겠네", "시큼한 게 참맛인데", "지금 몇 시지?", "그래도 정성인데", "우리 엄마도 저러시는데", "받아주는 것만으로도 효도야", "나중엔 그리울텐데", "저 마음 이해돼", "나도 저럴 때 있어", "거절하는게 더 힘들어", "솔직하게 말하는게 맞나?", "이것도 사랑인데", "왜 기쁘지가 않지", "엄마의 마음", "자식 키워봐야 알지", "김치찌개 먹고 싶다", "나중에 후회할텐데", "표정 관리 안되네", "이제 그만 얘기했으면" ],
  script3: [ "지금 몇 시지?", "오늘은 나도 배달시켜야겠다", "배달비 무료앱 있는데", "너무 쉽게 판단하네", "아 갑자기 피곤하다", "으… 왜이렇게 예민해", "듣기 불편해", "쉬운 게 어딨어", "말하면 기분 나빠하겠지", "음 그런가?", "그냥 참자", "그건 인정", "그 말은 좀 공감 돼", "아 오늘 점심 뭐 먹지", "조금 오바가 심하네", "갑자기 국밥 먹고 싶다", "직접 해봤나?", "사장님은 뭔 죄야", "비 오면 위험한데…", "그냥 나가서 먹으면 되잖아", "그냥 있자", "이 사람 지금 많이 쌓였구나", "그냥 넘기자", "피곤하다", "맞아 배달비 너무 비싸", "세상에 당연한 건 없지", "본인도 회사 다니면서", "그렇게 말하면 안되지", "나도 저런 적 있는데", "세상 물정 모르네", "그렇게 불만이면 직접 배달하지", "말이 너무 심하다", "세상 탓만 하네" ],
  script4: [ "재밌던데", "원래 드라마 장르가 그런거지", "들을수록 우울해지네", "뻔하긴 해도 재밌을 때도 있잖아", "그걸 또 그렇게 까야 돼?", "만든 사람 서운하겠다", "그게 그렇게 간단한 얘긴가", "여러 번 보면 또 다를텐데", "난 오히려 편하던데", "감정선 단순한게 난 좋아", "나도 가끔 그렇게 하긴 해", "말하면 분위기 싸해지겠지?", "답답하다 진짜", "하 숨 막혀", "다른 얘기할 거 없나…", "쉽다 쉬워 세상이", "그게 창작 아니면 뭐가 창작이야", "너무하시네", "이것도 취향 차이지", "피곤하게 사네", "맞장구 쳐주는 것도 피곤해", "저 사람은 T일까?", "나는 F인데", "그냥 그런가보다 하자", "저렇게까지 분석하면서 본다고?", "나는 그냥 보는데", "드라마는 드라마일 뿐" ],
  script5: [ "애가 뛰는게 당연하지", "조금 각박하시네", "좀 지나쳐", "너무 예민한 거 아니야?", "나도 가끔 그런 생각이 들지만…", "조용한 곳만 찾는 것도 피곤하지 않나", "절에 들어가는 것도 …", "말하면 이상하게 생각하겠지?", "아 피곤해", "듣기 거슬린다", "그렇게까지 생각한다고?", "공감이 안되는데 전혀", "각박한 세상이다 정말…", "언제까지 얘기하려나", "불편해", "그럴 수도 있지", "너무 과민반응인가?", "애는 원래 시끄러워", "부모가 문제지", "나도 애 낳으면 변할까?", "저 말 진짜 무례하다", "노키즈존이 괜히 생기는게 아니야", "그래도 애는 귀엽잖아", "애들이니까 그렇지", "이해는 가는데", "굳이 저렇게까지 말할 필요가 있나", "저 사람 아이 싫어하나봐" ],
  script6: [ "내가 눈치 보이네", "핑계지", "배려는 피곤해도 하는 거 아닌가", "하, 듣기 좀 불편하다", "뭐라고 하면 싫어하겠지", "나도 피곤하다", "말은 맞는데 듣기 거슬리네", "모르는 척 할까", "으 개똥철학", "악 합리화 듣기 싫다!", "다들 피곤한데 참는건데", "저분 힘들어보이시네", "가끔은 그럴 때도 있지 나도", "씁쓸하네", "완전 틀린 말도 아니야", "오죽하면 저럴까", "그래도 비워두는게 맞지 않나", "저 사람한테 뭐라고 할 자격 있나?", "그냥 못 본 척 하자", "세상이 너무 각박해", "나라도 비워둬야지", "자기합리화 대박이다", "말투가 왜 저래", "그냥 조용히 앉아있으면 안되나", "굳이 저런 말을" ],
  script7: [ "와 대단하네…", "보는 앞에서?", "잔인하다", "받기 싫으면 그냥 거절하지", "진짜 솔직하다", "듣는 내가 미안해지네", "그래도 안쓰럽잖아", "엥?", "그건 아니지", "너무 감정적이야", "당황스럽네 너무 거침없네", "합리화 짜증나", "저게 자랑인가?", "아 머리 아파", "저건 그냥 화풀이인데", "설마 진짜 버렸겠어 농담이겠지?", "뭐라 반응해야하지", "속 시원하긴 하겠다", "나도 저렇게 해볼까", "저 사람도 힘들었겠지", "하루종일 저러고 있으면", "그래도 그건 좀 심했다", "나라면 그냥 받았을텐데", "저 사람 오늘 무슨 일 있었나", "무서운 사람이네" ],
  script8: [ "아 냄새..", "하, 기차 안인데 왜 굳이", "눈 좀 붙이고 싶은데", "언제 도착하지", "내가 다 눈치 보이네", "괜히 불편해", "아직 멀었나?", "먹지 말라고 할까?", "솔직하게 얘기하면 싸움날 거 같은데", "냄새 은근 오래갈텐데", "문 열고 싶다…", "그냥 참자 참아", "말하면 안 먹을 거 아니잖아?", "그만 얘기하고 빨리 먹고 치우지…", "배고프긴 하겠다", "오죽 배고팠으면", "김밥 맛있겠다", "나도 뭐 좀 먹을까", "서로 조금씩만 배려하면 좋을텐데", "저 사람도 눈치 보고 있겠지", "한 입 달라고 할까", "무슨 김밥이지", "참치김밥인가", "환기 좀 됐으면" ],
  script9: [ "또 통화하네", "잠깐이 아니던데", "각별한 사이인가?", "다들 힘든데 왜 굳이 말을 길게 해", "뭐라 해야 할지 모르겠다", "아 공부해야하는데…", "몇 시에 집 가야되려나", "우리 쳐다보네", "휴게실은 좀 괜찮지 않나?", "내가 너무 예민한가", "이어폰 낄까", "무슨 얘기를 저렇게 해", "목소리가 너무 커", "나가서 통화하면 안되나", "무슨 내용인지 다 들리네", "저 사람은 아무렇지도 않나?", "슬슬 짜증나네", "무슨 자랑을 저렇게 오래하지", "내 얘기 하는거 아니야?", "기분 나빠" ],
  script10: [ "그건 자기 마음 아닌가?", "자유지 언제 갈지는", "그냥 자리가 없어서 짜증 난 거잖아", "뭐, 다들 그런 사람 있지 뭐", "굳이 저렇게 신경 쓸 일인가", "듣다 보니 괜히 내가 다 불편하네", "커피 한 잔으로 자리 차지하는 사람 많긴 하지", "하, 요즘 진짜 다들 예민해졌네", "그래도 부럽다니, 그건 또 뭐야", "그렇게까지 감정 소모해야 돼?", "그냥 자리가 없다고 하면 되지", "저런 뻔뻔함이 부럽긴 하다", "나도 그냥 말 못할 듯", "사장님은 무슨 생각일까", "저 사람은 무슨 일 하길래 저렇게 열심히지?", "나도 저렇게 집중해본 적이 언제더라", "그냥 다른 카페 갈까", "말 걸어볼까", "무슨 공부하세요?" ]
};

const LINES = {
    s1: `“요즘 영화 뭐 보세요? / 저는 요즘 뭘 봐야 할지 모르겠어요. / 넷플릭스 켜면 추천 목록이 끝도 없잖아요. / 그냥 아무거나 눌러요. / 사람들이 재밌다고 하는 거요. / 근데 보면 다 비슷해요. / 누가 죽고, 누가 배신하고, 사랑하고, 울고. / 그런 얘기요. / 보다 보면 어느 순간 머리가 멍해져요. / 감정이 없어요. / 웃긴 장면인데도 웃음이 안 나요. / 그래도 그냥 틀어놔요. / 화면이라도 켜져 있으면 덜 외로우니까요. / 어제는 새벽 세 시까지 보다가 잠들었어요. / 꿈에서도 자막이 흘러가더라고요. / 이상했어요. / 영화가 끝났는데, 아무것도 남지 않은 기분. / 가끔 그런 생각 들어요. / 지금 내가 보는 게 영화인지, 현실인지. / 어차피 둘 다 남는 건 없잖아요. / …아, 너무 말했네요. / 괜찮으세요?”`,
    s2: `“이거요? / 네, 엄마가 또 보내셨어요. / 지난번 것도 아직 다 못 먹었는데요. / 냉장고 맨 아래 칸에 그대로 있어요. / 이제 좀 시큼해졌죠. / 근데 버리기도 애매하잖아요. / 버리면 꼭 엄마를 버리는 기분이 들어서요. / 며칠 전에 ‘이제 보내지 마세요’라고 말했어요. / 진심이었는데, 농담처럼 말했어요. / 그게 덜 미안하니까요. / 엄마는 ‘이번이 마지막이야’ 하시더니 또 보내셨어요. / 박스에 제 이름이 또박또박 써 있더라고요. / 그 글씨 보면 이상하게 아무 말도 못 하겠어요. / 솔직히 요즘은 사 먹는 김치가 더 맛있어요. / 편하고 냄새도 덜하잖아요. / 그래도 엄마한테는 ‘맛있어요, 잘 먹고 있어요’라고 말해요. / 그게 그냥 습관처럼 돼버렸어요. / 오늘은 상자를 열지도 않았어요. / 현관 옆에 그냥 뒀어요. / 냄새가 슬슬 올라오더라고요. / 그 냄새가 싫은데 또 없으면 허전해요. / 이상하죠. / 먹지도 못하고 버리지도 못하면서 계속 받아요. / 그러면서 또 다음엔 안 받겠다고 다짐해요. / …아, 제가 너무 오래 얘기했죠. / 괜찮으세요?”`,
    s3: `“와. / 국밥 하나 배달비가 5천 원이래요. / 요즘 진짜 배달비 장난 아니죠. / 그냥 오토바이 몇 분 달리면 되는 건데. / 솔직히 배달원들이 제일 쉽게 돈 버는 것 같아요. / 앱 켜보면 여러 개 한 번에 잡고 돌잖아요. / 그럼 한 시간에 얼마나 버는 거예요? / 저도 가끔 그런 생각해요. / ‘내가 왜 회사 다니지?’ / 요즘은 앉아서 주문만 해도 돈이 나가니까, / 음식값보다 배달비가 비싸면, 내가 일 하는 사람 된 느낌이에요. / 예전에 음식 늦게 와서 별점 한 개 준 적 있어요. / 그랬더니 배달원이 전화해서 죄송하다고 하더라고요. / 참나 인사 필요없고 빨리 갖다주기나 하지. / 오늘도 국밥이 식어서 왔어요. / 뚜껑 열자마자 김 하나도 없더라고요. / 속으로 ‘이걸로 5천 원 받아?’ 싶었죠. / 저기요, 괜찮으세요?”`,
    s4: `“그 드라마 봤어요? / 다들 보길래 저도 봤어요. / 근데 이제 좀 질려요. / 주인공이 처음엔 착하다가 중간에 복수하고, 나중엔 다시 울어요. / 늘 그래요. / 그냥 뻔한 레파토리. / 친구들이 다 재밌다고 하니까 저도 ‘응, 재밌더라’라고 맞장구쳐요. / 안 그러면 분위기 깨잖아요. / 솔직히 아무 느낌도 없는데요. / 요즘은 그런 게 너무 많아요. / 진심이 아니라 ‘그럴듯한 말’로 채워진 대화들. / 다들 그렇게 사니까 인생을 그대로 반영한건지.. / 재밌자고 보는 드라마인데 현실을 그대로 재현하는게 말이 되나요. / 그게 무슨 창작물이야. / 그러지 않나요? / 저기요. / 괜찮으세요?”`,
    s5: `“아까 보셨어요? / 그 친구 아이 데리고 왔던 거. 애가 계속 뛰어다녔잖아요. / 소리도 크고. / 솔직히 좀 피곤했어요. / 그래서 요즘은 예민한 사장님이 운영하는 곳만 가요. / 그런데가 오히려 더 조용해서요. / 근데 그런 얘기하면 사람들이 뭐라 하잖아요. / 남사스럽대나. / 아이를 싫어하는 게 아니라, 그냥 시끄러운 게 싫은 건데. / 그게 이상한 건가요? / 어제 친구가 그러더라고요. / ‘너도 애 낳으면 달라질 거야.’ / 그 말이 이상하게 섬찟했어요. / 바뀌는 게 당연한 일처럼 말하니까요. / … 저기요, 괜찮으세요?”`,
    s6: `“여기요? / 네, 임산부석 맞아요. / 근데 지금 아무도 없잖아요. / 오늘 하루종일 서 있었더니. / 발이 너무 아파서요. / 허리도 좀 쑤시고. / 근데 앉고 나니까 괜히 눈치가 보이네요. / 누가 쳐다보는 것도 아닌데, 마치 뭐 잘못한 것 같아요. / 배려라는 게 참 어렵죠. / 내가 가진 여유에서 조금 덜어주는건데 근데 지금은 나한테 여유가 없거든요. / 사람이 피곤할 땐 마음의 자리도 비좁아지는 것 같아요. / 누가 오면 일어날 거예요. / 근데 이상하게 그런 마음이 들면 더 오래 앉고 싶어져.. / …아, 저 때문에 불편하셨나요? / 얼굴이 좀 굳으셨네요. / 괜찮으세요?”`,
    s7: `“받지 마세요. / 쓰레기인데 저는 그냥 바로 버렸어요. / 길 막고 계속 들이밀길래요. / 사실 처음엔 그냥 받으려다, 너무 끈질기게 오니까 짜증이 나더라고요. / 받자마자 찢었어요. / 보는 앞에서요. / 그 사람이 아무 말도 안 하더라고요. / 그게 더 기분이 이상했어요. / 조금 미안했는데, 솔직히 후련했어요. / 찢긴 종이 조각이 바닥에 붙어 있는게 마음에 걸리긴 했는데, / 누가 치우겠죠. / 그런 생각 하면서 그냥 지나갔어요. / …제가 너무 솔직했나요. / 괜찮으세요?”`,
    s8: `“냄새나요? / 아, 죄송해요. / 김밥이에요. / 열차에서 먹으면 안 된다는 규칙은 없잖아요. / 배가 너무 고팠어요. / 아침도 못 먹고 나와서요. / 작게 베어 먹으려고 했는데, 냄새가 퍼졌나 봐요. / 옆자리 분이 고개를 돌리시더라고요. / 그 순간 얼굴이 확 열이 올라왔어요. / 아무 말도 안 했는데 혼난 기분이랄까. / 사람들이 조용한데 나만 뭔가 해버린 느낌 있잖아요. / 괜히 더 크게 삼키게 되고. / 냄새는 금방 사라질 거예요. / 하나 드실래요? / 괜찮으세요?”`,
    s9: `“아, 제가 좀 시끄러웠죠? / 휴게실이라 괜찮을 줄 알았어요. / 잠깐 통화했거든요. / 친구한테 별 얘기도 안 했어요. / 그냥 오랜만에 연락해서 먹고 사는 얘기 잠깐 했어요.. / 근데 앞에 있던 분이 계속 쳐다보더라고요. / 그 시선이 좀 기억에 오래 남네요. / 내가 그렇게 잘못했나 싶었어요. / 요즘은 말 한마디 하는 것도 눈치 봐야 하잖아요. / 다들 조용한 걸 좋아하는데, 너무 조용하면 또 답답하잖아요. / 그냥 잠깐 소리 내고 싶었는데 그게 이렇게까지 신경 쓰이는 일일 줄 몰랐네요. / 이상하죠. / 아무 말도 안 하는 게 제일 안전한 세상 같아요. / …아, 제가 또 길게 말했네요. / 괜찮으세요?”`,
    s10:`“저기 저 사람 보이세요? / 노트북 펴놓은 사람. / 커피는 한참 전에 다 드신 거 같은데 아직도 자리에 있네요. / 다른 사람들 서 있는 거 보이면 좀 비켜주시지.. / 처음엔 좀 짜증났어요. / 근데 계속 보니까 부럽더라고요. / 저렇게 아무렇지 않게 자기 일만 하는 거요. / 저는 그렇게 못 하거든요. / 그 사람 타이핑 소리가 계속 들리더라고요. / 그 리듬이 불쾌한 소음으로 느껴지더라고 나중에는. / 저기요 / 괜찮으세요?”`
};
const DUR = { 
    s1: [ 1800, 2500, 3100, 1500, 2200, 1900, 3500, 1000, 3000, 1500, 2700, 1900, 3400, 3300, 2700, 1300, 3500, 2000, 2900, 2500, 1900, 1400 ],
    s2: [ 700, 2100, 2600, 2900, 1500, 2100, 3000, 3100, 2400, 1800, 4200, 3300, 3600, 3200, 2200, 3800, 2600, 2600, 1900, 2400, 3400, 1000, 3900, 3400, 3000, 1800 ],
    s3: [ 400, 3000, 2500, 2700, 3600, 3200, 2700, 2500, 2100, 3300, 4200, 3700, 3600, 3200, 2700, 3000, 2800, 2300 ],
    s4: [ 1500, 2000, 1700, 5100, 1000, 2100, 4600, 2200, 2500, 2400, 3700, 4000, 4600, 2200, 1400, 700, 1500 ],
    s5: [ 1500, 3500, 1100, 2000, 4000, 2500, 3100, 1400, 4000, 1800, 2100, 3000, 2700, 3200, 2100 ],
    s6: [ 800, 1900, 2100, 2300, 1800, 1600, 3300, 4100, 2200, 5600, 4400, 2300, 4800, 2800, 2500, 1800 ],
    s7: [ 1100, 2900, 2300, 5200, 1800, 1300, 2700, 2400, 2800, 4800, 1400, 2900, 2400, 1600 ],
    s8: [ 1000, 1200, 1200, 3400, 1800, 2200, 3700, 2900, 3100, 3200, 4200, 2500, 2400, 1500, 1500 ],
    s9: [ 2000, 2700, 1800, 2400, 4900, 3500, 3000, 2600, 3800, 4700, 5600, 1000, 4600, 2700, 1700 ],
    s10:[ 2100, 1600, 4700, 3800, 2000, 2600, 3400, 2100, 3200, 4700, 800, 1500 ]
};
const AUDIO_KEY = {
  'script/script1.mp3': 's1', 'script/script2.mp3': 's2', 'script/script3.mp3': 's3',
  'script/script4.mp3': 's4', 'script/script5.mp3': 's5', 'script/script6.mp3': 's6',
  'script/script7.mp3': 's7', 'script/script8.mp3': 's8', 'script/script9.mp3': 's9',
  'script/script10.mp3': 's10'
};
const audioCache = new Map();
const lineCache  = new Map();

let gutLoop = false;
let allowRecognition = true;
let hasSeenDismissal = false;
let lastChangeTime = Date.now();
let timeoutChecker;
let currentScriptId = null;
let currentDialogueAudio = null;
let playbackInterval = null;
let gutAudioInstance = null;

// ▼▼▼ [추가] 딜레이 타이머 변수 선언 ▼▼▼
let startDelayTimer = null; 
// ▲▲▲ 추가 완료 ▲▲▲

const toLines = s => s.split('/').map(x=>x.trim()).filter(Boolean);

// --- 3) 핵심 기능 ---
function preloadFartSounds() {
  fartSoundFiles.forEach(path => {
    const audio = new Audio(path);
    audio.load();
    fartAudioObjects.push(audio);
  });
  console.log(`🔊 ${fartAudioObjects.length}개의 효과음 사전 로딩 완료.`);
}
function playGutLoop(index = 0) {
  const gutAudio = new Audio(gutSounds[index]);
  gutAudio.loop = true;
  gutAudio.play();
  return gutAudio;
}

// 3분 타임아웃 로직 (유지)
function startTimeoutChecker() {
  lastChangeTime = Date.now();
  if (timeoutChecker) clearInterval(timeoutChecker);
  
  timeoutChecker = setInterval(() => {
    const elapsedTime = Date.now() - lastChangeTime;
    if (allowRecognition && elapsedTime >= 3*60*1000) {
      console.log("⏰ 3분 비활성 타임아웃. 재시도 화면 표시.");
      allowRecognition = false;
      if (recognition) recognition.stop();
      listeningUI.classList.add('hidden');
      blurOverlay.classList.remove('hidden');
      retryBtn.classList.remove('hidden');
      clearInterval(timeoutChecker);
    }
  }, 1000);
}

function preloadDialogueAssets() {
  dialogueScripts.forEach(ds => {
    const key = AUDIO_KEY[ds.audio];
    if (key && !lineCache.has(ds.id)) {
      lineCache.set(ds.id, toLines(LINES[key]));
    }
  });

  dialogueScripts.forEach(ds => {
    if (!audioCache.has(ds.id)) {
      const a = new Audio(ds.audio);
      a.preload = 'auto';
      a.loop = false;
      const onErr = () => {};
      a.addEventListener('error', onErr, { once: true });
      try { a.load(); } catch (_) {}
      audioCache.set(ds.id, a);
    }
  });

  console.log('⚡ 에피소드 오디오/라인 사전 로딩 완료(가능한 범위 내).');
}

function playScriptKaraoke() {
  const audio = currentDialogueAudio;
  const lines = Array.from(document.querySelectorAll('#script-body .line'));
  const GAP = 0.1;
  const EPS = 1e-4;

  if (typeof playbackInterval !== 'undefined' && playbackInterval) {
    clearTimeout(playbackInterval);
    playbackInterval = null;
  }
  if (playScriptKaraoke._unbind) {
    try { playScriptKaraoke._unbind(); } catch (_) {}
    playScriptKaraoke._unbind = null;
  }

  scriptBody.classList.add('playing');
  lines.forEach(el => el.classList.remove('active'));

  let cues = [];
  let activeIndex = -1;

  function effectiveLen(s) {
    if (!s) return 1;
    try {
      const onlyWord = s.replace(/[^\p{L}\p{N}]+/gu, '');
      return Math.max(1, onlyWord.length);
    } catch {
      const onlyWord = s.replace(/[\s.,!?;:'"“”‘’…·\-–—()[\]{}<>/\\]+/g, '');
      return Math.max(1, onlyWord.length);
    }
  }

  function buildCues(totalDurationSec) {
    cues = [];
    const n = lines.length;
    if (!n || !isFinite(totalDurationSec) || totalDurationSec <= 0) return;

    const totalGap = GAP * Math.max(0, n - 1);
    const speechBudget = Math.max(0, totalDurationSec - totalGap);

    if (speechBudget <= 0) {
      const per = totalDurationSec / n;
      let t = 0;
      for (let i = 0; i < n; i++) {
        const start = t;
        const end = start + per;
        cues.push({ start, end });
        t = end;
      }
      return;
    }

    const weights = lines.map(el => effectiveLen(el.textContent || el.innerText || ''));
    const wsum = weights.reduce((a,b)=>a+b,0) || n;
    let durations = weights.map(w => (speechBudget * w / wsum));

    const diff = speechBudget - durations.reduce((a,b)=>a+b,0);
    if (Math.abs(diff) > EPS) {
      const maxIdx = durations.indexOf(Math.max(...durations));
      durations[maxIdx] += diff;
      if (durations[maxIdx] < 0.05) durations[maxIdx] = 0.05;
    }

    let t = 0;
    for (let i = 0; i < n; i++) {
      const start = t;
      const end = start + Math.max(0.05, durations[i]);
      cues.push({ start, end });
      t = end;
      if (i < n - 1) t += GAP;
    }

    const over = (t - GAP) - totalDurationSec;
    if (over > EPS) {
      const last = cues[cues.length - 1];
      last.end = Math.max(last.start + 0.05, last.end - over);
    }
  }

  function setActive(idx) {
    if (idx === activeIndex) return;
    if (lines[activeIndex]) lines[activeIndex].classList.remove('active');
    if (idx >= 0 && lines[idx]) {
      lines[idx].classList.add('active');
      try {
        lines[idx].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      } catch (_) {}
    }
    activeIndex = idx;
  }

  function updateByTime() {
    if (!cues.length) return;
    const t = audio.currentTime || 0;
    let idx = -1;
    for (let i = 0; i < cues.length; i++) {
      const c = cues[i];
      if (t + EPS >= c.start && t < c.end - EPS) { idx = i; break; }
    }
    setActive(idx);
  }

  function onLoadedMeta() {
    buildCues(audio.duration);
    updateByTime();
  }

  if (isFinite(audio.duration) && audio.duration > 0) {
    onLoadedMeta();
  } else {
    audio.addEventListener('loadedmetadata', onLoadedMeta, { once: true });
  }

  const onTime    = () => updateByTime();
  const onSeeked  = () => updateByTime();
  const onPlaying = () => updateByTime();
  const onRate    = () => updateByTime();
  const onEnded   = () => setActive(-1);

  audio.addEventListener('timeupdate', onTime);
  audio.addEventListener('seeked', onSeeked);
  audio.addEventListener('playing', onPlaying);
  audio.addEventListener('ratechange', onRate);
  audio.addEventListener('ended', onEnded);

  playScriptKaraoke._unbind = () => {
    audio.removeEventListener('timeupdate', onTime);
    audio.removeEventListener('seeked', onSeeked);
    audio.removeEventListener('playing', onPlaying);
    audio.removeEventListener('ratechange', onRate);
    audio.removeEventListener('ended', onEnded);
  };
}

// --- 5) 상호작용 UI ---
function triggerDismissalResponse() {
  const dismissalPhrases = ["다들 그래.", "원래 그런 거야.", "유난스럽게 굴지 마."];
  const phrase = dismissalPhrases[Math.floor(Math.random() * dismissalPhrases.length)];
  const sentenceParts = [{ text: phrase, type: 'effect' }];
  createSentence(sentenceParts);
  hasSeenDismissal = true;
  setTimeout(() => {
    if (allowRecognition) {
      setListeningUI();
      lastChangeTime = Date.now();
    }
  }, 2000);
}
function showTranscript(text) {
  const container = document.getElementById('sentence-container');
  container.innerHTML = '';
  const row = document.createElement('div');
  row.classList.add('container');
  const span = document.createElement('span');
  span.textContent = `"${text}"`;
  span.style.fontWeight = '400';
  span.style.filter = 'none';
  row.appendChild(span);
  container.appendChild(row);
}
function triggerResolutionEnding() {
  allowRecognition = false;
  if (recognition) recognition.stop();
  listeningUI.classList.add('hidden');
  sentenceContainer.innerHTML = '';
  const sound = fartAudioObjects[Math.floor(Math.random() * fartAudioObjects.length)];
  sound.currentTime = 0;
  sound.play();
  sound.onended = () => {
    const resolutionStatements = [ "시원하네요! 감정도 방귀처럼, 참지 말고 솔직하게 터뜨려보세요.",
    "잘했어요! 방귀를 뀌듯 감정도 솔직하게 표현하는 용기가 필요합니다.",
    "방귀는 참는 게 아니죠. 감정도 마찬가지예요. 지금처럼 솔직하게 말해보세요!",
    "속 시원하네요! 다음에도 방귀처럼, 하고 싶은 말을 그냥 하세요.",
    "시원한가요? 방귀도 감정도, 참으면 답답해요. 이젠 참지 말고 표현하세요.",
    "감정을 표현하는 건 참았던 방귀를 뀌는 것처럼 시원한 일이에요. 망설이지 마세요.",
    "방귀처럼 솔직하게 마음속에 있는 말을 꺼내보세요!",
    "잘했어요! 방귀도 감정도, 참지 말고 시원하게 터뜨려보세요." ];
    const statement = resolutionStatements[Math.floor(Math.random() * resolutionStatements.length)];
    const sentenceParts = [{ text: statement, type: 'effect' }];
    createSentence(sentenceParts);
    setTimeout(() => {
      retryBtn.classList.remove('hidden');
      blurOverlay.classList.remove('hidden');
    }, 5000);
    sound.onended = null;
  };
}


// --- 6) 경험 시작 ---
async function startExperience(selectedScript) {
  episodeSelectionContainer.classList.add('hidden');

  scriptBody.innerHTML = '';
  scriptView.classList.remove('hidden');
  scriptView.style.opacity = 1;

  const cacheLines = lineCache.get(selectedScript.id);
  const linesArr = cacheLines || toLines(LINES[AUDIO_KEY[selectedScript.audio]]);

  await new Promise(requestAnimationFrame);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < linesArr.length; i++) {
    const lineDiv = document.createElement('div');
    lineDiv.classList.add('line');
    const text = linesArr[i] || ' ';
    lineDiv.textContent = text;
    lineDiv.setAttribute('aria-label', text);
    frag.appendChild(lineDiv);
  }
  scriptBody.appendChild(frag);

  if (!gutAudioInstance) gutAudioInstance = playGutLoop();
  gutAudioInstance.pause();

  currentScriptId = selectedScript.id;
  const cachedAudio = audioCache.get(selectedScript.id);
  currentDialogueAudio = cachedAudio ? cachedAudio : new Audio(selectedScript.audio);

  currentDialogueAudio.loop = false;
  try { currentDialogueAudio.currentTime = 0; } catch (_) {}

  currentDialogueAudio.addEventListener('play',  () => gutAudioInstance.play());
  currentDialogueAudio.addEventListener('pause', () => gutAudioInstance.pause());
  currentDialogueAudio.addEventListener('ended', () => gutAudioInstance.pause(), { once: true });

  // ▼▼▼ [수정] 2초 딜레이 추가 (기존 로직 유지) ▼▼▼
  // 기존 코드: playScriptKaraoke(); currentDialogueAudio.play(); startChaosAnimation(...);
  
  if (startDelayTimer) clearTimeout(startDelayTimer); // 안전장치

  startDelayTimer = setTimeout(() => {
    playScriptKaraoke();
    currentDialogueAudio.play().catch(()=>{});
    startChaosAnimation(particleFragments[selectedScript.id]); 
  }, 2000); // 2초 대기
  // ▲▲▲ 수정 완료 ▲▲▲
  
  currentDialogueAudio.onended = async () => {
    if (playbackInterval) clearTimeout(playbackInterval);
    await startGatheringAnimation();
    if (allowRecognition) {
      scriptView.classList.add('hidden');
      loadCSVAndStartRecognition(selectedScript.themeDataUrl);
      
      setTimeout(() => {
        responseGuides.classList.remove('hidden');
        setTimeout(() => {
          document.getElementById('initial-voice-prompt')?.classList.add('visible');
        }, 1000);
      }, 500);
    }
  };
}


// --- 7) 이벤트 및 초기화 ---
document.addEventListener('DOMContentLoaded', () => {
  preloadFartSounds();
  preloadDialogueAssets();
  console.log('🎉 모든 리소스 준비 완료.');
  
  const introContainer = document.getElementById('intro-container');
  const logoTextElement = document.querySelector('.logo-text');
  
  const fx = new TextScramble(logoTextElement);
  
  const runAnimation = async () => {
    await fx.setText('Bub');
    await new Promise(resolve => setTimeout(resolve, 200));
    await fx.setText('Bubbli');
    await new Promise(resolve => setTimeout(resolve, 200));
    await fx.setText('Bubbling');
  };
  
  const loopAnimation = async () => {
    while (true) {
      await runAnimation();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await fx.setText('');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };
  
  loopAnimation();

  startBtn.addEventListener('click', () => {
    introContainer.classList.add('hidden'); 
    episodeSelectionContainer.classList.remove('hidden');
    initializeEpisodeSelector();
  }, { once: true });
  
  retryBtn.addEventListener('click', () => { location.reload(); });
});


function initializeEpisodeSelector() {
    let scale = 0.5;
    let translateX = (viewport.clientWidth - stage.clientWidth * scale) / 2;
    let translateY = (viewport.clientHeight - stage.clientHeight * scale) / 2;
    let isDragging = false;
    let startX, startY, dragStartX, dragStartY;

    // (보내주신 파일의 랜덤 배치 및 Fisher-Yates 로직 유지)
    const positions = [
        { top: '20%', left: '15%' }, { top: '55%', left: '10%' },
        { top: '10%', left: '40%' }, { top: '70%', left: '35%' },
        { top: '25%', left: '65%' }, { top: '65%', left: '68%' },
        { top: '15%', left: '85%' }, { top: '80%', left: '88%' },
        { top: '45%', left: '80%' }, { top: '45%', left: '50%' }
    ];

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    const shuffledPositions = shuffle(positions);

    books.forEach((book, index) => {
        if (shuffledPositions[index]) {
            book.style.top = shuffledPositions[index].top;
            book.style.left = shuffledPositions[index].left;
        }
    });

    function applyTransform() { stage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; }
    
    viewport.addEventListener('mousedown', (e) => {
        isDragging = true; startX = e.pageX; startY = e.pageY;
        dragStartX = translateX; dragStartY = translateY;
        viewport.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => { isDragging = false; viewport.style.cursor = 'grab'; });
    viewport.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.pageX - startX; const dy = e.pageY - startY;
        translateX = dragStartX + dx; translateY = dragStartY + dy;
        requestAnimationFrame(applyTransform);
    });
    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const oldScale = scale;
        if (e.deltaY < 0) { scale = Math.min(2.5, scale * 1.1); } 
        else { scale = Math.max(0.3, scale / 1.1); }
        const mouseX = e.pageX - translateX; const mouseY = e.pageY - translateY;
        translateX = e.pageX - (mouseX * scale) / oldScale;
        translateY = e.pageY - (mouseY * scale) / oldScale;
        requestAnimationFrame(applyTransform);
    });

    books.forEach((book, index) => {
        let isBookDown = false;
        let hasDragged = false; 

        book.addEventListener('mouseenter', (e) => {
            const title = book.querySelector('h2').textContent;
            const description = episodeDescriptions[title];
            
            if (description) {
                tooltipTitle.textContent = title;
                tooltipDescription.textContent = description;
                tooltip.classList.remove('hidden');
                setTimeout(() => {
                    tooltip.classList.add('visible');
                    updateTooltipPosition(e); 
                }, 10);
            }
        });

        book.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        book.addEventListener('mousemove', (e) => {
           updateTooltipPosition(e);
        });

        book.addEventListener('mousedown', (e) => { 
            isBookDown = true;
            hasDragged = false; 
        });
        
        viewport.addEventListener('mousemove', (e) => {
            if (isBookDown) { 
                hasDragged = true;
            }
        });
        
        book.addEventListener('mouseup', (e) => {
            if (isBookDown && !hasDragged) {
                const selectedScriptData = dialogueScripts[index];
                if (selectedScriptData) {
                    startExperience(selectedScriptData);
                }
                else console.error(`${index}번 책에 해당하는 데이터가 없습니다.`);
            }
            isBookDown = false;
            hasDragged = false;
        });
    });

    function updateTooltipPosition(e) {
        const tooltipRect = tooltip.getBoundingClientRect();
        let newX = e.clientX + 20;
        let newY = e.clientY + 20;

        if (newX + tooltipRect.width > window.innerWidth - 20) {
            newX = e.clientX - tooltipRect.width - 20;
        }
        if (newY + tooltipRect.height > window.innerHeight - 20) {
            newY = e.clientY - tooltipRect.height - 20;
        }

        tooltip.style.left = `${newX}px`;
        tooltip.style.top = `${newY}px`;
    }
    
    applyTransform();
}

closeButton.addEventListener('click', () => {
  scriptView.classList.add('hidden');
  scriptView.style.opacity = 0;
  episodeSelectionContainer.classList.remove('hidden');
  
  // ▼▼▼ [추가] 딜레이 중 닫기 버튼 클릭 시 타이머 취소 (재생 방지) ▼▼▼
  if (startDelayTimer) {
    clearTimeout(startDelayTimer);
    startDelayTimer = null;
  }
  // ▲▲▲ 추가 완료 ▲▲▲

  if (currentDialogueAudio) {
    currentDialogueAudio.pause();
    currentDialogueAudio = null;
  }
  if (playbackInterval) clearTimeout(playbackInterval);

  if (typeof stopChaosAnimation === 'function') {
      stopChaosAnimation(); 
  }
  document.getElementById('particleCanvas').classList.add('hidden');
});