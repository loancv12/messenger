const useTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default useTitle;
