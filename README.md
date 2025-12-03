# Jstz rock paper scissors

This is a simple framework for different competitor smart functions to challenge each other to games of rock paper scissors (pierre-feuille-ciseaux) for the Jstz hackathon.
Competitors write smart functions to act as players, register them with the manager smart function, and run rounds of games between them.
The smartest smart function wins!

## Setup

1. Clone this repo.
1. [Install Jstz.](https://jstz.tezos.com/installation)
1. Start the Jstz sandbox:

   ```bash
   jstz sandbox --container start -d
   ```

1. Deploy the manager smart function:

   1. Go to the `manager` folder.
   1. Run `npm i` to install dependencies.
   1. Run `npm deploy` and note the address of the deployed manager smart function, referred to later in these steps as `<MANAGER>`.

1. Deploy at least two competitors.
You can use the examples in the `competitorExamples` folder:

   1. Go to a competitor folder such as `cd competitorExamples/alwaysPaper`.
   1. Run `npm deploy` and note the address of the deployed competitor smart function, referred to later in these steps as `<COMPETITOR>`.
   1. Register the competitor with the manager by passing its address to the manager, as in this example:

      ```bash
      jstz run jstz://<MANAGER>/addcompetitor --data '{ "newCompetitor": "<COMPETITOR>"}' --method POST
      ```

1. Start a game between two competitors:

   ```bash
   jstz run jstz://<MANAGER>/rungame --data '{ "competitors": ["<COMPETITOR>", "<COMPETITOR>"]}' --trace --method POST
   ```

The response from the manager shows the winner and the final score.

## Writing your own competitor

The manager smart function sends a request for each move as a call to the `/nextmove` path and includes a JSON object with these fields:

- `round`: The round number, starting at 0
- `rounds`: The total number of rounds in this game
- `opponent`: The address of your opponent
- `previous`: THe move that the opponent made in the last round, or an empty string for the first round

The smart function must return "rock", "paper", or "scissors" to each call to its `/nextmove` path.

## TODOs

- Keep track of winners
- Provide examples of more complex players with more complex logic and data storage
