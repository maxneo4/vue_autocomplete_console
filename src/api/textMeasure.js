export function textWidth(text, font) {
// re-use canvas object for better performance
const canvas = textWidth.canvas || (textWidth.canvas = document.createElement("canvas"));
const context = canvas.getContext("2d");
context.font = font;
const metrics = context.measureText(text);
return metrics.width;
}

export function textWidthA(text, fontProp)
{
      var tag = document.createElement("span");
      tag.style.position = "absolute";
      tag.style.left = "-999em";
      tag.style.whiteSpace = "nowrap";
      tag.style.font = fontProp;
      tag.innerHTML = text;

      document.body.appendChild(tag);

      var result = tag.clientWidth;

      document.body.removeChild(tag);

      return result;
}
