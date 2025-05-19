import { createSlice } from "@reduxjs/toolkit";

// Redux slice to manage cart state including items, quantities, and total price
const initialState = {
  items: [], // Each item: { id, name, size, color, price, quantity, image, totalPrice }
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add a product to the cart or update quantity if already exists
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === newItem.id &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({
          ...newItem,
          totalPrice: newItem.price * newItem.quantity,
        });
      }

      updateTotals(state);
    },

    // Update quantity for a specific product variation
    updateQuantity(state, action) {
      const [id, size, color, quantity] = action.payload;
      const item = state.items.find(
        (item) => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.price * quantity;

        // Remove item if quantity becomes zero or less
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.id !== id || i.size !== size || i.color !== color
          );
        }
      }

      updateTotals(state);
    },

    // Remove an item from the cart by ID, size, and color
    removeFromCart(state, action) {
      const [id, size, color] = action.payload;
      state.items = state.items.filter(
        (item) => item.id !== id || item.size !== size || item.color !== color
      );

      updateTotals(state);
    },

    // Clear the entire cart
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

// Utility to recalculate total quantity and price
const updateTotals = (state) => {
  state.totalQuantity = state.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  state.totalPrice = state.items.reduce(
    (acc, item) => acc + item.totalPrice,
    0
  );
};

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
