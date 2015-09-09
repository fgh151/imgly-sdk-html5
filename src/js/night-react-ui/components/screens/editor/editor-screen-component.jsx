/** @jsx ReactBEM.createElement **/
/*
 * Photo Editor SDK - photoeditorsdk.com
 * Copyright (c) 2013-2015 9elements GmbH
 *
 * Released under Attribution-NonCommercial 3.0 Unported
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 * For commercial use, please contact us at contact@9elements.com
 */
import { ReactBEM } from '../../../globals'
import ScreenComponent from '../screen-component'
import SubHeaderComponent from '../../sub-header-component'

import OverviewControls from '../../controls/overview/'

export default class EditorScreenComponent extends ScreenComponent {
  constructor () {
    super()

    this._bindAll('switchToControls')
    this.state = { controls: OverviewControls }
  }

  /**
   * Switches to the given controls
   * @param  {Component} controls
   */
  switchToControls (controls) {
    let newControls = null
    if (controls === 'back') {
      newControls = this._previousControls
    } else {
      newControls = controls
    }
    this._previousControls = this.state.controls
    this.setState({ controls: newControls })
  }

  /**
   * Renders this component
   * @return {ReactBEM.Element}
   */
  renderWithBEM () {
    const Controls = this.state.controls.controls
    return (<div bem='b:screen $b:editorScreen'>
      <SubHeaderComponent
        label={this._t('webcam.headline')}>
        <bem specifier='$b:subHeader'>
          <div bem='e:label'>
            {this._t('editor.headline')}
          </div>
        </bem>
      </SubHeaderComponent>

      <div bem='$b:canvasContainer e:row'>
        <div bem='e:cell'>
          {/* CanvasComponent */}
        </div>
      </div>

      <div bem='$b:controls $e:container e:row'>
        <div bem='e:cell'>
          <Controls onSwitchControls={this.switchToControls} editor={this} />
        </div>
      </div>
    </div>)
  }
}
