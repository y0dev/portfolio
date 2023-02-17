class PreThemeSwitcher {
    static create() {
      return new PreThemeSwitcher();
    }
  
    constructor() {
      this.setTheme();
    }
  
    setTheme() {
      this.button = document.querySelector('#themeSwitch');
      const currentTheme = localStorage.getItem('theme');
      const html = document.querySelector('html');
  
      if (currentTheme === 'dark') {
        html.classList.add('dark-mode');
        html.classList.remove('light-mode');
        this.button ? (this.button.innerText = '☀️') : null;
      } else {
        html.classList.add('light-mode');
        html.classList.remove('dark-mode');
        this.button ? (this.button.innerText = '🌙') : null;
      }
    }
  }
  
  const preThemeSwitcher = PreThemeSwitcher.create();