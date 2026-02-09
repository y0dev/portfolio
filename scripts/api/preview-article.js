// preview-article.js
window.addEventListener('DOMContentLoaded', function() {
  const md = localStorage.getItem('preview_md') || '';
  const html = marked.parse(md);
  document.getElementById('previewContent').innerHTML = html;
}); 