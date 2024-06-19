import { apiAction } from "../mdw/apiMdw";

export const fetchMessages = ({
  data,
  onApiStart,
  onApiEnd,
  onSuccess,
  label,
}) =>
  apiAction({
    url: `/message/get-messages/${data.type}`,
    label,
    data,
    onApiStart,
    onApiEnd,
    onSuccess,
  });

export const uploadFile = (
  formData,
  onSuccess,
  onDownloadProgress,
  onUploadProgress
) =>
  apiAction({
    url: "/message/upload-files",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    onDownloadProgress,
    onUploadProgress,
    onSuccess,
  });
