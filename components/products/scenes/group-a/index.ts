import type { SceneMap } from '..'
import EternalMonitorScene from './EternalMonitorScene'
import EternalRichPresenceScene from './EternalRichPresenceScene'
import Eternal2xScene from './Eternal2xScene'

/** Product scenes in group a, keyed by product id. */
export const scenesA: SceneMap = {
  'eternal-monitor': EternalMonitorScene,
  'eternal-rich-presence': EternalRichPresenceScene,
  eternal2x: Eternal2xScene,
}
