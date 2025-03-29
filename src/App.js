import "./styles.css";
import TranslateSharpIcon from "@mui/icons-material/TranslateSharp";
import Translator from "./Translator";

export default function App() {
  return (
    <div className="App">
      <div className="header">
        <TranslateSharpIcon />
        Language-Translator
      </div>
      <Translator />
    </div>
  );
}
