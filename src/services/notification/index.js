async function askNotificationPermission() {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }

  let granted = false;

  if (Notification.permission === "granted") {
    granted = true;
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      granted = permission === "granted" ? true : false;
    });
  }
}
// create and show the notification
export const showNotification = ({
  title = "",
  body = "",
  icon = "",
  vibrate = true,
  tag,
}) => {
  if (Notification?.permission === "granted") {
    // create a new notification
    const notification = new Notification(title, {
      body,
      icon,
      vibrate,
      tag,
    });

    // close the notification after 10 seconds
    // Old versions of Chrome
    setTimeout(() => {
      notification.close();
    }, 5 * 1000);
  }
};

// show an error message
const showError = () => {
  const error = document.querySelector(".error");
  error.style.display = "block";
  error.textContent = "You blocked the notifications";
};

export default askNotificationPermission;
