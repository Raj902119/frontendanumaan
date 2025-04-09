import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { AxiosError } from 'axios';

interface Event {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  participants: string[];
  odds: Record<string, number>;
  marketVolume: number;
  isHot: boolean;
  isPopular: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface EventsState {
  events: Event[];
  featuredEvents: Event[];
  popularEvents: Event[];
  eventById: Event | null;
  categories: Category[];
  currentCategory: string | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredEvents: Event[];
}

const initialState: EventsState = {
  events: [],
  featuredEvents: [],
  popularEvents: [],
  eventById: null,
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  searchQuery: '',
  filteredEvents: []
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/events');
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/events/${eventId}`);
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch event details');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/v1/events/categories');
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchEventsByCategory = createAsyncThunk(
  'events/fetchEventsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/events/category/${category}`);
      return {
        category,
        events: response.data.data
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data || 'Failed to fetch events by category');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      // Filter events based on search query
      if (action.payload) {
        state.filteredEvents = state.events.filter(event => 
          event.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          event.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      } else {
        state.filteredEvents = [];
      }
    },
    clearEventById: (state) => {
      state.eventById = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        // Set popular and featured events
        state.popularEvents = action.payload.filter((event: Event) => event.isPopular);
        state.featuredEvents = action.payload.filter((event: Event) => event.isHot);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.eventById = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEventsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload.category;
        state.filteredEvents = action.payload.events;
      })
      .addCase(fetchEventsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSearchQuery, clearEventById } = eventsSlice.actions;
export default eventsSlice.reducer; 