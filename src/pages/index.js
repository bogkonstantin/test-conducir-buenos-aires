import * as React from "react";
import Container from "../components/Container";
import { getStateFromStorage, saveStateToStorage } from "../lib/onboard-state";
import LanguageSelector from "../components/onboard/LanguageSelector";
import CategorySelector from "../components/onboard/CategorySelector";
import Dashboard from "../components/dashboard/Dashboard";
import { track } from "../lib/analytics";

const STATE_LANGUAGE_SELECTION = 'language_selection';
const STATE_CATEGORY_SELECTION = 'category_selection';
const STATE_ONBOARDING_COMPLETED = 'onboarding_completed';

const IndexPage = () => {
  const [state, setState] = React.useState(STATE_LANGUAGE_SELECTION);

  const initialState = typeof window !== "undefined" ? getStateFromStorage() || STATE_LANGUAGE_SELECTION : STATE_LANGUAGE_SELECTION;

  React.useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const handleLanguageSelected = (language) => {
    setState(STATE_CATEGORY_SELECTION);
    saveStateToStorage(STATE_CATEGORY_SELECTION);
    track('onboarding_language_selected', { language });
  };

  const handleCategorySelected = (category) => {
    setState(STATE_ONBOARDING_COMPLETED);
    saveStateToStorage(STATE_ONBOARDING_COMPLETED);
    track('onboarding_completed', { category });
  }

  if (state === STATE_LANGUAGE_SELECTION) {
    return (
      <Container>
        <LanguageSelector onSelect={handleLanguageSelected} />
      </Container>
    );
  }

  if (state === STATE_CATEGORY_SELECTION) {
    return (
      <Container>
        <CategorySelector onSelect={handleCategorySelected} />
      </Container>
    );
  }

  return (
    <Container>
      <Dashboard />
    </Container>
  );
};

export default IndexPage;
export const Head = () => <title>Choose Test Category</title>;
