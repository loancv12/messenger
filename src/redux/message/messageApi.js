import { apiAction } from "../../utils/apiAction";

export const fetchMessages = (data, onSuccess) =>
  apiAction({
    url: `/message/get-messages/${data.type}`,
    data,
    onSuccess,
  });

export const uploadFile = (formData, onSuccess, onFailure) =>
  apiAction({
    url: "/message/upload-files",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
    onSuccess,
    onFailure,
  });
