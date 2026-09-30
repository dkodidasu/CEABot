const fetch = require("node-fetch");
const mammoth = require("mammoth");
const textract = require("textract");

/**
 * Downloads a file from a given URL and extracts its text content
 * @param {string} url - The URL to download the file from
 * @returns {Promise<string>} - The extracted text content or error message
 */
async function downloadAndExtractText(url) {
  try {
    console.log("Downloading file from URL:", url);

    // Set up headers
    const headers = {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "max-age=0",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
    };

    const response = await fetch(url, {
      headers,
      redirect: "follow",
    });

    if (!response.ok) {
      return `Error: Failed to download file. HTTP ${response.status} - ${response.statusText}`;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`Downloaded ${buffer.length} bytes`);

    // Check file signature to determine format
    const fileSignature = buffer.slice(0, 4).toString("hex");
    console.log("File signature:", fileSignature);

    if (fileSignature === "504b0304") {
      // Modern DOCX format
      console.log("Detected: Modern DOCX format");
      try {
        const { value: text } = await mammoth.extractRawText({ buffer });
        const extractedText = text.trim();
        if (extractedText) {
          return extractedText.length > 1000
            ? extractedText.substring(0, 1000) + "..."
            : extractedText;
        }
        return "No readable text found in the document.";
      } catch (mammothError) {
        console.error("Mammoth extraction failed:", mammothError.message);
        return "Error: Unable to extract text from DOCX file. The document might be corrupted or password-protected.";
      }
    } else if (fileSignature === "d0cf11e0") {
      // Legacy DOC format
      console.log("Detected: Legacy DOC format (Office 97-2003)");
      return await extractWithTextract(buffer);
    } else {
      // Unknown format, try mammoth anyway
      console.log("Unknown file format, attempting text extraction...");
      try {
        const { value: text } = await mammoth.extractRawText({ buffer });
        const extractedText = text.trim();
        if (extractedText) {
          return extractedText.length > 1000
            ? extractedText.substring(0, 1000) + "..."
            : extractedText;
        } else {
          // If mammoth fails, try textract as fallback
          return await extractWithTextract(buffer);
        }
      } catch (error) {
        return await extractWithTextract(buffer);
      }
    }
  } catch (error) {
    console.error("Error in downloadAndExtractText:", error.message);
    return `Error: Failed to process file - ${error.message}`;
  }
}

/**
 * Extracts text using textract library (for legacy formats)
 * @param {Buffer} buffer - File buffer
 * @returns {Promise<string>} - Extracted text or error message
 */
async function extractWithTextract(buffer) {
  return new Promise((resolve) => {
    // Create a temporary file path
    const fs = require("fs");
    const path = require("path");
    const tempPath = path.join(__dirname, `temp_${Date.now()}.doc`);

    try {
      // Write buffer to temporary file
      fs.writeFileSync(tempPath, buffer);

      textract.fromFileWithPath(tempPath, (error, text) => {
        // Clean up temporary file
        try {
          fs.unlinkSync(tempPath);
        } catch (cleanupError) {
          console.error("Failed to clean up temp file:", cleanupError.message);
        }

        if (error) {
          console.error("Textract extraction failed:", error.message);
          resolve(
            "Error: Unable to extract text from document. The file might be sensitive, password-protected, corrupted, or in an unsupported format."
          );
        } else {
          const extractedText = text.trim();
          if (extractedText) {
            resolve(
              extractedText.length > 1000
                ? extractedText.substring(0, 1000) + "..."
                : extractedText
            );
          } else {
            resolve("No readable text found in the document.");
          }
        }
      });
    } catch (fileError) {
      console.error("File operation failed:", fileError.message);
      resolve("Error: Unable to process document file.");
    }
  });
}

module.exports = {
  downloadAndExtractText,
};
