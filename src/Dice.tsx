import  styled from "./Styled/styledComponents"
import * as React from "react"
const Dot=styled.div.attrs<any>({})`
    width:10px;
    height: 10px;
    border-radius:15px;
    background-color: white;
    color: black;
    `
const EmptyDot=Dot.extend.attrs<any>({})`
    background-color: ${(p:any) => p.player == 1?"#AA5555":"#AAAAAA" };
`

const Face=styled.div.attrs<any>({})`
    background-color: ${(p:any) => p.player == 1?"#AA5555":"#AAAAAA" };
    width:45px;
    height:45px;
    border-radius: 5px;
    padding: 5px;
    display: inline-block;
`

const FaceSelected=Face.extend`
    border: 3px solid #11DD11;
`


export function StyledDiceGroup(props: any) {
    let style;
    if (props.selected) {
        style = {
            backgroundColor: "black",
            color: "white"
        }
    } else style = {
        backgroundColor: "white",
        color: "black"
    }
    let content =[];
    for (let i = 0; i < props.amount; i++) {
       
            content.push(<DieFace player={props.player} face={props.value}/>);
        
       
    }
    return <div onClick={props.onClick}>{content}</div>
}


export function DieFace(props){
    return  <Face player={props.player}><FaceGrid player={props.player} face={getDotGrid(props.face)}/></Face>
}
export function DieFaceSelected(props){
    return <FaceSelected player={props.player}><FaceGrid player={props.player} face={getDotGrid(props.face)}/></FaceSelected>
}


function getDotGrid(faces){
    switch(faces){
        case 1:
          return getDotGridWithArray([4]);
        case 2:
          return getDotGridWithArray([0,8]);
        case 3:
          return getDotGridWithArray([0,4,8]);
        case 4:
          return getDotGridWithArray([0,2,6,8]);
        case 5:
          return getDotGridWithArray([0,2,4,6,8]);
        case 6:
          return getDotGridWithArray([0,2,3,5,6,8]);
    }

}
function getDotGridWithArray(array){
    let returnArray=[[false,false,false],[false,false,false],[false,false,false]];
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            console.log(array)
            console.log(i*3+j)
            if(array.includes(i*3+j)){
                returnArray[i][j]=true;
            }
        }
    }
    return returnArray;
    
}


function FaceGrid(props){
    
    return (<table style={{"display":"inline"}}><tbody>
        {[0,1,2].map((yindex)=>{
        return <tr>{[0,1,2].map((xindex)=>{
        return <td>{props.face[yindex][xindex]?<Dot player={props.player} />:<EmptyDot player={props.player}/>}</td>
        })}</tr>})
            }
        </tbody></table>)
}

