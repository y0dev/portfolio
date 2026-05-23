"use client";

export default function ShareButton() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        text: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {});
    }
  };

  return (
    <button
      className="post-header-shareButton"
      id="shareButton"
      onClick={handleShare}
    >
      Share
    </button>
  );
}

