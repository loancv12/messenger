import { faker } from "@faker-js/faker";

const SHARED_LINKS = [
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.urlLoremFlickr({ category: "cats" }),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.urlLoremFlickr({ category: "cats" }),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.urlLoremFlickr({ category: "cats" }),
    message: "Yep, I can also do that",
    incoming: true,
    outgoing: false,
  },
];
const SHARED_DOCS = [
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
];

export { SHARED_LINKS, SHARED_DOCS };
