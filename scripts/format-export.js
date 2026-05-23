const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(__dirname, '..', 'out');

function formatHTMLFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      formatHTMLFiles(fullPath);
    } else if (file.name.endsWith('.html')) {
      try {
        // Read the HTML file
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Basic HTML formatting (indentation and line breaks)
        // Replace self-closing tags that shouldn't be self-closing
        content = content.replace(/<(meta|link|img|input|br|hr|area|base|col|embed|source|track|wbr)([^>]*?)\/>/gi, '<$1$2>');
        
        // Add line breaks before major tags for readability
        content = content
          .replace(/></g, '>\n<')
          .replace(/<!DOCTYPE/gi, '\n<!DOCTYPE')
          .replace(/<html/gi, '\n<html')
          .replace(/<head/gi, '\n  <head')
          .replace(/<\/head>/gi, '\n  </head>')
          .replace(/<body/gi, '\n  <body')
          .replace(/<\/body>/gi, '\n  </body>')
          .replace(/<\/html>/gi, '\n</html>');
        
        // Basic indentation
        const lines = content.split('\n');
        let indentLevel = 0;
        const indentSize = 2;
        const formattedLines = [];
        
        for (let line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) {
            formattedLines.push('');
            continue;
          }
          
          // Decrease indent before closing tags
          if (trimmedLine.match(/^<\/[^/]/) || trimmedLine.match(/^<[^>]+\/>/)) {
            indentLevel = Math.max(0, indentLevel - 1);
          }
          
          formattedLines.push(' '.repeat(indentLevel * indentSize) + trimmedLine);
          
          // Increase indent after opening tags (but not self-closing)
          if (trimmedLine.match(/^<[^/!][^>]*[^/]>$/) && !trimmedLine.match(/<(meta|link|img|input|br|hr|area|base|col|embed|source|track|wbr|script)/i)) {
            indentLevel++;
          }
        }
        
        // Write formatted content
        fs.writeFileSync(fullPath, formattedLines.join('\n'), 'utf8');
        console.log(`Formatted: ${fullPath}`);
      } catch (error) {
        console.error(`Error formatting ${fullPath}:`, error.message);
      }
    }
  }
}

function formatJSFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      formatJSFiles(fullPath);
    } else if (file.name.endsWith('.js') && !file.name.includes('manifest')) {
      try {
        // Use prettier to format JS files
        execSync(`npx prettier --write "${fullPath}" --parser babel`, { stdio: 'inherit' });
        console.log(`Formatted: ${fullPath}`);
      } catch (error) {
        // If prettier fails, try basic formatting
        try {
          let content = fs.readFileSync(fullPath, 'utf8');
          // Basic formatting: add semicolons where needed and format
          content = content.replace(/;/g, ';\n').replace(/\n\n+/g, '\n\n');
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Basic formatted: ${fullPath}`);
        } catch (err) {
          console.error(`Error formatting ${fullPath}:`, err.message);
        }
      }
    }
  }
}

console.log('Starting to format exported files...');
console.log('Formatting HTML files...');
formatHTMLFiles(outDir);
console.log('Formatting JS files...');
formatJSFiles(path.join(outDir, '_next'));
console.log('Formatting complete!');

