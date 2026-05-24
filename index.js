import { registerRootComponent } from 'expo';
import App from './App';

// 1. Registers the component with the native app shell wrapper
registerRootComponent(App);

// 2. Clear the bundler parsing error by providing the required default fallback export
export default App;