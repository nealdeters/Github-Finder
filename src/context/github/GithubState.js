import React, { useReducer } from 'react'
import axios from 'axios'
import GithubContext from './githubContext'
import GithubReducer from './githubReducer'
import {
	SEARCH_USERS,
	SET_LOADING,
	CLEAR_USERS,
	GET_USER,
	GET_REPOS
} from '../types';

const GithubState = props => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false
	}

	const headers = {
    client_id: `${process.env.REACT_APP_GITHUB_CLIENT_ID}`,
    client_secret: `${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`,
  }

	const [state, dispatch] = useReducer(GithubReducer, initialState);

	// search users
	const searchUsers = async (text) => {
    setLoading();
    
    try{
      const res = await axios.get(
      	`https://api.github.com/search/users?q=${text}`, 
      	headers
      );
      dispatch( {
      	type: SEARCH_USERS,
      	payload: res.data.items
      })
    } catch (e) {
      console.log(e);
    }
  }

	// get user
	const getUser = async (username) => {
    setLoading();
    
    try {
      const res = await axios.get(
      	`https://api.github.com/users/${username}`, 
      	headers
      );
      dispatch({
      	type: GET_USER,
      	payload: res.data
      });
    } catch(e) {
      console.log(e);
    }
  }

	// get repos
	const getUserRepos = async (username) => {
    setLoading();
    
    try {
      const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc`, headers);
      dispatch({
      	type: GET_REPOS,
      	payload: res.data
      });
    } catch (e) {
      console.log(e);
    }
  }

	// clear users
	const clearUsers = () => dispatch( {type: CLEAR_USERS} );

	// set loading
	const setLoading = () => dispatch( {type: SET_LOADING} );

	return <GithubContext.Provider
		value={{
			users: state.users,
			user: state.user,
			repos: state.repos,
			loading: state.loading,
			searchUsers,
			clearUsers,
			getUser,
			getUserRepos
		}}
		>
			{props.children}
		</GithubContext.Provider>
}

export default GithubState;