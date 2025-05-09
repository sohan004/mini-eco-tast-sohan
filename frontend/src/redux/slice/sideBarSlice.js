import { createSlice } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
    name: "sideBar",
    initialState: false,
    reducers: {
        toggleSideBar: (state, action) => {
            return action.payload;
        }
    },
})

export const { toggleSideBar } = sideBarSlice.actions;
export default sideBarSlice.reducer;