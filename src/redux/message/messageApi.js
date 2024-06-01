import { apiAction } from "../mdw/apiMdw";

export const fetchMessages = ({
  type,
  conversationId,
  page,
  onApiStart,
  onApiEnd,
  onSuccess,
  label,
}) =>
  apiAction({
    url: `/message/get-messages/${type}`,
    label,
    data: {
      type,
      conversationId,
      page,
    },
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
