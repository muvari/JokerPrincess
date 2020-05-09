import React from 'react';

import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

const popover = (
  <Popover id="popover-positioned-bottom" style={{maxWidth: "400px"}}>
    <Popover.Title as="h3">Love Letter Cards</Popover.Title>
    <Popover.Content>
    <table className="stats-table">
            <thead>
              <tr>
                <th></th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="eight mini">8</span> (1)</td>
                <td>Lose if discarded</td>
              </tr>
              <tr>
                <td><span className="seven mini">7</span> (1)</td>
                <td>Must discard if you have 5 or 6</td>
              </tr>
              <tr>
                <td><span className="six mini">6</span> (1)</td>
                <td>Swap Hands</td>
              </tr>
              <tr>
                <td><span className="five mini">5</span> (2)</td>
                <td>One player discards their hand</td>
              </tr>
              <tr>
                <td><span className="four mini">4</span> (2)</td>
                <td>Protection until next turn</td>
              </tr>
              <tr>
                <td><span className="three mini">3</span> (2)</td>
                <td>Compare hands; lower hand is out</td>
              </tr>
              <tr>
                <td><span className="two mini">2</span> (2)</td>
                <td>Look at a hand</td>
              </tr>
              <tr>
                <td><span className="one mini">1</span> (5)</td>
                <td>Guess a player's hand</td>
              </tr>
            </tbody>
          </table>
    </Popover.Content>
  </Popover>
);

export const HelpButton = () => (
  <OverlayTrigger trigger="hover" placement="bottom" overlay={popover}>
    <Button variant="info" className="question"><i class="fas fa-question"></i></Button>
  </OverlayTrigger>
);