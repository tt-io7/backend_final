export const inlineStyles = `
  /* Critical path CSS that should be inlined */
  body, html {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #fff;
    color: #333;
  }
  .flex {
    display: flex;
  }
  .flex-col {
    flex-direction: column;
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .w-full {
    width: 100%;
  }
  .pt-20 {
    padding-top: 5rem;
  }
`;
