document.addEventListener("DOMContentLoaded", function () {
  // Caesar Cipher
  document.getElementById("encrypt").addEventListener("click", function () {
    const text = document.getElementById("plaintext").value; // Get the text from the input
    const shift = parseInt(document.getElementById("shift").value); // converted to integer

    if (isNaN(shift)) {
      alert("Please enter a valid number for the shift.");
      return;
    }

    const encryptedText = encryptText(text, shift);
    document.getElementById("result").innerText = encryptedText;

    const decryptedText = decryptText(encryptedText, shift);
    document.getElementById("decryptResult").innerText = decryptedText;
  });

  // Monoalphabetic order
  document.getElementById("monoEncrypt").addEventListener("click", function () {
    const cipherAlphabet = "XQJZKFHNCYBGTALDWEVOSIRMPU";
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let monoText = document
      .getElementById("monoalphabetic")
      .value.toUpperCase();

    // Encrypt the text
    let encryptedText = monoEncrypt(monoText, cipherAlphabet, alphabet);
    document.getElementById("monoResult").innerText = encryptedText;

    // Decrypt the text
    let decryptedText = monoDecrypt(encryptedText, cipherAlphabet, alphabet);
    document.getElementById("monoDecryptResult").innerText = decryptedText;
  });

  // Handle the encryption button click
  document.getElementById("playFairEncrypt").addEventListener("click", () => {
    const text = document.getElementById("playFairText").value;
    const key = document.getElementById("playFairKey").value;

    // Get results and update the page
    const encrypted = encryptPlayfair(text, key);
    const decrypted = decryptPlayfair(encrypted, key);

    document.getElementById(
      "playFairResult"
    ).innerText = `${encrypted}`;
    document.getElementById(
      "playFairDecryptResult"
    ).innerText = `${decrypted}`;
  });


// Caesar Cipher encryption function
function encryptText(text, shift) {
    return text
      .toUpperCase() // text to uppercase
      .split("") // Split the text into an array of characters
      .map((char) => {
        if (char.match(/[A-Z]/)) {
          // Check if it's a letter
          let code = char.charCodeAt(0); // ASCII value of the character
          let base = 65; //  base is 65 since the text is converted into upperCase
          return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
      })
      .join("");
  }

  function decryptText(encryptedText, shift) {
    return encryptedText
      .toUpperCase() // text to uppercase
      .split("") // Split the text into an array of characters
      .map((char) => {
        if (char.match(/[A-Z]/)) {
          // Check if it's a letter
          let code = char.charCodeAt(0); // ASCII value of the character
          let base = 65; //  base is 65 since the text is converted into upperCase
          return String.fromCharCode(((code + base - shift) % 26) + base);
        }
        return char;
      })
      .join("");
  }

  // MonoAlphabetic Cipher
   // Encryption function
   function monoEncrypt(monoText, cipherAlphabet, alphabet) {
    let encryptedText = "";

    // Loop through each character of the input text
    for (let i = 0; i < monoText.length; i++) {
      let char = monoText[i];

      if (alphabet.includes(char)) {
        let index = alphabet.indexOf(char); // Find the index in the standard alphabet
        encryptedText += cipherAlphabet[index];
      } else {
        encryptedText += char;
      }
    }
    return encryptedText;
  }

  // Decryption function
  function monoDecrypt(encryptedText, cipherAlphabet, alphabet) {
    let decryptedText = "";

    // Loop through each character of the encrypted text
    for (let i = 0; i < encryptedText.length; i++) {
      let char = encryptedText[i];

      if (cipherAlphabet.includes(char)) {
        let index = cipherAlphabet.indexOf(char); // Find the index in the cipher alphabet
        decryptedText += alphabet[index];
      } else {
        decryptedText += char;
      }
    }
    return decryptedText;
  }


  // Playfair Cipher
  // Set up the key matrix
  function makeKeyMatrix(key) {
    let used = new Set();
    let matrix = [];
    let flat = [];

    // Clean up the key first
    key = key
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");

    // Add key chars first 
    for (let char of key) {
      if (!used.has(char)) {
        used.add(char);
        flat.push(char);
      }
    }

    // Fill in unused letters
    for (let c = 65; c <= 90; c++) {
      let char = String.fromCharCode(c);
      if (char === "J") continue;
      if (!used.has(char)) {
        flat.push(char);
      }
    }

    // Make a 5x5 grid
    for (let i = 0; i < 25; i += 5) {
      matrix.push(flat.slice(i, i + 5));
    }
    return matrix;
  }

  // Find letter position in matrix
  function findChar(matrix, char) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return [i, j];
        }
      }
    }
  }

  // splitting into pairs
  function prepareText(text) {
    text = text
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");
    let pairs = [];

    for (let i = 0; i < text.length; i += 2) {
      if (i === text.length - 1) {
        pairs.push(text[i] + "X");
      } else if (text[i] === text[i + 1]) {
        pairs.push(text[i] + "X");
        i--;
      } else {
        pairs.push(text[i] + text[i + 1]);
      }
    }
    return pairs;
  }

  function encryptPlayfair(text, key) {
    let matrix = makeKeyMatrix(key);
    let pairs = prepareText(text);
    let result = "";

    pairs.forEach((pair) => {
      let [r1, c1] = findChar(matrix, pair[0]);
      let [r2, c2] = findChar(matrix, pair[1]);

      if (r1 === r2) {
        // Same row - move right
        result += matrix[r1][(c1 + 1) % 5];
        result += matrix[r2][(c2 + 1) % 5];
      } else if (c1 === c2) {
        // Same column - move down
        result += matrix[(r1 + 1) % 5][c1];
        result += matrix[(r2 + 1) % 5][c2];
      } else {
        // Rectangle - swap columns
        result += matrix[r1][c2];
        result += matrix[r2][c1];
      }
    });

    return result;
  }

  function decryptPlayfair(text, key) {
    let matrix = makeKeyMatrix(key);
    let pairs = [];

    // Split into pairs
    for (let i = 0; i < text.length; i += 2) {
      pairs.push(text.substr(i, 2));
    }

    let result = "";
    pairs.forEach((pair) => {
      let [r1, c1] = findChar(matrix, pair[0]);
      let [r2, c2] = findChar(matrix, pair[1]);

      if (r1 === r2) {
        // Same row - move left
        result += matrix[r1][(c1 + 4) % 5];
        result += matrix[r2][(c2 + 4) % 5];
      } else if (c1 === c2) {
        // Same column - move up
        result += matrix[(r1 + 4) % 5][c1];
        result += matrix[(r2 + 4) % 5][c2];
      } else {
        // Rectangle - swap columns
        result += matrix[r1][c2];
        result += matrix[r2][c1];
      }
    });

    return result;
  }
});
