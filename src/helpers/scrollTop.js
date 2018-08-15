export default function scrollTop(element) {
  if (window && window.requestAnimationFrame) {
    window.requestAnimationFrame(() => {
      element.scrollTop = 0;
    });
  }
}
