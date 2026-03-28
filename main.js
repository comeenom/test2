const form = document.querySelector('#partnership-form');
const submitButton = document.querySelector('#submit-button');
const statusText = document.querySelector('#form-status');

if (form && submitButton && statusText) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';
    statusText.textContent = '문의 내용을 전송하고 있습니다.';
    statusText.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('submission_failed');
      }

      form.reset();
      statusText.textContent = '문의가 접수되었습니다. 확인 후 회신드리겠습니다.';
      statusText.className = 'form-status success';
    } catch {
      statusText.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
      statusText.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = '문의 보내기';
    }
  });
}
