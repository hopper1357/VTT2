import unittest
import sys
import os

# Add the parent directory to the Python path to allow for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.main import GameState

class TestGameState(unittest.TestCase):

    def setUp(self):
        """Set up a new GameState instance before each test."""
        self.gs = GameState()

    def test_initial_state(self):
        """Test that the initial game state is empty."""
        self.assertEqual(self.gs.players, {})
        self.assertEqual(self.gs.characters, {})
        self.assertEqual(self.gs.map_state, {"tokens": {}})

    def test_to_dict(self):
        """Test that to_dict returns the correct dictionary representation."""
        self.gs.players = {"p1": {"id": "p1"}}
        self.gs.characters = {"c1": {"name": "Aragorn"}}
        self.gs.map_state = {"tokens": {"t1": {"x": 10, "y": 20}}}

        expected_dict = {
            "players": {"p1": {"id": "p1"}},
            "characters": {"c1": {"name": "Aragorn"}},
            "map_state": {"tokens": {"t1": {"x": 10, "y": 20}}}
        }
        self.assertEqual(self.gs.to_dict(), expected_dict)

    def test_add_player(self):
        """Test adding a player."""
        self.gs.add_player("player1")
        self.assertIn("player1", self.gs.players)
        self.assertEqual(self.gs.players["player1"], {"id": "player1"})

    def test_remove_player(self):
        """Test removing a player."""
        self.gs.add_player("player1")
        self.gs.remove_player("player1")
        self.assertNotIn("player1", self.gs.players)

    def test_update_character(self):
        """Test adding or updating a character."""
        char_data = {"name": "Gandalf", "class": "Wizard"}
        self.gs.update_character("char1", char_data)
        self.assertIn("char1", self.gs.characters)
        self.assertEqual(self.gs.characters["char1"], char_data)

        updated_char_data = {"name": "Gandalf the White", "class": "Wizard"}
        self.gs.update_character("char1", updated_char_data)
        self.assertEqual(self.gs.characters["char1"], updated_char_data)

    def test_move_token(self):
        """Test moving a token."""
        self.gs.move_token("token1", 10, 20)
        self.assertIn("token1", self.gs.map_state["tokens"])
        self.assertEqual(self.gs.map_state["tokens"]["token1"], {"x": 10, "y": 20})

        self.gs.move_token("token1", 30, 40)
        self.assertEqual(self.gs.map_state["tokens"]["token1"], {"x": 30, "y": 40})


if __name__ == '__main__':
    unittest.main()
