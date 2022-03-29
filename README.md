# Rock Paper Scissors Lizard Spock on Chain

> A simple client app to play extended version of Rock Paper Scissor game on chain staking some value !

The first player creates the game, stake a commitment of his move, set the other player and stakes some ETH.
The second player pays the same amount of ETH and chooses his move.
The first player reveals his move and the contract distributes the ETH to the winner or splits them in case of a tie.

The contracts can be found [here](https://gist.github.com/Bereket-G/dbded0e8629e9b49d1ac5ba5ed62d9f2).

Based on vue3 starter template https://github.com/vincentdoerig/vue3-typescript-tailwind-starter.

[Play Online](https://teal-rugelach-8eb5e2.netlify.app/) ( Use RinkeBy Network )

![RPS-game-gif](https://user-images.githubusercontent.com/19642322/160598916-1f99af94-a6f6-4d10-876b-04cf1248a4b0.gif)

## Features

- **Secured** : the moves of the players are hashed and the second player can not cheat on looking the first player commitment and move.

- **Resume-able** : if you refresh your screen or lost state to a game instance you deploy you can resume and continue to play.

- **Auto Revert Funds** : if the other opponent didn't play with the given time limit it will be handled as time out and funds will be reverted.

## Contributing

Contributions, feedback and issues are welcome. Feel free to fork, comment, critique, or submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).
