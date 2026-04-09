export const lessonArticleShellStyles = `
      .chat-page {
        min-height: 100vh;
      }
      .chat-header {
        text-align: center;
        padding: var(--pico-spacing) 0 calc(var(--pico-spacing) * 3);
      }
      .chat-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: var(--pico-spacing);
      }
      .chat-header p {
        opacity: 0.7;
        font-size: 1.1rem;
      }
      .chat-area {
        min-height: 500px;
        margin-bottom: calc(var(--pico-spacing) * 4);
        padding: var(--pico-spacing);
        border-radius: var(--pico-border-radius);
        gap: var(--pico-spacing);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      }
      .chat-empty {
        text-align: center;
        opacity: 0.6;
        padding: calc(var(--pico-spacing) * 6) 0;
        font-size: 1.1rem;
      }
      .lesson-article-panel {
        max-width: 100%;
        margin: 0;
        padding: calc(var(--pico-spacing) * 1.25);
        border-radius: var(--pico-border-radius);
        line-height: 1.6;
        font-size: 0.97rem;
        border: 1px solid var(--pico-muted-border-color);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        background-color: var(--pico--card-background-color);
        color: var(--pico-color);
      }
      .lesson-article-markdown {
        word-break: break-word;
      }
      .lesson-article-markdown > *:first-child {
        margin-top: 0;
      }
      .lesson-article-markdown p {
        margin: 0 0 var(--pico-spacing);
      }
      .lesson-article-markdown ul,
      .lesson-article-markdown ol {
        margin: 0 0 var(--pico-spacing);
        padding-left: 1.35em;
      }
      .lesson-article-markdown li {
        margin-bottom: calc(var(--pico-spacing) * 0.35);
      }
      .lesson-article-markdown li > p {
        margin-bottom: calc(var(--pico-spacing) * 0.35);
      }
      .lesson-article-markdown h1,
      .lesson-article-markdown h2,
      .lesson-article-markdown h3,
      .lesson-article-markdown h4 {
        margin: calc(var(--pico-spacing) * 1.75) 0 var(--pico-spacing);
        font-weight: 700;
        line-height: 1.25;
      }
      .lesson-article-markdown h1 { font-size: 1.65rem; }
      .lesson-article-markdown h2 { font-size: 1.35rem; }
      .lesson-article-markdown h3 { font-size: 1.15rem; }
      .lesson-article-markdown h4 { font-size: 1.05rem; }
      .lesson-article-markdown blockquote {
        margin: 0 0 var(--pico-spacing);
        padding: calc(var(--pico-spacing) * 0.75) var(--pico-spacing);
        border-left: 4px solid var(--pico-muted-border-color);
        opacity: 0.95;
      }
      .lesson-article-markdown hr {
        margin: calc(var(--pico-spacing) * 1.5) 0;
        border: none;
        border-top: 1px solid var(--pico-muted-border-color);
      }
      .lesson-article-markdown code {
        background-color: var(--pico-code-background-color);
        padding: 2px 6px;
        border-radius: calc(var(--pico-border-radius) / 2);
        font-size: 0.9em;
      }
      .lesson-article-section-title {
        margin-top: calc(var(--pico-spacing) * 2);
        margin-bottom: var(--pico-spacing);
        font-size: 1.15rem;
        font-weight: 700;
        line-height: 1.25;
      }
      .lesson-article-section:first-of-type .lesson-article-section-title {
        margin-top: 0;
      }
      .lesson-article-error {
        text-align: center;
        color: var(--pico-del-color, #c62828);
        padding: calc(var(--pico-spacing) * 2);
      }
`;
