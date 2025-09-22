// Convert normal text to binary
function convertToBinary() {
  const text = document.getElementById('textInput').value;
  let binary = '';

  for (let i = 0; i < text.length; i++) {
    binary += text[i].charCodeAt(0).toString(2).padStart(8, '0') + ' ';
  }

  document.getElementById('output').textContent = binary.trim();
}

// Convert binary (space-separated) back to text
function convertToText() {
  const binaryInput = document.getElementById('textInput').value.trim();
  const binaryArray = binaryInput.split(/\s+/); // Split by spaces

  let text = '';
  for (let bin of binaryArray) {
    if (/^[01]+$/.test(bin)) { // Ensure only valid binary
      text += String.fromCharCode(parseInt(bin, 2));
    } else {
      text += '?'; // Show ? if invalid
    }
  }

  document.getElementById('output').textContent = text;
}
