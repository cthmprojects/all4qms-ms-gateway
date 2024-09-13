import enums from './reducers/enums.reducer';
import indicators from './reducers/indicators.reducer';
import indicatorGoals from './reducers/indicator-goals.reducer';
import chartsReducer from './reducers/charts.reducer';

const performanceIndicatorReducers = {
  enums,
  indicatorGoals,
  indicators,
  chartsReducer,
};

export default performanceIndicatorReducers;
