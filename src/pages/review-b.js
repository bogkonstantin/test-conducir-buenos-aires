import * as React from "react"
import ModeWrapper, { makeHead } from "../components/ModeWrapper";

const Page = () => <ModeWrapper mode="review" category="B" />;

export default Page
export const Head = makeHead("review", "B");
