import { Action } from '../actions/tournaments';
import { Tournaments } from '../types';

const initialState: Tournaments = {
  status: 'pending',
  filter: '',
  tournaments: [],
};

export default function tournaments(
  state: Tournaments = initialState,
  action: Action
) {
  switch (action.type) {
    case 'tournaments/fetchStarted':
      return { ...state, status: 'pending' };
    case 'tournaments/fetchSucceeded':
      return { ...state, status: 'fulfilled', tournaments: action.payload };
    case 'tournaments/fetchFailed':
      return { ...state, status: 'rejected' };
    case 'tournaments/changeFilter':
      return { ...state, filter: action.payload };
    case 'tournaments/createSucceeded':
      return { ...state, tournaments: [action.payload, ...state.tournaments] };
    case 'tournaments/updateSucceeded':
      return {
        ...state,
        tournaments: state.tournaments.map((tournament) =>
          tournament.id === action.payload.id ? action.payload : tournament
        ),
      };
    case 'tournaments/deleteSucceeded':
      return {
        ...state,
        tournaments: state.tournaments.filter(
          (tournament) => tournament.id !== action.payload
        ),
      };
  }
  return state;
}
