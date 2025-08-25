export type SavedWord = {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  timestamp: number;
};

const STORAGE_KEY = "eng_vocab_words_v1";

export function loadWords(): SavedWord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: SavedWord[] = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.sort((a, b) => b.timestamp - a.timestamp)
      : [];
  } catch {
    return [];
  }
}

export function saveWord(
  word: Omit<SavedWord, "id" | "timestamp">
): SavedWord[] {
  const current = loadWords();
  const newItem: SavedWord = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...word,
  };
  const next = [newItem, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearAll(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteWordById(id: string): SavedWord[] {
  const current = loadWords();
  const next = current.filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
