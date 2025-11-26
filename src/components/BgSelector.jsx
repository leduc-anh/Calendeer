import { useState, useEffect, useRef } from "react";
import { Loader2, Trash2, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import localforage from "localforage";
import { toast } from "react-toastify";
import _ from "lodash";

export default function BgSelector({
  onSelect,
  onClose,
  onReset,
  unsplashAccessKey,
}) {
  const [keyword, setKeyword] = useState("nature");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [customBgs, setCustomBgs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchImages = async (targetPage = 1, customKeyword = keyword) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${unsplashAccessKey}&query=${customKeyword}&orientation=landscape&per_page=8&page=${targetPage}`
      );
      if (!res.ok) throw new Error("Failed to fetch images from Unsplash");
      const data = await res.json();
      setImages(data.results || []);
    } catch (err) {
      console.error(err);
      toast.error("Could not fetch images.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (_.isEmpty(_.trim(keyword))) return;
    setPage(1);
    fetchImages(1, keyword);
    await localforage.setItem("bgKeyword", keyword);
  };

  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchImages(nextPage, keyword);
  };

  useEffect(() => {
    (async () => {
      const savedKeyword = await localforage.getItem("bgKeyword");
      const savedCustomBgs = await localforage.getItem("customBgs");
      if (savedCustomBgs) setCustomBgs(savedCustomBgs);

      if (savedKeyword) {
        setKeyword(savedKeyword);
        fetchImages(1, savedKeyword);
      } else {
        fetchImages(1, "nature");
      }
    })();
  }, []);

  const handleSelect = async (url) => {
    setSelecting(true);
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      onSelect(url);
      await localforage.setItem("bgUrl", url);
      setSelecting(false);
      toast.success("Background changed successfully!");
    };
    img.onerror = () => {
      setSelecting(false);
      toast.error("Failed to load image.");
    };
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result;
      const updated = [...customBgs, base64Url];
      setCustomBgs(updated);
      await localforage.setItem("customBgs", updated);
      onSelect(base64Url);
      setUploading(false);
      toast.success("Custom background uploaded!");
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCustomBg = async (url) => {
    const updated = _.filter(customBgs, (bg) => bg !== url);
    setCustomBgs(updated);
    await localforage.setItem("customBgs", updated);
    if (updated.length === 0) {
      onReset();
    }
    toast.success("Custom background removed.");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Choose Background
        </h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-shrink-0">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search on Unsplash..."
          className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
        >
          Search
        </button>
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-semibold"
        >
          {uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Upload size={18} />
          )}
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="overflow-y-auto">
        {_.size(customBgs) > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 dark:text-gray-300 text-gray-700">
              Your Backgrounds
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {_.map(customBgs, (bg, i) => (
                <div
                  key={i}
                  className="relative w-full h-32 group cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => handleSelect(bg)}
                >
                  <img
                    src={bg}
                    alt="Custom background"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomBg(bg);
                      }}
                      className="p-2 bg-red-600 cursor-pointer text-white rounded-full hover:bg-red-700 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-sm font-semibold mb-3 dark:text-gray-300 text-gray-700">
          From Unsplash
        </h3>
        {loading && (
          <div className="flex justify-center items-center py-6 text-blue-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading images...
          </div>
        )}
        {selecting && (
          <div className="flex justify-center items-center py-4 text-blue-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Applying background...
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <AnimatePresence>
            {_.map(images, (img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => handleSelect(img.urls.regular)}
              >
                <img
                  src={img.urls.small}
                  alt={img.alt_description || "Unsplash"}
                  className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition">
                  Select
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {!_.isEmpty(images) && !loading && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-4 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
