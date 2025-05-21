document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.getElementById('updateProfileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  profileBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!name || !email || !phone) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    alert(`프로필이 수정되었습니다.\n이름: ${name}\n이메일: ${email}\n전화번호: ${phone}`);

    // 서버에 수정 요청을 보낼 경우 여기서 처리
  });

  // 친구 삭제 버튼 이벤트
  document.querySelectorAll('.deleteFriendBtn').forEach(button => {
    button.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      const friendName = li.querySelector('.friend-name').textContent;
      if (confirm(`${friendName}님을 친구 목록에서 삭제하시겠습니까?`)) {
        li.remove();
      }
    });
  });

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    alert('로그아웃 되었습니다.');
    window.location.href = '/login.html'; // 필요시 로그인 페이지 URL 변경
  });
});
