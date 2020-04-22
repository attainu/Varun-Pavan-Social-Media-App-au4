import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { connect } from "react-redux";
import "./searchBar.css";
import axios from "axios";
import { Link } from "react-router-dom";
let mapStateToProps = (state) => {
    return {
        state: state.profile,
    };
};
class SearchBar extends Component {
    state = {
        value: "",
        suggestions: [],
        usersList: [],
        id: "",
    };

    componentDidMount = async () => {
        let user = await axios.get(`http://localhost:3010/users`, {
            headers: { 'auth-token': localStorage.getItem('token') }
        });
        this.setState({ usersList: user.data.data });
    };

    escapeRegexCharacters = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    getSuggestions = (value) => {
        const escapedValue = this.escapeRegexCharacters(value.trim());

        if (escapedValue === "") {
            return [];
        }

        const regex = new RegExp("^" + escapedValue, "i");

        return this.state.usersList.filter((usersList) =>
            regex.test(usersList.name)
        );
    };

    getSuggestionValue = (suggestion) => {
        return suggestion.name;
    };

    renderSuggestion = (suggestion) => {
        return (
            <>
                {" "}
                <span
                // onClick={() =>
                //     this.props.dispatch({
                //         type: "SEARCH_PROFILE",
                //         payload: suggestion._id,
                //     })
                // }
                >
                    <Link to={`/${suggestion._id}`}>
                        <img
                            className="mr-2"
                            alt="User"
                            src="https://conferenceoeh.com/wp-content/uploads/profile-dummy-girl.jpg"
                            style={{ height: "30px", width: "30px", borderRadius: "50%" }}
                        />{" "}
                        {suggestion.name}
                    </Link>
                </span>
            </>
        );
    };
    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue,
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(value),
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    render() {
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: "Search user",
            value,
            onChange: this.onChange,
        };
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}

export default connect(mapStateToProps)(SearchBar);
