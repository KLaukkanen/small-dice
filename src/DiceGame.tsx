import * as React from "react"
import {Grid,Row,Col} from "react-bootstrap"
import {DiceGroup} from "./Dice"


interface diceGroup {
    value: number,
    selected: boolean,
    amount: number
    /*diceGroup contains 1 or more dice of the same eye value*/

}


export default class DiceGame extends React.Component {
    state: {
        hands: diceGroup[][],
        player: number,
        skips: number,
        gameOver: boolean,
        winner: number
    }

    constructor(props) {
        super(props);
        this.state = { hands: [[], []], player: 0, skips: 0,gameOver:false,winner:undefined }

    }
    onDieClick(_hand, index) {

        let hand = [...this.state.hands[_hand]]
        let diceGroup = hand[index]
        diceGroup.selected = !diceGroup.selected
        super.setState({ hand1: hand })
    }
    /*The action functions are called by user through UI, so they could use the state,
    but they are also called by the AI function, so to unify the two needs, the action functions 
    receive the hands object as a parameter */
    upgrade(_hands: diceGroup[][]) {
        let hands = [..._hands]
        let hand = hands[this.state.player];
        let diceIndex = findIndex(hand, (die) => {
            return die.selected == true
        })
        if (diceIndex != -1) {
            hand[diceIndex].value = hand[diceIndex].value + 1;
        }
        hands[this.state.player] = hand;
        //super.setState({ hands: hands })
        this.switchTurn(hands,false);

    }
    attack(_hands: diceGroup[][]) {
        let hands = [..._hands];
        let hand = hands[this.state.player == 1 ? 0 : 1]
        let diceIndex = findIndex(hand, (die) => {
            return die.selected == true;
        })
        hand.splice(diceIndex, 1)
        hands[this.state.player == 1 ? 0 : 1] = hand;
        //super.setState({ hands: hands })
        this.switchTurn(hands,false);
    }
    reroll(_hands: diceGroup[][]) {
        let hands = [..._hands];
        let hand = hands[this.state.player];
        let diceIndex;
        do {
            diceIndex = findIndex(hand, (die) => {
                return die.selected == true
            })
            if (diceIndex != -1) {
                hand[diceIndex].selected = false;
                while (hand[diceIndex].amount > 1) {
                    hand[diceIndex].amount -= 1;
                    hand.push({ value: dieRoll(), amount: 1, selected: false })
                }
                hand[diceIndex].value = dieRoll();
            }

        } while (diceIndex != -1)
        hands[this.state.player] = hand;
       // super.setState({ hands: hands })
        this.switchTurn(hands,false);
    }
    group(_hands: diceGroup[][]) {
        let hands = [..._hands];
        let hand = hands[this.state.player];
        let diceIndex1, diceIndex2;
        diceIndex1 = findIndex(hand, (die) => {
            return die.selected == true
        })
        hand[diceIndex1].selected = false;
        diceIndex2 = findIndex(hand, (die) => {
            return die.selected == true;
        })
        hand[diceIndex1].amount += hand[diceIndex2].amount
        hand.splice(diceIndex2, 1)
        hands[this.state.player] = hand;
        //super.setState({ hands: hands })
        this.switchTurn(hands,false);
    }
    canUpgrade() {
        let hand = this.state.hands[0];
        let selected = hand.filter((g) => {
            return g.selected == true
        })
        return selected.length == 1 && selected[0].value < 6

    }
    canReroll() {
        let hand = this.state.hands[0];
        let amountSelected = hand.reduce((acc: number, g) => {
            return acc + (g.selected && g.amount)
        }, 0)
        return amountSelected > 0 && amountSelected <= 3
    }
    canGroup() {
        let hand = this.state.hands[0];
        let selected = hand.filter((g) => {
            return g.selected
        })
        return selected.length == 2 && selected[0].value == selected[1].value
    }
    canAttack() {
        let hand1 = this.state.hands[0];
        let hand2 = this.state.hands[1];
        let selected1 = hand1.filter((g) => {
            return g.selected
        })
        let selected2 = hand2.filter((g) => {
            return g.selected
        })
        if (selected1.length == 1 && selected2.length == 1) {
            return selected1[0].value * selected1[0].amount >= 2 * selected2[0].value * selected2[0].amount
            /*To attack, the attacking group's total eye value must be at least two times the defending group's 
            eye value */
        } else return false
    }
    skip(hands) {
        let skips = this.state.skips;
        if (skips == 1) {
            this.endGame();
        } else {
            //super.setState({ skip: 1 });
            this.switchTurn(hands,true);
        }
    }
    endGame() { 
        let score1=this.state.hands[0].reduce((acc:number,group)=>{
            return acc+group.amount;
        },0)
        let score2=this.state.hands[1].reduce((acc:number,group)=>{
            return acc+group.amount;
        },0)
        if(score1>score2){
            super.setState({gameOver:true,winner:0})
        }else if(score2>score1){
            super.setState({gameOver:true,winner:1})
        }else{
            super.setState({gameOver:true,winner:2})     
        }



    }
    switchTurn(_hands:diceGroup[][],didSkip: boolean) {
        let hands = [..._hands]
        hands.forEach((hand) => {
            hand.forEach((die) => {
                die.selected = false;
            })
        })
        if (hands[0].length == 0 || hands[1].length == 0) {
            this.endGame()
        } else {
            let player = this.state.player == 1 ? 0 : 1;
            let skip = didSkip ? 1 : 0;
            super.setState({ hands: hands, player: player, skips: skip })
            if (player == 1) {
                setTimeout(this.ai,200);
            }
        }
    }


