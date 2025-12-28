// Slugify function based on Python script's slugify_heading
export function slugifyTitle(title: string): string {
  if (!title) return '';
  
  // Lowercase the title
  let slug = title.toLowerCase().trim();
  
  // Replace & and / with nothing
  slug = slug.replace(/&/g, '').replace(/\//g, '');
  
  // Remove unwanted characters (anything not alphanumeric, dash, or space)
  slug = slug.replace(/[^a-z0-9\s-]/g, '');
  
  // Replace spaces and underscores with dashes
  slug = slug.replace(/[\s_]+/g, '-');
  
  // Replace multiple consecutive dashes with a single dash
  slug = slug.replace(/-+/g, '-');
  
  // Strip dashes from beginning and end
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return date;
  }
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const categories = [
  {
    name: "theology",
    tags: ["Theology", "God", "Gospel", "Reformed"],
    image: {
      alt: "bible-icon",
      name: "images/bible-icon.png"
    }
  },
  {
    name: "covenant",
    tags: ["Christ", "Covenant", "Reformed", "Gospel"],
    image: {
      alt: "bible-icon",
      name: "images/bible-icon.png"
    }
  },
  {
    name: "thankful",
    tags: ["Christ", "Salvation", "Love", "Thankful"],
    image: {
      alt: "thankful-icon",
      name: "images/thankful.png"
    }
  },
  {
    name: "health",
    tags: ["Health", "Fitness"],
    image: {
      alt: "health-img",
      name: "images/heart_strength.png"
    }
  },
  {
    name: "tech",
    tags: ["Technology", "Engineer"],
    image: {
      alt: "web-dev-img",
      name: "images/web-dev.png"
    }
  },
  {
    name: "technology",
    tags: ["Technology", "Engineer"],
    image: {
      alt: "web-dev-img",
      name: "images/web-dev.png"
    }
  },
  {
    name: "embedded",
    tags: ["Technology", "Embedded", "Engineer"],
    image: {
      alt: "binary-code-img",
      name: "images/binary-code.png"
    }
  },
  {
    name: "quantum",
    tags: ["Technology", "Quantum"],
    image: {
      alt: "physics-img",
      name: "images/physics-icon.png"
    }
  },
  {
    name: "algo",
    tags: ["Data Structures", "Algorithms", "Tech Interview"],
    image: {
      alt: "algo-img",
      name: "images/algorithm.png"
    }
  },
  {
    name: "algorithm",
    tags: ["Data Structures", "Algorithms", "Tech Interview"],
    image: {
      alt: "algo-img",
      name: "images/algorithm.png"
    }
  },
  {
    name: "system design",
    tags: ["System Design", "Technology", "Tech Interview"],
    image: {
      alt: "web-dev-img",
      name: "images/web-dev.png"
    }
  },
  {
    name: "security",
    tags: ["Cybersecurity", "Encryption", "Network Security"],
    image: {
      alt: "image-title",
      name: "images/binary-code.png"
    }
  },
  {
    name: "cloud",
    tags: ["Cloud Computing", "AWS", "Azure", "GCP"],
    image: {
      alt: "image-title",
      name: "images/web-dev.png"
    }
  },
  {
    name: "ai",
    tags: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
    image: {
      alt: "image-title",
      name: "images/web-dev.png"
    }
  },
  {
    name: "risc-v",
    tags: ["RISC-V", "Embedded Systems", "Microcontrollers"],
    image: {
      alt: "binary-code-img",
      name: "images/binary-code.png"
    }
  },
  {
    name: "linux",
    tags: ["Linux", "Operating Systems", "Kernel Development"],
    image: {
      alt: "image-title",
      name: "images/binary-code.png"
    }
  },
  {
    name: "docker",
    tags: ["Docker", "Containers", "DevOps"],
    image: {
      alt: "docker-image",
      name: "images/docker.png"
    }
  },
  {
    name: "kubernetes",
    tags: ["Kubernetes", "Container Orchestration", "DevOps"],
    image: {
      alt: "image-title",
      name: "images/binary-code.png"
    }
  },
  {
    name: "networking",
    tags: ["Networking", "TCP/IP", "Protocols"],
    image: {
      alt: "image-title",
      name: "images/binary-code.png"
    }
  },
  {
    name: "database",
    tags: ["Database", "SQL", "NoSQL"],
    image: {
      alt: "image-title",
      name: "images/web-dev.png"
    }
  },
  {
    name: "system programming",
    tags: ["Low-Level Programming", "Assembly", "Embedded"],
    image: {
      alt: "binary-code-img",
      name: "images/binary-code.png"
    }
  },
  {
    name: "web development",
    tags: ["HTML", "CSS", "JavaScript", "ReactJS", "NodeJS"],
    image: {
      alt: "web-dev-img",
      name: "images/web-dev.png"
    }
  },
  {
    name: "cryptography",
    tags: ["Cryptography", "Randomness Testing", "Security", "Encryption"],
    image: {
      alt: "crypto-img",
      name: "images/crypto.png"
    }
  },
  {
    name: "default",
    tags: ["Template", "Info", "Beginner"],
    image: {
      alt: "image-title",
      name: "images/image.png"
    }
  }
];

export function getTagsForCategory(category: string): string[] {
  const normalizedCategory = category.toLowerCase();
  const categoryObj = categories.find(cat => cat.name.toLowerCase() === normalizedCategory);
  const defaultCategory = categories.find(cat => cat.name === "default");
  return categoryObj?.tags || defaultCategory?.tags || [];
}

export function getImageForCategory(category: string): { alt: string; name: string } {
  const normalizedCategory = category.toLowerCase();
  const categoryObj = categories.find(cat => cat.name.toLowerCase() === normalizedCategory);
  const defaultCategory = categories.find(cat => cat.name === "default");
  return categoryObj?.image || defaultCategory?.image || { alt: "image-title", name: "images/image.png" };
}

export function getAllCategories() {
  return categories.filter(cat => cat.name !== "default");
}

interface ParsedMarkdown {
  title: string;
  description: string;
  date: string;
  category: string;
  type: 'article' | 'note';
  content: string;
}

export function parseMarkdownFile(markdownContent: string): ParsedMarkdown {
  const lines = markdownContent.split('\n');
  
  // Find the Blog/Note Info section heading
  const infoSectionStart = lines.findIndex(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed.startsWith('##') && (
      trimmed.includes('blog/note info') || 
      trimmed.includes('blog info') ||
      trimmed.includes('note info')
    );
  });
  
  if (infoSectionStart === -1) {
    throw new Error('Blog/Note Info section not found in markdown file. Expected a heading like "## Blog/Note Info"');
  }
  
  // Extract info section lines (until next ## heading or end of file)
  const infoSection: string[] = [];
  let i = infoSectionStart + 1;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    // Stop at next heading
    if (trimmed.startsWith('##')) {
      break;
    }
    infoSection.push(lines[i]);
    i++;
  }
  
  // Parse info fields (handle both "- Field:" and "* Field:" list formats)
  const titleMatch = infoSection.find(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed.startsWith('- title:') || 
           trimmed.startsWith('* title:') || 
           trimmed.startsWith('title:');
  });
  const descriptionMatch = infoSection.find(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed.startsWith('- description:') || 
           trimmed.startsWith('* description:') || 
           trimmed.startsWith('description:');
  });
  const dateMatch = infoSection.find(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed.startsWith('- date:') || 
           trimmed.startsWith('* date:') || 
           trimmed.startsWith('date:');
  });
  const categoryMatch = infoSection.find(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed.startsWith('- category:') || 
           trimmed.startsWith('* category:') || 
           trimmed.startsWith('category:');
  });
  const typeMatch = infoSection.find(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed.startsWith('- type:') || 
           trimmed.startsWith('* type:') || 
           trimmed.startsWith('type:');
  });
  
  // Extract values (handle "- Field: value", "* Field: value", and "Field: value" formats)
  const extractValue = (line: string | undefined): string => {
    if (!line) return '';
    const trimmed = line.trim();
    // Remove list marker if present (- or *)
    const cleaned = trimmed.replace(/^[-*]\s+/, '');
    const colonIndex = cleaned.indexOf(':');
    if (colonIndex === -1) return '';
    return cleaned.substring(colonIndex + 1).trim();
  };
  
  const title = extractValue(titleMatch);
  const description = extractValue(descriptionMatch);
  const date = extractValue(dateMatch);
  const category = extractValue(categoryMatch);
  const typeValue = extractValue(typeMatch).toLowerCase();
  const type = (typeValue === 'note' ? 'note' : 'article') as 'article' | 'note';
  
  // Extract content (everything after the info section)
  const contentStart = i;
  const content = lines.slice(contentStart).join('\n').trim();
  
  // Convert date to ISO format if it's in a readable format
  let dateISO = date;
  if (date && !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        dateISO = parsedDate.toISOString().split('T')[0];
      } else {
        // If parsing fails, use current date as fallback
        dateISO = new Date().toISOString().split('T')[0];
      }
    } catch (e) {
      // If parsing fails, use current date as fallback
      dateISO = new Date().toISOString().split('T')[0];
    }
  } else if (!date) {
    // If no date provided, use current date
    dateISO = new Date().toISOString().split('T')[0];
  }
  
  return {
    title,
    description,
    date: dateISO,
    category: category.toLowerCase(),
    type: type === 'note' ? 'note' : 'article',
    content
  };
}