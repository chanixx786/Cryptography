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

  // Playfair Cipher
  document.getElementById("playFairEncrypt").addEventListener("click", () => {
    const text = document.getElementById("playFairText").value;
    const key = document.getElementById("playFairKey").value;

    // Get results and update the page
    const encrypted = encryptPlayfair(text, key);
    const decrypted = decryptPlayfair(encrypted, key);

    document.getElementById("playFairResult").innerText = `${encrypted}`;
    document.getElementById("playFairDecryptResult").innerText = `${decrypted}`;
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
  function makeGrid(k) {
    let letter = new Set();
    let grid = [];
    let temp = [];

    k = k
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");

    for (let x of k) {
      if (!letter.has(x)) {
        letter.add(x);
        temp.push(x);
      }
    }

    for (let i = 65; i <= 90; i++) {
      let x = String.fromCharCode(i);
      if (x != "J" && !letter.has(x)) {
        temp.push(x);
      }
    }

    for (let i = 0; i < 25; i += 5) {
      grid.push(temp.slice(i, i + 5));
    }
    return grid;
  }

  function getSpot(grid, x) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (grid[i][j] == x) {
          return [i, j];
        }
      }
    }
  }

  function makePairs(txt) {
    txt = txt
      .toUpperCase()
      .replace(/J/g, "I")
      .replace(/[^A-Z]/g, "");
    let out = [];

    for (let i = 0; i < txt.length; i += 2) {
      if (i == txt.length - 1) {
        out.push(txt[i] + "X");
      } else if (txt[i] == txt[i + 1]) {
        out.push(txt[i] + "X");
        i--;
      } else {
        out.push(txt[i] + txt[i + 1]);
      }
    }
    return out;
  }

  function encryptPlayfair(txt, k) {
    let grid = makeGrid(k);
    let pairs = makePairs(txt);
    let out = "";

    for (let p of pairs) {
      let [r1, c1] = getSpot(grid, p[0]);
      let [r2, c2] = getSpot(grid, p[1]);

      if (r1 == r2) {
        out += grid[r1][(c1 + 1) % 5] + grid[r2][(c2 + 1) % 5];
      } else if (c1 == c2) {
        out += grid[(r1 + 1) % 5][c1] + grid[(r2 + 1) % 5][c2];
      } else {
        out += grid[r1][c2] + grid[r2][c1];
      }
    }
    return out;
  }

  function decryptPlayfair(txt, k) {
    let grid = makeGrid(k);
    let pairs = [];

    for (let i = 0; i < txt.length; i += 2) {
      pairs.push(txt.slice(i, i + 2));
    }

    let out = "";
    for (let p of pairs) {
      let [r1, c1] = getSpot(grid, p[0]);
      let [r2, c2] = getSpot(grid, p[1]);

      if (r1 == r2) {
        out += grid[r1][(c1 + 4) % 5] + grid[r2][(c2 + 4) % 5];
      } else if (c1 == c2) {
        out += grid[(r1 + 4) % 5][c1] + grid[(r2 + 4) % 5][c2];
      } else {
        out += grid[r1][c2] + grid[r2][c1];
      }
    }
    return out;
  }
});
