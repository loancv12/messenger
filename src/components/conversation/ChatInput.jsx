import { IconButton, Stack, useTheme } from "@mui/material";
import { Smiley } from "phosphor-react";
import { useEffect } from "react";

const ChatInput = ({ setOpenPicker, textRef }) => {
  const theme = useTheme();
  console.log(theme.palette);

  function submitOnEnter(event) {
    if (event.which === 13 && !event.shiftKey) {
      if (!event.repeat && event.shiftKey === false) {
        event.target.closest("form").requestSubmit();
      }
      event.preventDefault(); // Prevents the addition of a new line in the text field
    }
  }
  useEffect(() => {
    textRef.current.focus();
  }, []);

  return (
    <Stack
      direction={"row"}
      alignItems={"flex-end"}
      justifyContent={"space-between"}
      spacing={2}
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : theme.palette.action.focus,
        borderRadius: 1,
      }}
    >
      <div
        ref={textRef}
        onKeyDown={submitOnEnter}
        contentEditable="plaintext-only"
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
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
      ></div>

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
