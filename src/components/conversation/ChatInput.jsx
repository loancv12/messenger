import { IconButton, Stack, useTheme } from "@mui/material";
import { Smiley } from "phosphor-react";
import { useDeferredValue, useEffect, useLayoutEffect, useState } from "react";
import throttle from "../../utils/throttle";

const MIN_TEXTAREA_HEIGHT = 49;
const ChatInput = ({ setOpenPicker, textRef }) => {
  const theme = useTheme();
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);

  const adjustTextAreaHeight = (textRef) => {
    // Reset height - important to shrink on delete
    textRef.current.style.height = "inherit";
    // Set height
    textRef.current.style.height = `${Math.max(
      textRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  };

  function submitOnEnter(event) {
    if (event.which === 13) {
      console.log(event);
      if (!event.repeat && event.shiftKey === false) {
        console.log(event.target.closest("form"));
        event.target.closest("form").requestSubmit();
        setValue("");
      }
      if (event.shiftKey === true) {
        setValue((prev) => `${prev}\n`);
      }

      event.preventDefault(); // Prevents the addition of a new line in the text field
    }
  }
  useEffect(() => {
    textRef.current.addEventListener("keydown", submitOnEnter);
  }, []);

  useEffect(() => {
    adjustTextAreaHeight(textRef);
  }, [value]);
  return (
    <Stack
      direction={"row"}
      alignItems={"flex-end"}
      justifyContent={"space-between"}
      spacing={2}
      sx={{ backgroundColor: "rgba(0, 0, 0, 0.06)", borderRadius: 1 }}
    >
      <textarea
        rows={1}
        ref={textRef}
        value={value}
        onChange={onChange}
        placeholder="Write a msg"
        style={{
          width: "100%",
          fontSize: "1rem",
          color: theme.palette.text.primary,
          lineHeight: "23px",
          outline: "none",
          border: "none",
          backgroundColor: "transparent",
          position: "relative",
          padding: "13px 12px",
          overflow: "hidden",
          resize: "none",
        }}
      ></textarea>
      <IconButton
        style={{ marginBottom: "4px" }}
        onClick={(e) => setOpenPicker((prev) => !prev)}
      >
        <Smiley />
      </IconButton>
    </Stack>
  );
};

export default ChatInput;
