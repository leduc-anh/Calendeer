import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import localforage from "localforage";

// Async thunk for fetching images from Unsplash
export const fetchUnsplashImages = createAsyncThunk(
  "bg/fetchUnsplashImages",
  async ({ targetPage = 1, customKeyword, unsplashAccessKey }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${unsplashAccessKey}&query=${customKeyword}&orientation=landscape&per_page=8&page=${targetPage}`
      );
      if (!res.ok) throw new Error("Failed to fetch images from Unsplash");
      const data = await res.json();
      return {
        images: data.results || [],
        page: targetPage,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for loading initial data from localforage
export const loadInitialBgData = createAsyncThunk(
  "bg/loadInitialBgData",
  async (_, { rejectWithValue }) => {
    try {
      const [savedKeyword, savedCustomBgs, savedBgUrl] = await Promise.all([
        localforage.getItem("bgKeyword"),
        localforage.getItem("customBgs"),
        localforage.getItem("bgUrl"),
      ]);

      return {
        keyword: savedKeyword || "nature",
        customBgs: savedCustomBgs || [],
        bgUrl: savedBgUrl || null,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  keyword: "nature",
  images: [],
  page: 1,
  loading: false,
  selecting: false,
  customBgs: [],
  uploading: false,
  bgUrl: null,
  error: null,
};

const bgSlice = createSlice({
  name: "bg",
  initialState,
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetPage: (state) => {
      state.page = 1;
    },
    addCustomBg: (state, action) => {
      state.customBgs.push(action.payload);
    },
    removeCustomBg: (state, action) => {
      state.customBgs = state.customBgs.filter((bg) => bg !== action.payload);
    },
    setBgUrl: (state, action) => {
      state.bgUrl = action.payload;
    },
    resetBgUrl: (state) => {
      state.bgUrl = null;
    },
    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
    setSelecting: (state, action) => {
      state.selecting = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnsplashImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnsplashImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload.images;
        state.page = action.payload.page;
      })
      .addCase(fetchUnsplashImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Load Initial Data
    builder
      .addCase(loadInitialBgData.fulfilled, (state, action) => {
        state.keyword = action.payload.keyword;
        state.customBgs = action.payload.customBgs;
        state.bgUrl = action.payload.bgUrl;
      })
      .addCase(loadInitialBgData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setKeyword,
  setPage,
  resetPage,
  addCustomBg,
  removeCustomBg,
  setBgUrl,
  resetBgUrl,
  setUploading,
  setSelecting,
} = bgSlice.actions;

export default bgSlice.reducer;
