import { createSlice } from "@reduxjs/toolkit";

// Redux slice for managing wishlist items in the store
const initialState = {
  items: [], // Wishlist items: [{ id, name, size, color, price, image }]
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Add product to wishlist only if not already present (by id + size + color)
    addToWishlist(state, action) {
      const newItem = action.payload;
      const exists = state.items.find(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (!exists) {
        state.items.push(newItem);
      }
    },

    // Remove item from wishlist by unique id, size, and color
    removeFromWishlist(state, action) {
      const { id, size, color } = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.id !== id || item.size !== size || item.color !== color
      );
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
