module.exports = {

"[project]/.next-internal/server/app/article/[slug]/page/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/data/articles.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "articles": (()=>articles)
});
const articles = [
    {
        title: "Building Scalable React Applications with TypeScript",
        date: "Jan 15, 2024",
        id: "building-scalable-react-applications",
        tags: [
            "React",
            "TypeScript",
            "Architecture"
        ],
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
        tags: [
            "CSS",
            "Grid",
            "Layout"
        ],
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
        tags: [
            "React",
            "Hooks",
            "Best Practices"
        ],
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
        tags: [
            "Theology",
            "Grace",
            "Salvation"
        ],
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
}}),
"[project]/src/app/article/[slug]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ArticlePage),
    "generateStaticParams": (()=>generateStaticParams)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$articles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/articles.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
;
;
;
;
async function generateStaticParams() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$articles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["articles"].filter((article)=>article.type === "article").map((article)=>({
            slug: article.id
        }));
}
function ArticlePage({ params }) {
    const article = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$articles$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["articles"].find((a)=>a.id === params.slug && a.type === "article");
    if (!article) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen py-20 px-4 sm:px-6 lg:px-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                    className: "mb-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        href: "/articles",
                        className: "text-blue-600 dark:text-blue-400 hover:underline",
                        children: "← Back to Articles"
                    }, void 0, false, {
                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2 mb-4",
                            children: article.tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium",
                                    children: tag
                                }, tag, false, {
                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                    lineNumber: 43,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4",
                            children: article.title
                        }, void 0, false, {
                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 dark:text-gray-400 text-lg",
                            children: article.date
                        }, void 0, false, {
                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                    className: "prose prose-lg dark:prose-invert max-w-none",
                    children: article.content.map((section, sectionIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "mb-12",
                            children: [
                                section.paragraphs.map((paragraph, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-700 dark:text-gray-300 mb-6 leading-relaxed",
                                        children: paragraph
                                    }, index, false, {
                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                        lineNumber: 65,
                                        columnNumber: 17
                                    }, this)),
                                section.images.map((image)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                                        className: "my-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-4xl mb-4",
                                                    children: "🖼️"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 74,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-600 dark:text-gray-400",
                                                    children: [
                                                        "Image: ",
                                                        image.title
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 21
                                                }, this),
                                                image.caption && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500 dark:text-gray-500 mt-2",
                                                    children: image.caption
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 79,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 19
                                        }, this)
                                    }, image.id, false, {
                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                        lineNumber: 72,
                                        columnNumber: 17
                                    }, this)),
                                section.code.map((codeBlock)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "my-8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gray-900 dark:bg-gray-800 rounded-lg p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-400 text-sm font-mono",
                                                            children: codeBlock.language
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                            lineNumber: 92,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "text-gray-400 hover:text-white text-sm",
                                                            children: "Copy"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                    className: "text-gray-100 overflow-x-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                        children: codeBlock.content
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 99,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 19
                                        }, this)
                                    }, codeBlock.id, false, {
                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 17
                                    }, this)),
                                section.blockquotes.map((blockquote)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("blockquote", {
                                        className: "border-l-4 border-blue-500 pl-6 my-8 italic text-gray-700 dark:text-gray-300",
                                        children: [
                                            '"',
                                            blockquote.content,
                                            '"'
                                        ]
                                    }, blockquote.id, true, {
                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this)),
                                section.links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "my-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: link.website,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "text-blue-600 dark:text-blue-400 hover:underline font-medium",
                                            children: [
                                                link.text,
                                                " →"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 19
                                        }, this)
                                    }, link.id, false, {
                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 17
                                    }, this)),
                                section.lists.map((list)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "my-6",
                                        children: list.list_type === "ordered" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                            className: "list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300",
                                            children: list.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: item
                                                }, index, false, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                            lineNumber: 134,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300",
                                            children: list.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: item
                                                }, index, false, {
                                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 21
                                        }, this)
                                    }, list.id, false, {
                                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this))
                            ]
                        }, sectionIndex, true, {
                            fileName: "[project]/src/app/article/[slug]/page.tsx",
                            lineNumber: 62,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "mt-16 pt-8 border-t border-gray-200 dark:border-gray-700",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-600 dark:text-gray-400",
                                children: "Tags:"
                            }, void 0, false, {
                                fileName: "[project]/src/app/article/[slug]/page.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this),
                            article.tags.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: `/articles?tag=${tag}`,
                                    className: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                                    children: tag
                                }, tag, false, {
                                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/article/[slug]/page.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/article/[slug]/page.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/article/[slug]/page.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/article/[slug]/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}}),
"[project]/src/app/article/[slug]/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/article/[slug]/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=_f0075507._.js.map