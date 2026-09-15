const consentKey = 'findory-privacy-notice-v1';

function showPrivacyNotice() {
  if (localStorage.getItem(consentKey)) return;
  const notice = document.createElement('aside');
  notice.className = 'privacy-notice';
  notice.setAttribute('role', 'dialog');
  notice.setAttribute('aria-label', 'Datenschutzhinweis');
  notice.innerHTML = '<div><strong>Datenschutzhinweis</strong><p>Findory verwendet derzeit keine optionalen Tracking- oder Marketing-Cookies. Es werden nur technisch notwendige Funktionen genutzt.</p></div><div class="privacy-notice-actions"><a href="datenschutz.html">Datenschutz</a><button type="button">Verstanden</button></div>';
  notice.querySelector('button').addEventListener('click', () => {
    localStorage.setItem(consentKey, 'acknowledged');
    notice.remove();
  });
  document.body.append(notice);
}

document.addEventListener('DOMContentLoaded', showPrivacyNotice);
