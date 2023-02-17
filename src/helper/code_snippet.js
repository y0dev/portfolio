class CodeSnippets {
  static create() {
    return new CodeSnippets();
  }

  constructor() {
    this.initialiseObject();
    this.addCodeSnippetLabels();
  }

  initialiseObject() {
    this.languages = [
      { cssClass: 'language-ts', label: 'TypeScript' },
      { cssClass: 'language-typescript', label: 'TypeScript' },
      { cssClass: 'language-html', label: 'HTML' },
      { cssClass: 'language-css', label: 'CSS' },
      { cssClass: 'language-js', label: 'JavaScript' },
      { cssClass: 'language-json', label: 'JSON' }
    ];
  }

  addCodeSnippetLabels() {
    this.languages.forEach((language) => {
      const instances = document.querySelectorAll(`code.${language.cssClass}`);

      instances.forEach((instance) => {
        const element = this.createNewElement(language.label);
        instance.parentNode.appendChild(element);
      });
    });
  }

  createNewElement(label) {
    const inputElement = document.createElement('div');
    inputElement.classList.add('codeLabel');
    inputElement.innerText = label;

    return inputElement;
  }
}