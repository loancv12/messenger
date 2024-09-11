export function filterValidFiles(
  files,
  allowFileTypes,
  maxNumberOfFiles,
  maxSize
) {
  console.log(files);
  return Array.from(files).filter((file, i) => {
    const extension = file.name.substring(file.name.lastIndexOf("."));
    const mimeType = file.type;

    const validExt = allowFileTypes.find(
      (allowType) => allowType.extension === extension
    );

    const isValidType =
      validExt && (validExt.mimeType === mimeType || validExt?.notWideSp);

    const isValidSize = file.size <= maxSize;
    // Forgive for this stupid naming, couldn't find a better name
    const isSingleFileAllowed = i <= maxNumberOfFiles;

    return isValidSize && isValidType && isSingleFileAllowed;
  });
}
