import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rankingsService from '../../lib/api/services/rankingsService';

// Types
export interface UserRanking {
  id: number | string;
  name: string;
  avatar: string;
  score: number;
  netProfitLoss: number;
  rank?: number;
}

export interface RankingsState {
  topPlayers: UserRanking[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: RankingsState = {
  topPlayers: [],
  loading: false,
  error: null
};

// Async thunk
export const fetchTopPlayers = createAsyncThunk(
  'rankings/fetchTopPlayers',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      console.log(`[Redux] Fetching top ${limit} players...`);
      const response = await rankingsService.getTopPlayers(limit);
      
      // Check response structure 
      console.log('[Redux] Rankings API response:', response);
      
      // Handle different response formats
      let players: UserRanking[] = [];
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        players = response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data object (API standard format)
        players = response.data.data;
      } else {
        // Handle unexpected format
        console.error('[Redux] Unexpected rankings response format:', response);
        return rejectWithValue('Invalid response format from rankings API');
      }
      
      console.log(`[Redux] Successfully fetched ${players.length} top players`);
      return players;
    } catch (error: any) {
      console.error('[Redux] Error fetching top players:', error);
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch top players');
    }
  }
);

const rankingsSlice = createSlice({
  name: 'rankings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopPlayers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.topPlayers = action.payload;
      })
      .addCase(fetchTopPlayers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rankingsSlice.reducer; 