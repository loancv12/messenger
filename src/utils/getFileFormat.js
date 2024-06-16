const FORMAT_IMG = ["jpg", "jpeg", "gif", "bmp", "png"];
const FORMAT_VIDEO = ["m4v", "avi", "mpg", "mp4", "webm"];
const FORMAT_WORD = ["doc", "docx"];
const FORMAT_EXCEL = ["xls", "xlsx"];
const FORMAT_POWERPOINT = ["ppt", "pptx"];
const FORMAT_PDF = ["pdf"];
const FORMAT_PHOTOSHOP = ["psd"];
const FORMAT_ILLUSTRATOR = ["ai", "esp"];

export function getFileType(fileUrl = "") {
  return (fileUrl && fileUrl.split(".").pop()) || "";
}

export function getFileName(fileUrl) {
  return fileUrl
    .substring(fileUrl.lastIndexOf("/") + 1)
    .replace(/\.[^/.]+$/, "");
}

export function getFileFullName(fileUrl) {
  return fileUrl.split("/").pop();
}

export function getFileFormat(fileUrl) {
  let format;

  switch (fileUrl.includes(getFileType(fileUrl))) {
    case FORMAT_IMG.includes(getFileType(fileUrl)):
      format = "image";
      break;
    case FORMAT_VIDEO.includes(getFileType(fileUrl)):
      format = "video";
      break;
    case FORMAT_WORD.includes(getFileType(fileUrl)):
      format = "word";
      break;
    case FORMAT_EXCEL.includes(getFileType(fileUrl)):
      format = "excel";
      break;
    case FORMAT_POWERPOINT.includes(getFileType(fileUrl)):
      format = "powerpoint";
      break;
    case FORMAT_PDF.includes(getFileType(fileUrl)):
      format = "pdf";
      break;
    case FORMAT_PHOTOSHOP.includes(getFileType(fileUrl)):
      format = "photoshop";
      break;
    case FORMAT_ILLUSTRATOR.includes(getFileType(fileUrl)):
      format = "illustrator";
      break;
    default:
      format = getFileType(fileUrl);
  }

  return format;
}
