import React from 'react';
import { inject, observer } from 'mobx-react';
import Draggable from 'react-draggable';
import Cell from './Cell'
import _ from 'lodash';

@inject('channelStore')
@observer
class ChannelHeader extends React.Component {

    handleControlEnter = (event) => {
        if(event.keyCode === 13){
            this.props.channelStore.changeChannelName(this.props.value.name, this.nameInputName.value);
        }
    }
    
    render() {
        console.log('RENDER CHANNEL HEADER');
        const item = this.props.value;
        let channelHeader = "ChannelItemHeader " + item.type;
        if(_.includes(item.name, "n")){
            channelHeader = 'ChannelItemHeader NordTidal';
        }
        else if(item.type === "GLOBAL"){
            channelHeader = 'ChannelItemHeader GlobalTidal';
        }
        else if(item.name === "do"){
            channelHeader = 'ChannelItemHeader DoTidal';
        }
        return (<div className={'ChannelHeader'}>
            <div className={ channelHeader}>
                <input ref={(input_name) => { this.nameInputName = input_name; }}    
                    title={"Channel Name (" + item.name + ") [enter to submit changes]"}
                    className={"ChannelItemHeader-NameText draggableCancel"}
                    placeholder={(item.name === '' ? '___': item.name)}
                    onKeyUp={this.handleControlEnter.bind(this)}
                    onClick={() => this.nameInputName.focus()}
                    onBlur = {() => this.nameInputName.value = ''}/>
                <div className={"ChannelItemHeaderButtons"}>
                    <button className={"Button "+ item.solo} title={'Solo'} onClick={() => 
                        this.props.channelStore.toggleSolo(item.name)}>S</button>
                    <button className={"Button "+ item.mute} title={'Mute'}
                        onClick={() => 
                            this.props.channelStore.toggleMute(item.name)}>M</button>
                    <button className={"Button "+ !item.loop} title={'Loop'} onClick={() => 
                        this.props.channelStore.toggleLoop(item.name)}>R</button>
                  <button className={"Button"} title={'Delete'} onClick={() => 
                        this.props.channelStore.deleteChannel(item.name)}>X</button>
                </div>
            </div>
            <div className={"ChannelItemHeader"}>
                <div className={"ChannelItemHeader-time"}>
                    <input ref={(input_rate) => { this.nameInputRate = input_rate; }}
                        title={"Rate"}
                        className={"ChannelItemHeader-Text draggableCancel"}
                        placeholder={"rate"}    
                        value={item.rate}
                        onChange={() => (this.props.channelStore.changeChannelRate(item.name, this.nameInputRate.value))}
                        onClick={() => this.nameInputRate.focus()}/>
                    
                    {item.type === "Tidal" && 
                    <input ref={(input_transition) => { this.nameInputTrans = input_transition; }}
                        title={"Tidal Transition " + (item.transition === '' ? "NONE": "("+item.transition+")")}
                        className={"ChannelItemHeader-Transition draggableCancel"}
                        placeholder={"  ___"}  
                        value={item.transition}
                        onChange={() => 
                            (this.props.channelStore.changeChannelTransition(item.name, this.nameInputTrans.value))}
                        onClick={() => 
                            this.nameInputTrans.focus()}/>}
                            
                    <div className={"ChannelItemHeaderButtons"}>
                        <button className={"Button "+ item.gate} title={item.gate ? 'Pause': 'Play'}
                            onClick={() => (this.props.channelStore.toggleGate(item.name))}>{item.gate ? '●': '○'}</button>
                        <button className={"Button"} title={'Reset Timer'}
                        onClick={() => (this.props.channelStore.resetTime(item.name))}>🡅</button>
                    </div>
            </div>
          </div>
        </div>);
    }
}

@inject('channelStore')
@observer
class Channel extends React.Component {
  
  render() {
    const { item, index } = this.props;
    console.log('RENDER CHANNEL', item);
      
    let channelClass = "ChannelItem";
    if ((!item.loop && item.executed) || ( item.mute) || (this.props.channelStore.soloEnabled && !item.solo)) {
      channelClass += " disabled";
    }
    if(_.includes(item.name, "n")){
        channelClass = "NordChannelItem";
    }
    return (<div className={channelClass}>
        <ChannelHeader key={index} value={item} />
        <div className={"ChannelSteps"}>
            {item.cells.map((c, i) => {
                return <Cell key={i} channel_index={index} index={i} value={c}/>
            })}
            <div className={'ChannelItemSteps'}>
                <button className={"Button"}
                        title={"Add Step"}
                        onClick={() => (this.props.channelStore.addStep(item.name))}> + </button>
                <button className={"Button"}
                        title={"Remove Step"}
                        onClick={() => (this.props.channelStore.removeStep(item.name))}> - </button>
            </div>
        </div>    
    </div>);
  }
}

@inject('channelStore')
@observer
export default class Grid extends React.Component {
    onDragStop = (event, position) => {
        let stepIndex = _.toInteger((position.lastY - 60) / 40);
        this.props.channelStore.seekTimer(stepIndex);
    }
    
    render() {
        console.log('RENDER GRID');

        // eslint-disable-next-line no-unused-expressions
        // this.props.channelStore.updateCellActiveClasses

        return (<div className={'AllChannels draggableCancel PanelAdjuster'}>    
            <Draggable position={null}
                defaultPosition={{x: 0, y: 60}}    
                bounds={{
                    left: 0,
                    top: 60,
                    right: 0,
                    bottom: (this.props.channelStore.getMaxStep-1)*40+60
                }}
                axis={"y"}
                grid={[6, 40]}
                onStop={this.onDragStop}>
                <div className="Timeline"></div>
            </Draggable>
                    
            {this.props.channelStore.getActiveChannels
                .map((t, i) => {
                    return <Channel key={t.scene + "_" + t.name} item={t} index={i} />;
                })}
        </div>
        );
    }
}