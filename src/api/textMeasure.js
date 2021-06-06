export function textWidth(text, fontProp)
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
