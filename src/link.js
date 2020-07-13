exports.link = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.REACT_APP_API_URL;
  } else {
    return "http://localhost:1337";
  }
};
