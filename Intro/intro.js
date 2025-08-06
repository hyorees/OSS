const data = [
  {
    icon: '📅',
    title: '하루하루 감정을 기록해요',
    desc: '간단한 달력과 이모지로 오늘의 감정을 쉽고 빠르게 기록하세요.',
  },
  {
    icon: '📝',
    title: '오늘의 할 일을 기록해요',
    desc: '오늘의 할 일을 잊지 않고 체크할 수 있는 투두리스트 기능입니다.',
  },
  {
    icon: '📊',
    title: '한 달 동안의 감정 통계를 확인해요',
    desc: '차트형태로 감정 변화를 시각화하여 한눈에 파악할 수 있습니다.',
  }
];

let currentIndex = 0;
const iconEl = document.getElementById('icon');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('desc');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
  window.location.href = 'http://127.0.0.1:5500/home/index.html'; 
});


function updateContent(index) {
  iconEl.textContent = data[index].icon;
  titleEl.textContent = data[index].title;
  descEl.textContent = data[index].desc;
  
  if (index === data.length - 1) {
    startBtn.style.display = 'inline-block';
  } else {
    startBtn.style.display = 'none';
  }
}

function fadeOutIn(newIndex) {
  iconEl.style.opacity = 0;
  titleEl.style.opacity = 0;
  descEl.style.opacity = 0;
  startBtn.style.opacity = 0;

  setTimeout(() => {
    updateContent(newIndex);

    iconEl.style.opacity = 1;
    titleEl.style.opacity = 1;
    descEl.style.opacity = 1;
    startBtn.style.opacity = 1;

    currentIndex = newIndex;
  }, 500);
}

window.addEventListener('wheel', e => {
  if (e.deltaY > 0) {
    const nextIndex = (currentIndex + 1) % data.length;
    fadeOutIn(nextIndex);
  } else if (e.deltaY < 0) {
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    fadeOutIn(prevIndex);
  }
});

// 초기 세팅
updateContent(0);