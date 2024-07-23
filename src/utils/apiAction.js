export function apiAction({
  url = "",
  method = "GET",
  headers,
  data = null,
  onUploadProgress = () => {},
  onDownloadProgress = () => {},
  onSuccess = () => {},
  onFailure = () => {},
  transformResponse = [
    function (data) {
      // Do whatever you want to transform the data

      return data;
    },
  ],
}) {
  return {
    url,
    method,
    headers,
    data,
    onSuccess,
    onFailure,
    onUploadProgress,
    onDownloadProgress,
    transformResponse,
  };
}
