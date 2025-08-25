import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { fetchWordData } from "./lib/gemini";
import { loadWords, saveWord, deleteWordById, SavedWord } from "./lib/storage";

type SearchData = {
  vietnamese_meaning: string;
  pronunciation: string;
  example_sentence: string;
};

function SearchTab({
  word,
  setWord,
  handleSearch,
  loading,
  error,
  data,
  handleSave,
  statusMessage,
}: {
  word: string;
  setWord: (v: string) => void;
  handleSearch: () => void;
  loading: boolean;
  error: string | null;
  data: SearchData | null;
  handleSave: () => void;
  statusMessage: string;
}) {
  return (
    <div className="w-full bg-white p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
        Ứng dụng Từ vựng Tiếng Anh
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Tìm kiếm nghĩa, phiên âm và ví dụ trong ngữ cảnh IT & Testing.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Nhập từ vựng tiếng Anh..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-4">
          <svg
            className="animate-spin h-6 w-6 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center border border-red-200">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-gray-50 rounded-xl shadow-inner p-5 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Kết quả:</h2>
          <p className="mb-2">
            <span className="font-semibold">Nghĩa tiếng Việt:</span>{" "}
            {data.vietnamese_meaning}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Phiên âm:</span>{" "}
            {data.pronunciation}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Ví dụ:</span> "
            {data.example_sentence}"
          </p>
          <button
            onClick={handleSave}
            className="mt-4 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
          >
            Lưu từ vựng
          </button>
        </div>
      )}

      {statusMessage && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            statusMessage.includes("thành công")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}

function SavedWordsList({
  words,
  onDelete,
}: {
  words: SavedWord[];
  onDelete: (id: string) => void;
}) {
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = words[index];
    return (
      <div
        style={style}
        className="px-4 py-4 border-b border-gray-200 last:border-b-0 bg-white hover:bg-gray-50"
      >
        {/* Mobile Card Layout */}
        <div className="block md:hidden space-y-2">
          <div className="flex items-start justify-between">
            <div className="text-blue-600 font-semibold text-base break-words flex-1">
              {item.word}
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-700 font-semibold px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 text-sm whitespace-nowrap ml-3"
            >
              Xóa
            </button>
          </div>
          <div className="space-y-1">
            <div className="flex">
              <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">
                Phiên âm:
              </span>
              <span className="text-gray-700 text-sm break-words">
                {item.pronunciation}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">
                Nghĩa:
              </span>
              <span className="text-gray-700 text-sm break-words">
                {item.meaning}
              </span>
            </div>
            <div className="flex">
              <span className="text-gray-600 font-medium text-sm w-20 flex-shrink-0">
                Ví dụ:
              </span>
              <span className="text-gray-600 italic text-sm break-words">
                "{item.example}"
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-5 md:gap-3 md:items-start">
          <div className="text-blue-600 font-medium break-words text-sm leading-relaxed">
            {item.word}
          </div>
          <div className="text-gray-500 break-words text-sm leading-relaxed">
            {item.pronunciation}
          </div>
          <div className="text-gray-700 break-words text-sm leading-relaxed">
            {item.meaning}
          </div>
          <div className="text-gray-600 italic break-words text-sm leading-relaxed">
            "{item.example}"
          </div>
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onDelete(item.id)}
              className="text-red-600 hover:text-red-700 font-semibold px-3 py-1 border border-red-200 rounded-md hover:bg-red-50 text-sm whitespace-nowrap"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (words.length === 0) {
    return (
      <div className="w-full bg-white p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Các Từ Đã Lưu
        </h2>
        <p className="text-center text-gray-500 mt-8">
          Chưa có từ vựng nào được lưu.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="p-6 md:p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Các Từ Đã Lưu ({words.length})
        </h2>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-3 md:font-bold md:text-gray-700 md:bg-gray-100 md:p-4 md:text-sm">
        <div>Từ</div>
        <div>Phiên âm</div>
        <div>Nghĩa</div>
        <div>Ví dụ</div>
        <div></div>
      </div>

      <List
        height={500}
        itemCount={words.length}
        itemSize={150}
        width="100%"
        className="scrollbar-hide"
        overscanCount={3}
      >
        {Row}
      </List>
    </div>
  );
}

export default function App() {
  const [word, setWord] = useState("");
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");

  useEffect(() => {
    setSavedWords(loadWords());
  }, []);

  const handleSearch = async () => {
    if (!word.trim()) {
      setError("Vui lòng nhập một từ tiếng Anh.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetchWordData(word.trim());
      setData(res);
    } catch (e) {
      setError("Có lỗi xảy ra khi tìm kiếm từ vựng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!data || !word) return;
    const next = saveWord({
      word: word.trim(),
      meaning: data.vietnamese_meaning,
      pronunciation: data.pronunciation,
      example: data.example_sentence,
    });
    setSavedWords(next);
    setStatusMessage("Từ vựng đã được lưu thành công!");
    setWord("");
    setData(null);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDelete = (id: string) => {
    const next = deleteWordById(id);
    setSavedWords(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 safe-top">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">EngVocab</h1>
          <span className="text-xs text-gray-500">PWA</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pb-28 pt-4">
        {activeTab === "search" ? (
          <SearchTab
            word={word}
            setWord={setWord}
            handleSearch={handleSearch}
            loading={loading}
            error={error}
            data={data}
            handleSave={handleSave}
            statusMessage={statusMessage}
          />
        ) : (
          <SavedWordsList words={savedWords} onDelete={handleDelete} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-2 px-4 pt-2">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "search"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            aria-label="Tìm kiếm"
          >
            <span>🔎</span>
            <span>Tìm kiếm</span>
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            aria-label="Từ đã lưu"
          >
            <span>📚</span>
            <span>Từ đã lưu ({savedWords.length})</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
