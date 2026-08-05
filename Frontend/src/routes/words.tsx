import { createFileRoute } from "@tanstack/react-router";
import { DictionaryPage } from "./dictionary";

export const Route = createFileRoute("/words")({
  head: () => ({
    meta: [
      { title: "Words — BOLA Marathi" },
      { name: "description", content: "Search Marathi words with pronunciation, examples, Hindi translations, and bookmarks." },
      { property: "og:title", content: "Marathi Words & Vocabulary" },
      { property: "og:description", content: "Search, listen, and save Marathi words with examples." },
    ],
  }),
  component: DictionaryPage,
});
