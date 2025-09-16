export const insertAfter = (el, referenceNode) => {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
};

export const insertBefore = (el, referenceNode) => {
  referenceNode.parentNode.insertBefore(el, referenceNode);
};

export const insertInside = (el, referenceNode) => {
  referenceNode.parentNode.appendChild(el);
};
