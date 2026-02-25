function renderKaTeX(root) {
  if (typeof renderMathInElement !== "function" || !root) return;

  renderMathInElement(root, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  });
}

if (typeof document$ !== "undefined" && document$.subscribe) {
  document$.subscribe(({ body }) => renderKaTeX(body));
} else {
  document.addEventListener("DOMContentLoaded", () => renderKaTeX(document.body));
}
