import type { SceneMap } from '..'
import EternalMonitorScene from './EternalMonitorScene'
import EternalRichPresenceScene from './EternalRichPresenceScene'
import Eternal2xScene from './Eternal2xScene'
import EternalExchangeScene from './EternalExchangeScene'
import ExerlyScene from './ExerlyScene'
import TandemCodeScene from './TandemCodeScene'

/** Product scenes in group a, keyed by product id. */
export const scenesA: SceneMap = {
  'eternal-monitor': EternalMonitorScene,
  'eternal-rich-presence': EternalRichPresenceScene,
  eternal2x: Eternal2xScene,
  'eternal-exchange': EternalExchangeScene,
  exerly: ExerlyScene,
  tandemcode: TandemCodeScene,
}
