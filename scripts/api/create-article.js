// create-article.js

document.getElementById('articleForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const status = document.getElementById('status');
  status.textContent = '';

  // Gather form data
  const data = {
    title: form.title.value.trim(),
    id: form.id.value.trim(),
    description: form.description.value.trim(),
    date: form.date.value,
    tags: form.tags.value.split(',').map(t => t.trim()).filter(Boolean),
    type: form.type.value,
    status: form.status.value,
    image: form.image.value.trim(),
    markdown: form.content.value,
    html: marked.parse(form.content.value)
  };

  // POST to backend endpoint (to be implemented server-side)
  try {
    status.textContent = 'Uploading...';
    const resp = await fetch('/api/article-upload.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (resp.ok) {
      status.textContent = '✅ Article uploaded and saved!';
    } else {
      const err = await resp.text();
      status.textContent = '❌ Upload failed: ' + err;
    }
  } catch (err) {
    status.textContent = '❌ Error: ' + err;
  }
});

function previewArticle() {
  const md = document.getElementById('mdContent').value;
  // Store markdown in localStorage for preview page
  localStorage.setItem('preview_md', md);
  window.open('preview-article.html', '_blank');
} 