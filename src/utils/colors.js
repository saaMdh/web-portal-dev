import colors from "vuetify/lib/util/colors";
import camelCase from "lodash/camelCase";

export function colorNameToHex(colorName, shade = "base") {
  if (colorName && colorName[0] === "#") return colorName;

  colorName = camelCase(colorName);

  if (colorName === "black") return "#000000";
  if (colorName === "white") return "#FFFFFF";
  if (colorName in colors) return colors[colorName][shade];
  return colorName;
}

/**
 *
 * @param {String} colorHex The hexadecimal color in string format
 * @param {Number} alpha the alpha value between [0-1]
 */
export function colorToCssRgba(color) {
  if (color[0] !== "#") color = colorNameToHex(color);

  const rgb = getRGB(color);

  if (rgb.a !== null) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`;
  else return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function colorToHex(color) {
  if (!color) return;
  const rgb = getRGB(color);
  let r = (+rgb.r).toString(16),
    g = (+rgb.g).toString(16),
    b = (+rgb.b).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

function getBrightness(rgb) {
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

function getRGB(color) {
  if (!color) return false;
  let r,
    g,
    b,
    a = null;
  if (color.length > 0 && color.slice(0, 1) === "#") {
    if (color.length === 4) {
      r = parseInt(color.slice(1, 2) + "" + color.slice(1, 2), 16);
      g = parseInt(color.slice(2, 3) + "" + color.slice(2, 3), 16);
      b = parseInt(color.slice(3, 4) + "" + color.slice(3, 4), 16);
    } else if (color.length === 7) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.length === 9) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
      a = parseFloat((parseInt(color.slice(7, 9), 16) / 255).toFixed(3));
    }
    return { r, g, b, a };
  }
  return false;
}
export function isDark(color) {
  let rgb = getRGB(color);
  if (rgb) {
    let brightness = getBrightness(rgb);
    if (rgb.a) return brightness < 128 && rgb.a >= 0.5;
    else return brightness < 128;
  } else return false;
}

export function removeBackground(backgroundId) {
  var styleElements = document.querySelectorAll("style");

  styleElements.forEach(function (styleElement) {
    if (styleElement.textContent.includes(backgroundId)) styleElement.remove();
  });
}
