import React from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import '../assets/CodeMirrorRules.js';
import '../styles/_style.css'
import { save } from '../keyFunctions.js';

@inject('sceneStore', 'patternStore')
@observer
export default class Patterns extends React.Component {
  
    executionCss = (event, duration = 500) => {
        event.persist();
        event.target.className += ' Executed';

        _.delay( () => (event.target.className = _.replace(event.target.className, ' Executed', '') ),
                duration);
    }

    handleControlEnter = (event) => {
        if(event.ctrlKey && event.keyCode === 13){
            this.executionCss(event);
            this.props.patternStore.addPattern(
                document.getElementById('add_pattern_input').value, 
                this.props.sceneStore.activeScene)
        }
    }
    saveStuff = (editor, e) => { 
        if(e.ctrlKey && (e.which === 83)) {
            e.preventDefault();
            save();
            return false;
        }
    }

    renderItem(item, i) {
        let options = {
            mode: '_rule',
            theme: '_style',
            fixedGutter: true,
            scroll: true,
            styleSelectedText:true,
            showToken:true,
            lineWrapping: true,
            showCursorWhenSelecting: true
        };
    
    return (
        <div key={'p'+i} className={"PatternItem draggableCancel"}>
            <div>
                <div className={'PatternItemInputs'}>
                    <input type="String"
                        className={'Input draggableCancelNested'}
                        placeholder={"Name"}
                        value={item.name}
                        onChange={(event) => {
                            this.props.patternStore.changePatternName(
                                item.name,
                                event.target.value,
                                document.getElementById('add_pattern_input').value)
                        }}
                        />
                    <input type="String"
                        className={'Input draggableCancelNested'}  
                        placeholder={"Parameters"}  
                        value={item.params}
                        readOnly/>
                    <button className={'Button draggableCancelNested'} 
                            onClick={() => {
                                this.props.patternStore.deletePattern(
                                    item.name,
                                    this.props.sceneStore.activeScene
                                )
                            }}>{'Delete'} </button>
                </div>
                <CodeMirror className={'PatternItemCodeMirror draggableCancelNested'}
                    value={item.text}
                    options={options}
                    onBeforeChange={(editor, metadata, value) => {
                        this.props.patternStore.changePatternText(
                            item.name,
                            value,
                            this.props.sceneStore.activeScene
                        )
                    }}
                    onChange={() => { }}
                    onKeyDown={this.saveStuff.bind(this)}
                            />
            </div>
        </div>)
    }

    render() {
        console.log("RENDER PATTERN.JS");
      
        return (
            <div>
                <div className={'PatternItem PatternItemInputs'}>
                    <input type="text" id={'add_pattern_input'}
                        className={'Input draggableCancel'}
                        placeholder={'New Pattern Name'}
                        onKeyUp={this.handleControlEnter.bind(this)}
                    />
                <button className={'Button draggableCancel'} 
                        onClick={() => (this.props.patternStore.addPattern(
                            document.getElementById('add_pattern_input').value, 
                            this.props.sceneStore.activeScene)
                        )}>Add
                </button>
                </div>

                {_.map(this.props.patternStore.activePatterns, 
                       this.renderItem.bind(this))}
            </div>);
    }
}