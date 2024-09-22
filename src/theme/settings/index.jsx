import ThemeColorPresets from "./ThemeColorPresets";
import ThemeLocalization from "./ThemeLocalization";
import ThemeRtlLayout from "./ThemeRtlLayout";

export default function ThemeSettings({ children }) {
  return (
    <ThemeColorPresets>
      <ThemeLocalization>
        <ThemeRtlLayout>{children}</ThemeRtlLayout>
      </ThemeLocalization>
    </ThemeColorPresets>
  );
}
