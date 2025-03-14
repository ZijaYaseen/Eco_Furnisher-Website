// src/redux/hooks.ts

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from './store';
import { useDispatch } from 'react-redux';
import type { Dispatch } from '@/redux/store';

 // Typed hook for using Redux state

 export const UseAppSelector : TypedUseSelectorHook<RootState> = useSelector

//    - *Explanation*: Ye custom hook useSelector ka type-safe version hai, jo tumhare Redux store ke RootState type ko inherit karega.


// 
export const UseAppDispatch: () => Dispatch = useDispatch;

// UseDispatch : state ko update krne k liye ,
// useSelector : current state ko get krne k liye