/* eslint-disable */
import type { Article } from '@/types';

export const articles: Article[] = [
  {
    "id": "sample-article",
    "title": "My First Markdown Article",
    "description": "This is a sample article to demonstrate the new content system.",
    "date": "2024-01-15T10:00:00Z",
    "tags": [
      "sample",
      "markdown",
      "demo"
    ],
    "type": "article",
    "content": [
      {
        "htmlContent": "<p>This is the first paragraph of the sample article. It&#39;s written in <strong>Markdown</strong> and will be parsed by our script.</p>\n<p>Here&#39;s a second paragraph, demonstrating how the content is structured.</p>\n"
      }
    ]
  }
];
