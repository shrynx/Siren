import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import store from '../store';
import io from 'socket.io-client';

import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketches/tempo';

import './style/Layout.css';

import { saveScBootInfo } from '../actions'

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket_sc: io('http://localhost:3006/'),  // Port 3005 is skipped because
      trigger_msg: {}                           // a HTC Vive process is using it
    }
  }

  componentDidMount() {
    const ctx = this;
    const { socket_sc } = ctx.state;

    socket_sc.on('connect', (reason) => {
      console.log("connect: ", reason);
      store.dispatch(saveScBootInfo({boot: 1, tidalMenu: true}));
    });
    socket_sc.on('disconnect', (reason) => {
      console.log("connect: ", reason);
      store.dispatch(saveScBootInfo({boot: 0, tidalMenu: false}));
    });
    socket_sc.on("/sclog", data => {
      ctx.setState({trigger_msg: data.trigger});

      // console.log("SCLog: ", data.trigger);
      if(_.startsWith(data.trigger, 'SIREN')) {
        store.dispatch(saveScBootInfo({boot: 1, tidalMenu: true}));
      }
    })
  }

  updateDimensions() {
    const element = document.getElementById('canvasLayout');
    if(element && element !== null){
      const w = element.clientWidth;
      const h = element.clientHeight;

      return {w: w, h: h-25};
    }
  }

  render() {
    const ctx = this;

    let dimensions = ctx.updateDimensions();

    return (<div className={"draggableCancel"}>
      <P5Wrapper sketch={sketch}
                 width={dimensions ? dimensions.w: 600}
                 height={dimensions ? dimensions.h: 90}
                 activeMatrix={ctx.props.activeMatrix}
                 message={ctx.state.trigger_msg}
                 serverLink={ctx.props.serverLink}/>
    </div>);
  }
}
export default connect(state => state)(Canvas);
