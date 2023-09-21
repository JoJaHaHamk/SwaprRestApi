import app from "./app";

const PORT: Number = Number(process.env.PORT);

app.listen(PORT, (): void => console.log(`running on port ${PORT}`));