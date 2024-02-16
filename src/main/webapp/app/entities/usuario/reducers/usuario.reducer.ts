// import { EntityState, IQueryParams, createEntitySlice } from 'app/shared/reducers/reducer.utils';
// import { IUser } from '../../../shared/model/user.model';
// import { IUsuario } from '../../../shared/model/usuario.model';
// import { createAsyncThunk, isFulfilled } from '@reduxjs/toolkit';
// import axios from 'axios';

// const apiUrl = 'usuarios';

// // Initial State
// const initialState: EntityState<IUsuario> = {
//     entities: [],
//     entity: null,
//     errorMessage: null,
//     loading: false,
//     updateSuccess: false,
//     updating: false,
//     links: null,
//     totalItems: 0,
// };

// export const list = createAsyncThunk('usuario', async ({ page, query, size, sort}: IQueryParams) => {
//     const params: Array<string> = [];

//     if (page) {
//         params.push(`page=${page}`);
//     }

//     if (size) {
//         params.push(`size=${size}`);
//     }

//     if (sort) {
//         params.push(`sort=${sort}`);
//     }

//     const queryParams: string = params.join('&');

//     const url: string = `${apiUrl}${queryParams ? `?${queryParams}` : ''}`;

//     return axios.get<Array<Object>>(url, {data: {}, params: {}});
// });

// const RncSlice = createEntitySlice({
//     name: 'usuario',
//     initialState,
//     extraReducers(builder) {
//         builder
//             .addMatcher(isFulfilled(list), (state, action) => {
//                 const { data, headers } = action.payload;

//                 return {
//                     ...state,
//                     loading: false,
//                     entities: data,
//                     totalItems: parseInt(headers['x-total-count'], 10),
//                 };
//             })
//     }
// });

// export const { reset } = RncSlice.actions;
// export default RncSlice.reducer;
