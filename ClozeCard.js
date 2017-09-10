var fs = require("fs");

module.exports = ClozeFlashcard;

function ClozeFlashcard(fullText, blank) {
  this.fullText = fullText;
  this.blank = blank;
  this.clozeDeleted = this.fullText.replace(this.blank, '...');
  this.create = function() {
    var data = {
      text: this.fullText,
      cloze: this.blank,
      clozeDeleted: this.clozeDeleted,
      type: "cloze"
    };
    fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
      if (error) {
        console.log(error);
      }
    });
  };
}
