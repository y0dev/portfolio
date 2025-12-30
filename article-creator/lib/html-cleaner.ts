/**
 * Strips code-block-wrapper divs and removes styling from pre/code elements
 * The portfolio's ContentRenderer expects just plain <pre><code> elements and adds styling dynamically
 */
export function stripCodeBlockWrappers(html: string): string {
  let cleaned = html;
  
  // Pattern to match code-block-wrapper divs
  const wrapperPattern = /<div[^>]*class="[^"]*code-block-wrapper[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  
  // Keep processing until no more wrappers are found (handle nested cases)
  let previousLength = 0;
  while (cleaned.length !== previousLength) {
    previousLength = cleaned.length;
    cleaned = cleaned.replace(wrapperPattern, (match, inner) => {
      // Try to extract just the <pre><code> elements from the inner content
      // Remove any nested wrappers first
      let preContent = inner;
      
      // Remove nested code-block-wrapper divs
      const nestedPattern = /<div[^>]*class="[^"]*code-block-wrapper[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
      while (nestedPattern.test(preContent)) {
        preContent = preContent.replace(nestedPattern, '$1');
      }
      
      // Try to find the <pre> element - it might be nested in other divs
      const preMatch = preContent.match(/<pre[^>]*>[\s\S]*?<\/pre>/i);
      if (preMatch && preMatch.length > 0) {
        let preHtml = preMatch[0];
        
        // Remove all attributes from <pre> element (class, style, etc.)
        preHtml = preHtml.replace(/<pre[^>]*>/, '<pre>');
        
        // Remove all attributes from <code> element but keep language class
        // The portfolio's ContentRenderer needs the language class
        preHtml = preHtml.replace(/<code([^>]*)>/gi, (_match: string, attrs: string) => {
          // Extract language from class attribute if present
          const langMatch = attrs.match(/class="[^"]*language-(\w+)[^"]*"/i) || attrs.match(/class='[^']*language-(\w+)[^']*'/i);
          if (langMatch && langMatch[1]) {
            return `<code class="language-${langMatch[1]}">`;
          }
          return '<code>';
        });
        
        return preHtml;
      }
      
      // If no pre found, try to find it by removing wrapper divs
      // Remove common wrapper div classes
      preContent = preContent.replace(/<div[^>]*class="[^"]*relative[^"]*group[^"]*"[^>]*>/gi, '');
      preContent = preContent.replace(/<div[^>]*class="[^"]*bg-gray-900[^"]*"[^>]*>/gi, '');
      
      // Count divs to balance closing tags
      const openDivs = (preContent.match(/<div[^>]*>/gi) || []).length;
      let closeDivs = 0;
      while (closeDivs < openDivs && preContent.includes('</div>')) {
        preContent = preContent.replace(/<\/div>/, '');
        closeDivs++;
      }
      
      // Now try to find pre again
      const preMatch2 = preContent.match(/<pre[^>]*>[\s\S]*?<\/pre>/i);
      if (preMatch2 && preMatch2.length > 0) {
        let preHtml = preMatch2[0];
        
        // Remove all attributes from <pre> element
        preHtml = preHtml.replace(/<pre[^>]*>/, '<pre>');
        
        // Remove all attributes from <code> element but keep language class
        preHtml = preHtml.replace(/<code([^>]*)>/gi, (_match: string, attrs: string) => {
          const langMatch = attrs.match(/class="[^"]*language-(\w+)[^"]*"/i) || attrs.match(/class='[^']*language-(\w+)[^']*'/i);
          if (langMatch && langMatch[1]) {
            return `<code class="language-${langMatch[1]}">`;
          }
          return '<code>';
        });
        
        return preHtml;
      }
      
      // If still no pre found, return empty (something went wrong)
      return '';
    });
  }
  
  // Also handle pre elements that are not wrapped in code-block-wrapper but have styling
  // Remove all attributes from pre elements, keeping only language class on code
  cleaned = cleaned.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_match: string, inner: string) => {
    // Remove all attributes from code elements but keep language class
    const cleanedInner = inner.replace(/<code([^>]*)>/gi, (_codeMatch: string, attrs: string) => {
      const langMatch = attrs.match(/class="[^"]*language-(\w+)[^"]*"/i) || attrs.match(/class='[^']*language-(\w+)[^']*'/i);
      if (langMatch && langMatch[1]) {
        return `<code class="language-${langMatch[1]}">`;
      }
      return '<code>';
    });
    return `<pre>${cleanedInner}</pre>`;
  });
  
  // Clean up any remaining empty wrapper remnants
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*relative[^"]*group[^"]*"[^>]*>\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*bg-gray-900[^"]*"[^>]*>\s*<\/div>/gi, '');
  
  return cleaned;
}

