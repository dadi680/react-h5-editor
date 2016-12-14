import React, {Component, PropTypes} from 'react';
import { ModuleType } from '../../const/';
import { DragSource, DropTarget } from 'react-dnd';
import * as CommonDnd from '../CommonDnd';
import Source from './Source';
import * as Config from './Config';
import classNames from 'classnames';
import configureStore from '../../../store/configureStore';
import * as appActions from '../../../actions/app';
const store = configureStore({},'APP');

const moduleSource = {
  beginDrag: CommonDnd.beginDrag(Config),
  endDrag: CommonDnd.endDrag()
};

const moduleTarget = {
  hover(props, monitor, component) {
  }
}

function collectTarget(connect) {
  return { connectDropTarget: connect.dropTarget() }
}

class Module extends Component {
  constructor() {
    super()
  }

  moduleClick() {
    store.dispatch(appActions.ShowProperty(this.props.component));
  }

  render() {
    const { connectDragSource, isDragging, connectDropTarget, previewInApp, component} = this.props;
    const styles = classNames({
      'active': component && component.showProperty
    });
    let properties = {};

    if(component){
      /**
       * 根据配置文件生成组件
       */
      component.properties.forEach(property=>{
        return properties[property.propKey] = property.value;
      })
    }
    
    /**
     * app 里和 组件库的display 不一样
     */
    let dom = ((displayName) => {
      if (previewInApp) {
        return (
          <div className={styles} onMouseDown={this.moduleClick.bind(this) } >
            <Source
              id={component.id}
              property = {properties}
              />
          </div>)
      } else {
        return (
          <li className="item">
            <i className="el-icon-edit"></i> {displayName}
          </li>)
      }
    })(Config.displayName)

    return connectDragSource(connectDropTarget(dom, { dropEffect: 'copy' }))
  }
}

Module.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default
  DropTarget(ModuleType[Config.componentKey], moduleTarget, collectTarget)
    (DragSource(ModuleType[Config.componentKey], moduleSource, CommonDnd.collectSource())(Module))