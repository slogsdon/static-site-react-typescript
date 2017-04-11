interface IClassList {
  [key: string]: string[];
}

const classes: IClassList = {
  ".content a": [
    "black-70",
  ],
  ".content blockquote": [
    "ml3",
    "pl3",
    "bl",
    "b--black-10",
    "bw2",
  ],
  ".content p, .content ul, .content ol": [
    "measure",
  ],
  ".post .content > p:first-of-type": [
    "f4",
  ],
};

for (const selector in classes) {
  if (!classes.hasOwnProperty(selector)) {
    continue;
  }
  const contents = document.querySelectorAll(selector);
  Array.prototype.slice.call(contents)
    .map((el: HTMLElement) => {
      classes[selector]
        .map((c) => el.classList.add(c));
    });
}
