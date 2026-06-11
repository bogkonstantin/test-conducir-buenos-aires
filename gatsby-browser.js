import "./src/styles/global.css"
import { runMigrations } from "./src/lib/migrate"

export const onClientEntry = () => {
    runMigrations()
}
