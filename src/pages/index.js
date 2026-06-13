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
        <header className="text-center mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Test de Conducir CABA
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Examen teórico de manejo online — practicá gratis las preguntas
            oficiales para las categorías A y B de la Ciudad de Buenos Aires.
          </p>
        </header>
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

export const Head = () => (
  <>
    <html lang="es" />
    <title>Test de Conducir CABA – Examen Teórico de Manejo Online Gratis</title>
    <meta
      name="description"
      content="Simulador gratis del examen teórico para la licencia de conducir de la Ciudad de Buenos Aires (CABA). Practicá las preguntas oficiales y rendí un examen de prueba para las categorías A y B."
    />
    <link rel="canonical" href="https://driver.bogomolov.tech/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Test de Conducir CABA – Examen Teórico Online Gratis" />
    <meta
      property="og:description"
      content="Practicá gratis las preguntas oficiales del examen teórico de manejo de CABA para las categorías A y B."
    />
    <meta property="og:url" content="https://driver.bogomolov.tech/" />
    <meta name="twitter:card" content="summary" />
  </>
);