    ai=() =>{
        /*Simple opponent AI
        Will first upgrade all available dice to 6, then group them, and then attack
        */
        let hands = [...this.state.hands]
        let hand = hands[1];
        let diceIndex = findIndex(hand, (die) => {
           return  die.value < 6;
        })
        if (diceIndex != -1) {
            hand[diceIndex].selected = true;
            hands[1] = hand;
            //super.setState({ hands: hands })
            this.upgrade(hands);

        }
        //The rest of the groups are sixes. Let's see if there are more than 1
        else if (hand.length > 1) {
            hand[0].selected = true;
            hand[1].selected = true;
            hands[1] = hand;
           // super.setState({ hands: hands })
            this.group(hands);
        } else {
            let hand2 = hands[0];
            let diceIndex = findIndex(hand2, (die) => {
                return die.value * die.amount * 2 <= hand[0].value * hand[0].amount
            })
            if (diceIndex != -1) {
                hand2[diceIndex].selected = true;
                hand[0].selected = true;
                hands[0] = hand2;
                hands[1] = hand;
               // super.setState({ hands: hands });
                this.attack(hands)
            }
            else {
                this.skip(hands);
            }


        }








    }
    resetGame=()=>{
        super.setState({player:0,skip:0,hands:getStartingHands(),gameOver:false,winner:undefined})
    }

    componentDidMount() {
      

        super.setState({ hands: getStartingHands() })


    }
    render() {
        return <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"700px", "position":"relative","height":"100vh"}}>
      
        <div style={{"position":"absolute","top":"50%","transform":"translate(0, -50%)"}}>
        <Grid>
            {this.state.hands.map((hand, handIndex) => {
                return <div key={handIndex}>{handIndex==0?"Human ":"Comp :   "}{hand.map((group, dieIndex) => {
                    return <DiceGroup player={handIndex} key={dieIndex} onClick={(evt) => { this.onDieClick(handIndex, dieIndex) }} value={group.value} selected={group.selected} amount={group.amount} />
                })}{this.state.player==handIndex&&" T"}</div>

            })}
            <span>
                <ActionButton
                    text="Reroll"
                    onClick={(evt) => { this.reroll(this.state.hands) }}
                    enabled={this.canReroll()&&this.state.player==0&&!this.state.gameOver} />
                <ActionButton
                    text="Upgrade"
                    onClick={(evt) => { this.upgrade(this.state.hands) }}
                    enabled={this.canUpgrade()&&this.state.player==0&&!this.state.gameOver} />
                <ActionButton
                    text="Group"
                    onClick={(evt) => { this.group(this.state.hands) }}
                    enabled={this.canGroup()&&this.state.player==0&&!this.state.gameOver} />
                <ActionButton
                    text="Attack"
                    onClick={(evt) => { this.attack(this.state.hands) }}
                    enabled={this.canAttack()&&this.state.player==0&&!this.state.gameOver} />
                <ActionButton
                    text="Skip"
                    onClick={(evt)=>{this.skip(this.state.hands)}}
                    enabled={this.state.player==0&&!this.state.gameOver}/>
            </span>
            <GameEndText
                    visible={this.state.gameOver} winner={this.state.winner}/>
            <br/>
            <button onClick={this.resetGame}>Restart Game</button>
            <br/>
            <GameRules/>
            </Grid>
            </div>
            </div>
            
           
      
        
    }


}

interface actionProps {
    text: string,
    onClick: (MouseEvent)=>void,
    enabled: boolean
}
function ActionButton(props: actionProps) {

    return <button onClick={props.onClick} disabled={!props.enabled}>
        {props.text}
    </button>

}
function GameEndText(props){
    return props.visible&&<div>{props.winner==0?"You win!":(props.winner==1?"You lose!":"Draw!")}</div>
}
function GameRules(props){
    return <div>Game objective: Finish the game with more dice than your opponent<br/>
       Gameplay: Select a number of your dice and an action
       Actions:<ul>
        <li> Upgrade (1 die selected): increase the value of 1 of your dice</li>
        <li> Group (2 dice / groups selected): combine your dice to a single group, combining their value
            <ul><li>The dice to be combined need to have the same eye values</li></ul>
        </li>
        <li>Reroll (max 3 dice selected): reroll 3 of your dice</li>
        <li>Attack (1 of your dice / groups, 1 of your opponent's dice / groups selected):
               <ul><li> destroy your opponent's die / group. The eye value of your selected dice needs to be
                two times the target's eye value, or more</li></ul></li>
        <li> Skip</li></ul>
        Game ends when: <ul>
            <li> One player runs out of dice</li>
           <li>Both players skip on following turns</li></ul>

    </div>
}
function findIndex(array: Array<any>, cb: Function) {
    let i = 0;
    while (i < array.length && !cb(array[i])) {
        i++
    };
    if (i < array.length) {
        return i;
    } else return -1;


}
function dieRoll() {
    return Math.floor(Math.random() * 6 + 1)
}
function getStartingHands(){
    let allDice = []
    for (let i = 0; i < 12; i++) {
        let num = Math.floor(Math.random() * 6 + 1)
        allDice[i] = { value: num, selected: false, amount: 1 };


    }
    return  [allDice.slice(0, 6), allDice.slice(6, 12)]
}