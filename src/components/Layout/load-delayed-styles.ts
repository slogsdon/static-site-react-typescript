/* Google-supplied */
/* https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery */
const loadDeferredStyles = () => {
  const addStylesNode = document.getElementById("deferred-styles");
  const replacement = document.createElement("div");

  if (!addStylesNode) {
    return;
  }

  if (addStylesNode.textContent) {
    replacement.innerHTML = addStylesNode.textContent;
  }

  document.body.appendChild(replacement);

  if (addStylesNode.parentElement) {
    addStylesNode.parentElement.removeChild(addStylesNode);
  }
};
const raf = requestAnimationFrame || (window as any).mozRequestAnimationFrame ||
    webkitRequestAnimationFrame || (window as any).msRequestAnimationFrame;
if (raf) {
  raf(() => window.setTimeout(loadDeferredStyles, 0));
} else {
  window.addEventListener("load", loadDeferredStyles);
}
