import "./Process.css";

function Process() {
  return (
    <div className="process">
      <h2>Process</h2>
      <div className="tabs">
        <div className="tab">
          <input type="checkbox" id="chck1" />
          <label className="tab-label" htmlFor="chck1">
            <h3>First things First</h3>
          </label>
          <div className="tab-content">
            <h4>First thoughts</h4>
            <p>
              My first impression of this challenge was that it was very fun! I
              enjoyed working on this every step of the way and saw lots of
              opportunities to learn more.
            </p>
            <h4>First steps</h4>
            <p>
              My first step was to setup my{" "}
              <a
                target="blank"
                href="https://github.com/RvVelthuijsen/hightechICTchallenge"
              >
                GitHub repo
              </a>{" "}
              and clone it locally. I then initiated the project files, using
              Vite for the Web App and manually for the console Node app. From
              the get-go, I envisioned a console-only bot and an interactive Web
              App, but very quickly as I started working on the first, I
              realised to potential for an interactive text adventure style game
              in the console. The project then became three-fold.
            </p>
          </div>
        </div>

        <div className="tab">
          <input type="checkbox" id="chck2" />
          <label className="tab-label" htmlFor="chck2">
            <h3>Console only</h3>
          </label>
          <div className="tab-content">
            <h4>Working with the API</h4>
            <p>
              I first wrote functions for registering and forgetting the player,
              to test the fetch functionality and the responses from the server.
              Knowing this was going up on GitHub, I installed dotenv right away
              to store the API key and base URL safely. Once this was all up and
              running, I chose to work with the Example Maze to try to start
              moving around.
            </p>
            <h4>Implementing logic</h4>
            <p>
              Rather than fully plan a movement system, I built up the logic to
              become gradually more complex. I set up a basic movement function
              which would select a tile to move to which is most advantageous.
              It looped through the possible move actions, and chose the first
              option which has a reward of more than 0. This evolved gradually
              to this{" "}
              <a
                target="blank"
                href="https://github.com/RvVelthuijsen/hightechICTchallenge/blob/main/console-only/oldversion.js"
              >
                basic idea
              </a>
              :
            </p>
            <ul>
              <li>If a tile has score to collect, go there</li>
              <li>
                If not, check if a tile can cache score && player has score in
                hand, go there{" "}
              </li>
              <li>
                If not, check if there is an exit AND player has no more score
                in hand, go and exit{" "}
              </li>
              <li>Else, go to first move option</li>
            </ul>
            <p>
              At this point, I set up a basic game loop to loop through all
              available tiles of the maze and make a move each time. This later
              evolved into a do ... while loop which would keep going as long as
              inMaze was true.
            </p>
            <p>
              I also implemented a timer to wait until the next move for 3
              second, which made following the process in the console much
              easier. It was tricky building a Timeout the async gameloop would
              actually wait for. I had to Google to find a solution which
              utilised a Promise.
            </p>
            <p>I then gradually built on this foundation.</p>
            <ul>
              <li>
                I adjusted the movement to now favour tiles which has not been
                visited before.
              </li>
              <li>
                I added the stipulation to go for total score, by only allowing
                exit if totalScore === scoreInBag.
              </li>
              <li>
                Once I got stuck in a left - right - left - right loop, started
                check if the first move in the list brought you back to your
                last move by saving these 'counters' in an object variable to
                check against. I did think to implement a stipulation that if
                there was only one movement option, to go.
              </li>
              <li>
                I rehauled the move selection function when it still would not
                find the last remaining points to clear the Example Maze. I
                started fully eliminating options from the array of moveOption
                before looping over it, taking out the move that would put you
                back where you came from.
              </li>
            </ul>
            <p>
              When this still did not fully solve the maze, I started
              implementing tagging tiles at intersections with the direction you
              went in last. While ar first fully removing the tile we last went
              to from the options upon next visiting the tile, I realised this
              was not satisfactory and I put them back into the loop, but
              skipping the tagged option if it held nothing of interest (such as
              an exit or score collection point).
            </p>
            <p>
              I moved the 'if all else fails' move selection outside of the
              loop, using a variable to check whether the move was changed
              during the loop.
            </p>
            <p>
              This was getting somewhere, but still not clearing the maze with
              the total score. I therefor implemented Math.Random() to pick a
              tile if all else failed. This finally cleared the Example Maze
              with the total score in 39 loops.
            </p>
            <p>
              I then started looping over all the mazes in an attempt to clear
              them all, one after the other. This was a bit much to ask though,
              and solutions would take more than 1000 loops sometimes, and some
              (PacMan) it could not clear after letting it run for 3351 loops.
            </p>
            <p>
              So I finally implemented path retracing to the exit if it was
              found. It took some thinking but was implemented and worked! Every
              move it now checks surrounding tiles for an exit and if found,
              adds the direction to an array. When we then have selected our
              move we update the array. If we move to the exit, the array is
              cleared (we're at the exit, no path to retrace), if not we add the
              counter direction to the start of the array. Once all conditions
              are met, the movement script will skip iteration and move to the
              first step of the array while removing it the from the array. On
              implementation, this seemed to work well, but the movement
              function became much messier and more cluttered and contains a lot
              of repeating, so it would need to be cleaned up. However, I was
              satisfied and eager to move only an interactive version.
            </p>
            <h4>Issues</h4>
            <p>Some issues I ran into in the process:</p>
            <ul>
              <li>
                The Node.js version I was initially running was quite old. I had
                not built pure Node apps in quite a while, so updating was
                necessary in order for the fetch functionality to work innately.
              </li>
              <li>
                Getting dotenv config to run properly proved a hassle between
                the incompatibility with the ES6 module format and functions
                needing to run in subfolders. I therefor set up scripts to run
                in my package.json which would run everything with the config
                flag. This proved very handy and I continued to use these
                throughout the project.
              </li>
              <li>
                Small but disastrous things I overlooked, such as using a (for
                ... in ...) loop instead of a (for ... of ...) loop, or
                forgetting '= 0' in 'let i = 0' in for loop, or being so used to
                going -1 on .length of array, when this is not necessary for
                Math.Random().
              </li>
            </ul>
            <h4>Next Steps</h4>
            <p>
              If I were to continue working on this, I would consider these my
              next steps:
            </p>
            <ul>
              <li>
                Clean up the movement selection function. It is currently
                repeating itself in places and very long. It has to be simpler.
              </li>
              <li>
                Create a Player and Maze class with proper constructors for all
                these loose variables, and make the many functions methods of
                each class. Also implement a reset() function to reset variables
                to defaults.
              </li>
              <li>
                Implement path retracing for score collection as well. This is
                trickier. I don't want to retrace the moment I have any score in
                hand. Setting arbitrary goals such as "half of total score" can
                also backfire, so this would require more thinking.
              </li>
            </ul>
          </div>
        </div>

        <div className="tab">
          <input type="checkbox" id="chck3" />
          <label className="tab-label" htmlFor="chck3">
            <h3>Interactive Console</h3>
          </label>
          <div className="tab-content">
            <h4>Building on what was before</h4>
            <p>
              As I had already written all the necessary functions for
              interaction with the API, the development of this interactive text
              adventure became more about learning the npm package I was using
              for this:{" "}
              <a target="blank" href="https://www.npmjs.com/package/inquirer">
                inquirer
              </a>
              .
            </p>
            <p>
              This package allows for more dynamic user input than just prompts.
              I especially liked it for its ability to create lists of options.
              I was looking forward to using this to allow the player to select
              a maze to play themselves and of course to select a movement
              option.
            </p>{" "}
            <p>
              However, implementing this proved quite tricky. For example, I had
              some trouble using the answers from the inquirer prompts in the
              register and enter maze functions. It would exit the main gameloop
              function the moment the first prompt appeared on screen. The fix
              turned out to be quite simple (the inquirer prompt needed to be
              awaited and assigned directly to a variable), but I went through a
              bunch of Google red herrings to get there...
            </p>{" "}
            <p>
              I decided not to go with a loop for this, but to recursively call
              the movement function, which handles much more logic now.
            </p>
            <h4>Next Steps</h4>
            <p>
              If I were to continue working on this version, I would consider
              these my next steps:
            </p>
            <ul>
              <li>Carry over the Player and Maze classes mentioned above.</li>
              <li>
                Create a more in-depth console experience. Something like{" "}
                <a target="blank" href="https://github.com/chjj/blessed">
                  blessed
                </a>
                , which allows for multiple 'windows' and styles, would work
                well.
              </li>
            </ul>
          </div>
        </div>

        <div className="tab">
          <input type="checkbox" id="chck4" />
          <label className="tab-label" htmlFor="chck4">
            <h3>Web App</h3>
          </label>
          <div className="tab-content">
            <h4>Building a visual app</h4>
            <p>
              Having navigated these mazes purely by memory and imagination, I
              was quite excited to put something visual on the screen. I opted
              for a split view, reminiscent of handheld gaming consoles, with
              the 'screen' above and the 'controls' below.
            </p>
            <p>
              For a while I considered the possibility to fully map out a maze
              as the player walks through it, but with warp loops being a thing,
              this seemed rather complex right off the bat. I decided to just
              have the player on a tile in the centre and map over the possible
              move actions. Using the handy grid template area, these would
              always be in the direction the need to point in, no matter what
              order they are mapped over. I used the same technique for the
              buttons.
            </p>
            <h4>Next Steps</h4>
            <p>
              If I were to continue working on this version, I would consider
              these my next steps:
            </p>
            <ul>
              <li>
                A more compelling visual style, especially for the HUD elements
                like the score in hand and bag, and the exit and collection
                points.
              </li>
              <li>Fully mapping out the maze visually.</li>
              <li>Better animation handling, animating the player.</li>
              <li>
                Better string handling to communicate to the player better.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Process;
