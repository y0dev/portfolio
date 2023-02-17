class CopyCode {
  static create() {
    return new CopyCode();
  }
  constructor() {
    this.codeBlocks = document.querySelectorAll(`h5`);
    this.codeBlocks.forEach((block) => {
      block.appendChild(this.createNewElement());
    });
  }

  createNewElement() {
    const copyButton = document.createElement('button');
    copyButton.setAttribute('aria-label', 'Copy this code snippet');
    copyButton.classList.add('copyButton');
    copyButton.innerHTML = `<i class="copyButton-icon far fa-copy"></i>`;
    copyButton.addEventListener('click', this.copyCurrentText(copyButton));

    return copyButton;
  }

  copyCurrentText(copyButton) {
    return async () => {
      const content =
        copyButton.parentNode.nextSibling.nextSibling.firstChild.innerText;
      await navigator.clipboard.writeText(content);

      const oldText = copyButton.innerHTML;
      copyButton.innerHTML =
        'Copied! <i class="copyButton-icon far fa-copy"></i>';
      setTimeout(() => {
        copyButton.innerHTML = oldText;
      }, 3000);
    };
  }
}