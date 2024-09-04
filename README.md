# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

  // check seen msg in here, not socket provider 'cause this component reflect accurately current cvsId
  // the curr user is seeing on
  // incase of sentSuccess, when to user(msg.from!==userId) receive msg via listen event 'new_messages'
  // it will emit a event to every on that msg was sent successfully, then msg was updated in db
  // problem here is it not ensure that every one (in that case, this is socket) in cvs
  // that msg was went to every socket
  // is msg was updated but not sure that everyone receive it???
  // the key that help to make every thing ok is that when a user emit event to every that msg sent successful
  // it only delete persist msg that only belong to the clientID (you can understand it as the tab)
  // Which belong to a user (a user can open many tab, and we mark each tab as clientId)
  // so when the user that temporary missed the msgs because of disconnect ..., it will receive the persist msg when it connect again
  // but the problem is the number of persist msg can be very large when a group have much user
  // so i only persist msg when direct chat
  // i can persist when group chat, but i not do it
  // 'cause i still not sure this is the OK way to check every client(tab)
  // receive the msg
  // i try the acknowledge of socket api, but it not work as expected
  // i dont know that i overthinking or not :<<
