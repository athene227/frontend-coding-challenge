import { RootGetState, RootState, RootThunkDispatch } from '../store';

import { API_TOURNAMENTS_URL } from '../constants/api';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { Tournament } from '../types';

export type Thunk = ThunkAction<void, RootState, unknown, AnyAction>;

const fetchTournamentsStarted = () => ({
  type: 'tournaments/fetchStarted' as const,
});

const fetchTournamentsSuccess = (tournaments: Tournament[]) => ({
  type: 'tournaments/fetchSucceeded' as const,
  payload: tournaments,
});

const fetchTournamentsFailed = (error: unknown) => ({
  type: 'tournaments/fetchFailed' as const,
  error,
});

const fetchTournaments =
  (): Thunk => async (dispatch: RootThunkDispatch, getState: RootGetState) => {
    dispatch(fetchTournamentsStarted());

    try {
      const filter = getState().tournaments.filter;
      const url = filter
        ? `${API_TOURNAMENTS_URL}?q=${filter}`
        : API_TOURNAMENTS_URL;
      const response = await fetch(url);
      const tournaments = await response.json();
      dispatch(fetchTournamentsSuccess(tournaments));
    } catch (error) {
      dispatch(fetchTournamentsFailed(error));
    }
  };

const createTournamentSuccess = (tournament: Tournament) => ({
  type: 'tournaments/createSucceeded' as const,
  payload: tournament,
});

const createTournament =
  (name: string): Thunk =>
  async (dispatch: RootThunkDispatch, getState: RootGetState) => {
    try {
      const response = await fetch(API_TOURNAMENTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const tournament = await response.json();
      dispatch(createTournamentSuccess(tournament));
    } catch (e) {}
  };

const updateTournamentSuccess = (tournament: Tournament) => ({
  type: 'tournaments/updateSucceeded' as const,
  payload: tournament,
});

const updateTournament =
  (id: string, name: string): Thunk =>
  async (dispatch: RootThunkDispatch) => {
    try {
      const response = await fetch(API_TOURNAMENTS_URL + '/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const tournament = await response.json();
      dispatch(updateTournamentSuccess(tournament));
    } catch (e) {}
  };

const deleteTournamentSuccess = (id: string) => ({
  type: 'tournaments/deleteSucceeded' as const,
  payload: id,
});

const deleteTournament =
  (id: string): Thunk =>
  async (dispatch: RootThunkDispatch) => {
    try {
      await fetch(API_TOURNAMENTS_URL + '/' + id, {
        method: 'DELETE',
      });
      dispatch(deleteTournamentSuccess(id));
    } catch (e) {}
  };

const changeTournamentsFilter = (filter: string) => ({
  type: 'tournaments/changeFilter' as const,
  payload: filter,
});

const filterTournaments =
  (filter: string): Thunk =>
  async (dispatch: RootThunkDispatch) => {
    dispatch(changeTournamentsFilter(filter));
    dispatch(fetchTournaments());
  };

type Action =
  | ReturnType<typeof fetchTournamentsStarted>
  | ReturnType<typeof fetchTournamentsSuccess>
  | ReturnType<typeof fetchTournamentsFailed>
  | ReturnType<typeof changeTournamentsFilter>
  | ReturnType<typeof createTournamentSuccess>
  | ReturnType<typeof updateTournamentSuccess>
  | ReturnType<typeof deleteTournamentSuccess>;

export type { Action };

export {
  fetchTournaments,
  changeTournamentsFilter,
  filterTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
};
