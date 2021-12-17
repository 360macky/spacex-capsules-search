import React from 'react';
import isEmptyObject from '../../utils/isEmptyObject';
import {
  ResultsContainer,
  SearchContainer,
  SearchInput,
  SearchButton,
} from '../../components/Search';
import CoreResult from './CoreResult';

import { SPACEX_API__CORES } from '../../api';

class Cores extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      coresFounded: {},
      isLoadingData: null,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value,
    });
  };

  getResults = (searchTerm, searchProperty, searchList) => {
    let resultsTerm = searchTerm[searchProperty];
    if (resultsTerm !== null) {
      let searchRegExp = new RegExp(searchList, 'i');
      if (resultsTerm.search(searchRegExp) !== -1) {
        return resultsTerm;
      }
    }
    return false;
  };

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      isLoadingData: true,
    });

    fetch(SPACEX_API__CORES)
      .then((response) => response.json())
      .then((data) => {
        const coresFounded = data.filter((core) =>
          this.getResults(core, 'last_update', this.state.search)
        );
        this.setState({
          isLoadingData: false,
          coresFounded,
        });
      });
  };

  render() {
    let results = null;
    if (!isEmptyObject(this.state.coresFounded)) {
      results = this.state.coresFounded.map((core, index) => (
        <CoreResult
          key={index}
          id={core.id}
          serial={core.serial}
          lastUpdate={core.last_update}
          status={core.status}
          reuseCount={core.reuse_count}
        />
      ));
    }
    return (
      <SearchContainer onSubmit={this.handleSubmit}>
        <SearchInput value={this.state.search} onChange={this.handleChange} />
        <SearchButton
          isLoadingData={this.state.isLoadingData}
          lookingFor="core"
        />
        <ResultsContainer>{results}</ResultsContainer>
      </SearchContainer>
    );
  }
}

export default Cores;
