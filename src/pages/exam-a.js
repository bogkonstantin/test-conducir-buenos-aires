import * as React from "react"
import ModeWrapper, { makeHead } from "../components/ModeWrapper";

const Page = () => <ModeWrapper mode="exam" category="A" />;

export default Page
export const Head = makeHead("exam", "A");
