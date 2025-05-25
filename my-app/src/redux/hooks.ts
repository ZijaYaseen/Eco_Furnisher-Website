// src/redux/hooks.ts

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState, Dispatch } from './store';
import { useDispatch } from 'react-redux';

 // Typed hook for using Redux state

 export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector

//    - *Explanation*: Ye custom hook useSelector ka type-safe version hai, jo tumhare Redux store ke RootState type ko inherit karega.


// 
export const useAppDispatch: () => Dispatch = useDispatch;

// UseDispatch : state ko update krne k liye ,
// useSelector : current state ko get krne k liye