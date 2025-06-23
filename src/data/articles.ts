export interface Image {
  id: string;
  title: string;
  caption: string;
  image: string;
}

export interface CodeBlock {
  id: string;
  language: string;
  content: string;
}

export interface Blockquote {
  id: string;
  content: string;
}

export interface Link {
  id: string;
  text: string;
  website: string;
}

export interface List {
  id: string;
  items: string[];
  list_type: "ordered" | "unordered";
}

export interface ContentSection {
  paragraphs: string[];
  images: Image[];
  code: CodeBlock[];
  blockquotes: Blockquote[];
  links: Link[];
  lists: List[];
}

export interface Article {
  title: string;
  date: string;
  id: string;
  tags: string[];
  content: ContentSection[];
  type: "article" | "note";
}

export const articles: Article[] = [
  {
    title: "Building Scalable React Applications with TypeScript",
    date: "Jan 15, 2024",
    id: "building-scalable-react-applications",
    tags: ["React", "TypeScript", "Architecture"],
    type: "article",
    content: [
      {
        paragraphs: [
          "Building large-scale React applications requires careful planning and the right architectural decisions. TypeScript provides the type safety we need, but it's how we structure our components and state management that determines the success of our application.",
          "In this article, we'll explore the best practices for creating scalable React applications using TypeScript, covering everything from component composition to state management patterns."
        ],
        images: [
          {
            id: "001",
            title: "React TypeScript Architecture",
            caption: "A visual representation of a scalable React TypeScript architecture",
            image: "/images/react-architecture.jpg"
          }
        ],
        code: [
          {
            id: "001",
            language: "typescript",
            content: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

const UserContext = createContext<User | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};`
          }
        ],
        blockquotes: [
          {
            id: "001",
            content: "TypeScript is not just about type safety—it's about creating better developer experiences and more maintainable codebases."
          }
        ],
        links: [
          {
            id: "001",
            text: "React TypeScript Cheatsheet",
            website: "https://react-typescript-cheatsheet.netlify.app/"
          }
        ],
        lists: [
          {
            id: "001",
            items: [
              "Use TypeScript for all new React projects",
              "Implement proper component composition",
              "Choose the right state management solution",
              "Write comprehensive tests",
              "Document your component APIs"
            ],
            list_type: "unordered"
          }
        ]
      },
      {
        paragraphs: [
          "Component composition is one of the most powerful features of React. By breaking down our UI into smaller, reusable components, we can create more maintainable and testable code.",
          "When working with TypeScript, we can leverage interfaces to define the props that our components expect, making our code more self-documenting and catching errors at compile time."
        ],
        images: [],
        code: [
          {
            id: "002",
            language: "typescript",
            content: `interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  onClick,
  disabled = false
}) => {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};`
          }
        ],
        blockquotes: [],
        links: [],
        lists: []
      }
    ]
  },
  {
    title: "Understanding Modern CSS Grid Layout",
    date: "Dec 28, 2023",
    id: "understanding-modern-css-grid",
    tags: ["CSS", "Grid", "Layout"],
    type: "article",
    content: [
      {
        paragraphs: [
          "CSS Grid Layout is one of the most powerful layout systems available in modern web development. It provides a two-dimensional layout system that makes it easy to create complex layouts that were previously difficult or impossible with CSS.",
          "In this comprehensive guide, we'll explore the fundamentals of CSS Grid and how to use it effectively in your projects."
        ],
        images: [],
        code: [
          {
            id: "001",
            language: "css",
            content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`
          }
        ],
        blockquotes: [
          {
            id: "001",
            content: "CSS Grid is the first CSS layout system designed specifically for two-dimensional layouts."
          }
        ],
        links: [
          {
            id: "001",
            text: "CSS Grid Complete Guide",
            website: "https://css-tricks.com/snippets/css/complete-guide-grid/"
          }
        ],
        lists: [
          {
            id: "001",
            items: [
              "Grid containers and grid items",
              "Grid lines and grid tracks",
              "Grid areas and grid templates",
              "Responsive grid layouts",
              "Grid alignment and justification"
            ],
            list_type: "ordered"
          }
        ]
      }
    ]
  },
  {
    title: "Quick Note: React Hooks Best Practices",
    date: "Dec 20, 2023",
    id: "react-hooks-best-practices",
    tags: ["React", "Hooks", "Best Practices"],
    type: "note",
    content: [
      {
        paragraphs: [
          "React Hooks have revolutionized how we write functional components. Here are some key best practices to keep in mind when using hooks in your React applications."
        ],
        images: [],
        code: [
          {
            id: "001",
            language: "javascript",
            content: `// ✅ Good: Custom hook for data fetching
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  return { user, loading };
};`
          }
        ],
        blockquotes: [
          {
            id: "001",
            content: "Always use the dependency array in useEffect to prevent infinite re-renders."
          }
        ],
        links: [],
        lists: [
          {
            id: "001",
            items: [
              "Always call hooks at the top level",
              "Don't call hooks inside loops, conditions, or nested functions",
              "Use the dependency array in useEffect",
              "Create custom hooks for reusable logic",
              "Use useCallback and useMemo for performance optimization"
            ],
            list_type: "unordered"
          }
        ]
      }
    ]
  },
  {
    title: "Theology Note: Understanding Grace",
    date: "Dec 15, 2023",
    id: "understanding-grace-theology",
    tags: ["Theology", "Grace", "Salvation"],
    type: "note",
    content: [
      {
        paragraphs: [
          "Grace is one of the most fundamental concepts in Christian theology. It represents God's unmerited favor toward sinners, providing salvation through faith in Jesus Christ.",
          "Understanding grace is essential for grasping the gospel message and living a life of gratitude and service to God."
        ],
        images: [],
        code: [],
        blockquotes: [
          {
            id: "001",
            content: "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast. - Ephesians 2:8-9"
          }
        ],
        links: [],
        lists: [
          {
            id: "001",
            items: [
              "Grace is unmerited favor",
              "Grace is the foundation of salvation",
              "Grace leads to gratitude and good works",
              "Grace is available to all who believe",
              "Grace transforms the believer's life"
            ],
            list_type: "unordered"
          }
        ]
      }
    ]
  }
]; 