import { Provider } from 'react-redux';
import AppRouter from './routes/routes';
import { store } from './store/store';

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;
