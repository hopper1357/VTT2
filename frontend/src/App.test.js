import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main application layout', () => {
  render(<App />);
  const linkElement = screen.getByText(/Game Modules/i);
  expect(linkElement).toBeInTheDocument();
});
